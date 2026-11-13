# Server architecture notes

Extended rationale that used to live in code comments, which are now limited to
15 words. Keep this file in sync when the linked behaviour changes.

## Session lifetimes

`src/constants/session.js` is the single source of truth for session lifetimes
and is kept in sync with `tests/THREAT_MODEL.md` (A5-1: 3-day idle timeout,
A5-2: 30-day absolute expiry) and `tests/auth.unit.test.js`. The session manager
and the `RefreshToken` model both read the values from there so they cannot
drift apart. Do not duplicate the numbers elsewhere.

| Value | Setting |
| --- | --- |
| Access token | 15 minutes |
| Refresh token | 30 days absolute |
| Idle timeout | 3 days |

## Canonical authentication-cookie policy

The application runs two independent session models: the short-lived JWT with a
rotating refresh pair, and the double-cookie OAuth session. They used to build
their cookies by hand and had drifted apart — one used `SameSite=Lax` and
derived `Secure` from the request, the other used `SameSite=Strict` and derived
`Secure` from `NODE_ENV`. Both now build every credential cookie from
`authCookieOptions()` in `src/constants/session.js` so the posture cannot drift
again.

Policy:

- `HttpOnly` is mandatory for credential cookies.
- `Secure` is mandatory: an HTTPS request always sets it, and production sets it
  unconditionally so a broken proxy setup can never downgrade the flag.
- `SameSite` defaults to `strict`. The only sanctioned exception is the OAuth
  *state* cookie, which must survive a cross-site redirect (see
  `src/routes/auth.js`); it is a one-shot anti-CSRF value, not a credential.
- No `Domain` attribute, so cookies are host-only and a sibling subdomain can
  never be handed the credential.

## Multi-factor authentication

`src/controllers/mfa.js` has two halves: enrollment (admin-only, session
required) and the login challenge (public, rate-limited). The TOTP primitives
live in `src/utils/totp.js` and the pre-authentication challenge token in
`src/utils/sessionManager.js`.

The password stage never mints an access/refresh session for an MFA-enabled
admin. It returns a short-lived challenge token instead; only
`POST /api/v1/auth/mfa/challenge` can redeem it for a real session. Enrollment
leaves `mfaEnabledAt` null until `/mfa/verify` confirms the user can produce a
valid code, so a half-finished enrollment can never lock an account out.
Recovery codes are single-use and only their SHA-256 hashes are persisted.

## Step-up

`requireStepUp(maxAgeMinutes)` in `src/middleware/authenticate.js` guards
high-impact admin actions (disable/delete users, force-logout). Freshness comes from `user.mfaVerifiedAt`, written on every successful
TOTP or recovery-code challenge and on enrollment.

The gate applies only to accounts that have MFA enrolled. For an account
without a second factor there is no MFA timestamp to freshen, and demanding one
would either lock out every existing admin or silently introduce an unreviewed
"MFA required" policy. That behaviour is recorded in the release report.

## Rate limiting

Every limit lives in `src/utils/limiter.js` (per-route tiers) or
`src/middleware/rateLimiter.js` (layers). Posture (Playbook ABUSE-01):

- Every limit keys on the client IP that `trust proxy` resolved in `app.js`,
  never on a raw header read at the call site.
- Counters live in express-rate-limit's in-memory store, so they are
  per-process. That is correct for the current single-instance deployment. If
  the API is ever scaled to several replicas these numbers must move to a
  shared atomic store (`utils/redisClient.js`) or the effective limit silently
  multiplies by the replica count.
- Store failure is `passOnStoreError: true`: a broken counter must not lock
  everyone out of login. Brute force stays bounded by the account-level
  `loginAttemptGuard`, which reads MySQL rather than this store, so the two
  controls do not fail together.
- A blocked request always returns the standard `RateLimit-*` / `Retry-After`
  headers plus a JSON body carrying `retryAfter` seconds.
- Change `max`/`windowMs` only with a number observed on the route.

### Login attempt guard

The guard tracks failures in the `login_attempts` table and blocks for 15
minutes after 5 consecutive failures per (identifier, IP). Pairing the two is
deliberate: an identifier-only counter lets anyone who knows a victim's email
lock that account out by submitting five wrong passwords, while pairing it with
the source IP means an attacker can only lock out their own address. The table
already carries an `(identifier, ip_address, attempted_at)` index for this
query, so the extra predicate is free.

The source address is stored verbatim on purpose: the guard counts per
`(identifier, ipAddress)`, so a hashed value would break the control unless the
same salt were applied on read, and the column is `STRING(45)` — too short for
a digest. This table is a security record, not a log sink; the redaction rule
covers the log/APM path, which `utils/securityLogger.js` handles. Retention for
these rows still needs an owner (DATA-01).

### MFA challenge limiter

The MFA challenge step has its own budget, separate from `loginLimiter`, so a
burst of TOTP typos cannot exhaust the password-stage allowance. It is tight
enough that 6-digit codes are not brute-forceable (10^6 space against 10
attempts/hour is not a practical guessing surface).

## TOTP

`src/utils/totp.js` implements RFC 6238 TOTP (and RFC 4226 HOTP) on Node's
built-in `crypto`, with no native dependency. HMAC-SHA1 comes from Node's
OpenSSL bindings and the base32 codec is a pure-JS RFC 4648 implementation.
Defaults match the RFC 6238 reference configuration (SHA-1, 6 digits,
30-second step).

## Security audit logging

IP addresses are classified as confidential and must never reach logs or the
audit table in raw form. `redactIp()` keeps only the routing prefix: enough to
group events by network for incident response, not enough to identify a host.

Audit persistence is best-effort by design. A logging failure must never take
down the request that triggered it, but it must not be silent either: in
production every security event is supposed to land in the audit table, and a
missing model means the audit trail is stdout-only. The gap is surfaced once,
loudly, instead of being swallowed.
