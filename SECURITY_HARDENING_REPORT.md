# MG Drive — Անվտանգության աուդիտ և ամրապնդման հաշվետվություն

**Ամսաթիվ:** 2026-11-13
**Նախագիծ:** mg-drive-monorepo (apps/server — Express API, apps/web — TanStack Start/React)

---

## 1. Ամփոփում

Կոդի մակարդակի անվտանգությունը **շատ բարձր է** (հազվադեպ լավ մակարդակ)։ Իրական խնդիրները երեքն են՝

1. **Git-ում commit-ված իրական գաղտնիքներ** (repo-ն GitHub-ում public է)։
2. **Web-ը աշխատում է Vite dev սերվերով**, ոչ թե production build-ով։
3. **TLS/HTTPS բացակայում է** (և Docker-ում MySQL/Redis-ը բաց էին դեպի հոսթ)։

Գաղտնիքները, dev-serve-ը և պորտերի բացումը **ուղղվել են** այս հաշվետվությամբ (տես §2)։ Գաղտնիքների **ռոտացիան** պարտադիր է քո կողմից (տես §3)։

---

## 2. Ինչ արդեն ուղղվել է (այս նստաշրջանում)

| # | Ֆայլ | Ուղղում |
|---|------|---------|
| 1 | `docker-compose.yml` | Հանված են commit-ված գաղտնիքները (Google OAuth secret, JWT, CSRF, DB). Այժմ պահանջվում են `.env`-ից (`${VAR:?msg}` fail-fast)։ `NODE_ENV=production`։ MySQL/Redis պորտերը կապված են միայն `127.0.0.1`-ին։ URL-ները՝ `${SITE_URL}`-ով։ |
| 2 | `apps/server/src/middleware/ipBlacklist.js` | IP-սպուֆինգի վեկտորը փակված՝ ձեռքով X-Forwarded-For վերլուծության փոխարեն օգտագործվում է trust-proxy-ով հաստատված `req.ip`։ |
| 3 | `apps/server/app.js` | Ֆայլի չափսի սահմանի գերազանցումը մերժվում է 413-ով (`abortOnLimit` + `limitHandler`)։ |
| 4 | `apps/server/src/security/cors.js` | Production CORS-ի ցանկից հանված են կոդում կոշտ գրված `localhost`-երը; dev-ում localhost-ը դեռ թույլատրվում է։ |
| 5 | `apps/server/.env.example` | Իրական JWT/CSRF/Google/DB գաղտնիքները փոխարինված են `CHANGE_ME`-ով։ |
| 6 | `PRODUCTION_AUDIT_REPORT.md` | Իրական Stripe/Google/JWT/email արժեքները դարձած են `[REDACTED]`։ |
| 7 | `cookies.txt` (արմատ) | Ջնջված է (սեսիա-քուքի էր պարունակում)։ |

Ստուգում․ բոլոր խմբագրված JS ֆայլերը `node --check`-ով անցնում են առանց սխալի, և tracked ֆայլերում իրական գաղտնիքների արժեքներ այլևս չկան։

---

## 3. Պարտադիր քո կողմից՝ գաղտնիքների ռոտացիա (շտապ)

Repo-ն **public է**՝ `github.com/tigrankostanyan88/MG-Drive-Autoschools`, և git-ի պատմության մեջ մնացել են հին արժեքները։ Ֆայլերը մաքրված են, բայց **հին գաղտնիքները պետք է դառնան անօգտագործելի**.

1. **Google OAuth client secret** (2 արժեք է արտահոսել) → Google Cloud Console → Credentials → նորը ստեղծել, հինը revoke, դնել `apps/server/.env`-ում։
2. **JWT_SECRET** → `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` → նոր արժեք `.env`-ում։
3. **CSRF_SECRET** → նույն եղանակով նոր 32+ նիշանոց արժեք։
4. **DB գաղտնաբառ** → ուժեղ նորը `.env`-ում (և docker-ի `.env`-ում)։
5. **Email app-password** → Google App Passwords-ից հինը ջնջել, նորը ստեղծել։
6. **Stripe** (եթե դեռ օգտագործվում է) → Stripe Dashboard-ից `sk_test_...` / `whsec_...` revoke։
7. **Repo-ն private** → GitHub → Settings → General → Danger Zone → Change visibility → Private։
8. (Ըստ ցանկության) git history-ի մաքրում (`git filter-repo` կամ BFG) — բայց ռոտացիայից հետո միայն իմաստ ունի։

---

## 4. Սպասում է որոշման՝ deployment

### 4.1 Production build (կրիտիկական)
Հիմա `apps/web/Dockerfile`-ը գործարկում է `npx vite --host 0.0.0.0` (dev սերվեր), իսկ `package.json`-ի `start`-ը՝ `vite preview`։ **Սա production-ի համար չէ** — dev սերվերը բացահայտում է `/src/**` և `/@fs/**` (կոդի ամբողջական ընթերցում)։

Պետք է որոշել թիրախ հարթակը․
- **VPS / Docker** → `vite build` (node-server preset) + Node սերվեր + nginx/Caddy + Let's Encrypt HTTPS։
- **Cloudflare** → web-ը `wrangler deploy` (ներկա nitro `cloudflare-module` preset-ն արդեն դրա համար է), API-ն՝ Docker-ով VPS-ում։

### 4.2 TLS/HTTPS
HTTPS + HSTS չկա։ Հարթակը որոշելուց հետո ավելացվելու է (nginx/Caddy կամ Cloudflare)։

---

## 5. Խորհուրդ (ավելի ամուր, ըստ կարևորության)

1. **Կախվածությունների թարմացում + `npm audit`**․ հատուկ ուշադրություն՝
   - `express` 4.18.2 → 4.21.x (4.18.x-ում հայտնի խոցելիություններ կան),
   - `express-fileupload` 1.5.2 — ստուգել `npm audit`,
   - `jsonwebtoken` 9.0.2 → կախյալ `jws@3.2.2` խոցելի է։
2. **Redis գաղտնաբառ** (`requirepass`) + **MySQL առանձին user** (ոչ root)։
3. **Docker non-root user** (այժմ root-ով է աշխատում)։
4. **`method-override` հեռացում** (`app.js:74`) — հավելվածը չի օգտագործում `_method`, ավելորդ հարձակման մակերես է։
5. **Գաղտնիքների pre-commit սկան** (husky + gitleaks/secretlint), որ նորը չմտնի git։

---

## 6. Ինչն արդեն ուժեղ է (ստուգված, ոչ մի փոփոխություն չի պահանջում)

- **Սեսիաներ**՝ երկքուքի (double-cookie) httpOnly սեսիաներ, MySQL-ում հեղինակավոր, Redis-ը միայն cache, token-ռոտացիա grace-պատուհանով, IP+User-Agent fingerprint, idle timeout, slide, «այլ սարքից մուտք» հեռացում։
- **MFA** (TOTP) admin-ի համար + `requireStepUp` զգայուն գործողությունների վրա։
- **CSRF**՝ HMAC-signed double-submit + Origin ստուգում + Fetch-Metadata ֆոլբեք, timing-safe համեմատում, query-string-ում token-ի արգելում։
- **Գաղտնաբառեր**՝ Argon2id + bcrypt միգրացիա, policy, anti-enumeration (generic սխալ + 500ms delay)։
- **Rate limiting** + per-(email, IP) login lockout + bot-detector + IP auto-blocklist (Redis)։
- **Helmet/CSP/HSTS** (preload), X-Frame-Options DENY, nosniff, referrer-policy, permissions-policy, COOP/COEP/CORP։
- **Մուտքի վերահսկում**՝ `requireRole`/`restrictTo` (role-ը DB-ից), mass-assignment ֆիլտր (`fieldFilter`), `requireStepUp` admin-ի փոփոխությունների վրա, `/admin`,`/tests`,`/groups`,`/profile` բոլորը **սերվերի կողմից redirect** (307) չմուտքագրվածի համար։
- **Ֆայլեր**՝ hash-ով անուններ, սպիտակ ցուցակ (միայն պատկերներ), sharp-ով վերամշակում (payload-ների զտում), path-traversal պաշտպանություն։
- **Սխալներ/սեկրետներ**՝ production-ում generic սխալներ (stack չի արտահոսում), `.env`-երը gitignore-ում, client-ում միայն `VITE_*` (zod strict), CSP nonce, Sentry redaction։

---

## 7. Հաջորդ քայլեր

1. Ռոտացիա (§3) — **առաջինը**։
2. Որոշել հարթակը (§4) → production build + TLS։
3. `npm audit` + կախվածությունների թարմացում (§5.1)։
4. Ըստ ցանկության՝ §5-ի մնացած կոշտացումները։
