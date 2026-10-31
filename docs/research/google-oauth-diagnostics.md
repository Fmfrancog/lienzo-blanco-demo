# Google OAuth diagnostics (2026-10-31)

The Android screenshot's generic Google error and `/#sb=` are consistent with the old callback-error branch: it deleted `error`, `error_code`, and `error_description` and left `sb`. This is evidence of lost diagnostics, **not evidence of a PKCE defect or invalid Google secret**. The original provider error is unavailable; actual production authentication failure remains unconfirmed.

## Scoped fix

- Map callback error metadata to fixed Spanish guidance and public `PLUR-AUTH-*` categories before cleanup. No raw error descriptions, arbitrary codes, OAuth state, or tokens are displayed, logged, or persisted by diagnostics.
- Await Supabase `auth.initialize()`'s cached promise (SDK source verified), rather than retrying the code exchange. `getSession()` alone loses initialization errors.
- Detect a skipped PKCE callback when its code remains after successful initialization; the SDK skips exchange without a verifier. Clean failed callback parameters too.
- Preserve PKCE, sessionStorage, shared account identity, server authorization, cart, guest checkout and per-account isolation. No credentials/configuration changed.

## Public codes

- `PLUR-AUTH-PROVIDER`: upstream callback/service failure (not proof of a bad secret).
- `PLUR-AUTH-CONFIG`: recognized provider/configuration error.
- `PLUR-AUTH-DENIED`: cancelled/rejected authorization.
- `PLUR-AUTH-VERIFIER`: callback skipped because its verifier was unavailable.
- `PLUR-AUTH-EXPIRED`: expired/missing flow or invalid verifier/grant.
- `PLUR-AUTH-CALLBACK`: other unrecognized callback/initialization failure.

These categories are deliberately coarse, untrusted URL values never establish identity. Only existing Supabase/server verification does that.

## Verification

`node scripts/test-account-diagnostics.mjs`: hash callback matching screenshot path, query denial/config-only error, unknown attacker-controlled metadata, missing verifier; sentinel absent from DOM, storage, URL and console.

`node scripts/test-account-pkce.mjs`: real SDK with intercepted external OAuth/token network boundary, S256 PKCE, exactly one exchange on success/rejection and zero with no verifier; safe initialization error, URL cleanup, cart/reload and checkout recognition. No real Google identity or orders. Reject fixture includes Supabase's API-version and CORS-exposed header to exercise actual SDK error-code parsing.

RED: diagnostic browser test failed against original static export on PROVIDER; pre-deployment production PKCE tests failed on VERIFIER and independently EXPIRED. GREEN: same tests pass against changed static export. Existing callback, checkout, isolation, session, UI and address browser tests pass; account/payment-link static checks and `npm run check` pass.

No Supabase admin environment variable or standard CLI access-token file was available; admin logs were not inspected. Do not infer root cause from synthetic fixtures. After deployment, retry once from the same tab/browser and report only the public `PLUR-AUTH-*` code, never the callback URL or tokens.
