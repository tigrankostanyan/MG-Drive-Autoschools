/**
 * Builds absolute links that leave the server (emails, notifications).
 *
 * The origin always comes from configuration, never from the request `Host`
 * header. Otherwise a spoofed Host could point a password-reset link at an
 * attacker-controlled domain and leak the reset token.
 */
function publicUrl(pathname) {
  const origin = process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (!origin) {
    throw new Error(
      "FRONTEND_URL (or CLIENT_URL) must be configured to build absolute links",
    );
  }
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin.replace(/\/+$/, "")}${path}`;
}

module.exports = { publicUrl };
