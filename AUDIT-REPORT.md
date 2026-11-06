# Inland Construction — Website Audit & Repair Report

Date: 6 Nov 2026 · Scope delivered: **main website only** · Project status: **NOT COMPLETE.** The LP site and external dependencies are outstanding (see Pending Items).

## 0. Scope note: LP site not available

The brief covers 8 pages: the main site plus 7 pages on `lp.inlandconstruction.net`. The source provided (`inland-main_1.zip`) contains **only the main static site**, and so does the GitHub repo `advancedmarketers/inland` (an older revision of the same files; the zip is newer). Neither contains any LP page, LoremFlickr reference, the `(951) 555-0142` number or the `706-2790` number. The live sites could not be loaded from the work environment. As agreed, the LP work is documented here as blocked, not guessed at.

How the main site is built: plain static HTML pages (16) + one shared `styles.css` + `app.js`. No framework, no build step. Header, mobile menu and footer are duplicated in each page.

---

## 1. Files modified

| File | Change |
|---|---|
| `index.html` | Both forms rebuilt (names, validation, status region, honeypot). Services accordion moved out of `.wrap` (removes `100vw` hack). Empty address row commented out. Scripts added. Favicon links. Footer hours link. |
| `contact.html` | Form rebuilt as above. Empty address row commented out. Scripts added. Favicon links. Footer hours link. |
| `services.html` | **Broken mobile-menu Services href fixed.** Favicon links. Footer hours link. |
| `styles.css` | Missing `financing-detail.webp` → existing `band.jpg`. Removed blanket `body{overflow-x:hidden}`. Grid min-width fixes for forms/final CTA. `100vw` removed from `.prod-stack`. Form status/honeypot styles. |
| `service-kitchen/bathroom/adu/fullhome.html` | FAQ phone mention made a `tel:` link (same number). Favicon links. Footer hours link. |
| `about, blog, blog-*, gallery, project-1, privacy, terms .html` | Favicon links. Footer hours link. |
| **New** `forms.js` | Shared lead-form handler. |
| **New** `form-config.js` | GHL settings. `endpoint: null` until provided. |
| **New** `assets/favicon.png`, `assets/apple-touch-icon.png` | Cropped from the IRC mark in the existing `logo-color.png` (no new artwork). |
| **New** `FORMS-INTEGRATION.md`, `AUDIT-REPORT.md` | Documentation. |

No phone number, email address, page or brand style was changed.

## 2. Issues fixed

1. **Forms didn't work (3 forms, not 2).** All used `onsubmit="return false"`, had no `name` attributes and sent nothing. They now have unique names/IDs, `autocomplete`, `aria-label`s, required/type/maxlength/pattern validation, a 10-digit phone check, a honeypot, duplicate-submit prevention, and loading / success / error states. Because no GHL endpoint exists, submitting shows an honest "Online requests aren't available yet — your details have not been sent" message with the page's own phone/email links. Nothing is faked. (There was no fake success script in the main site. The forms simply did nothing.)
2. **Services link 404.** On `services.html` the mobile-menu link was malformed: `href="services.html class="active""`, which resolved to `/services.html%20class=`. Fixed to `href="services.html" class="active"`. The desktop header link on every page was already valid. If the desktop link still 404s on the live host after deploy, the cause is the hosting URL rewrite (e.g. `/services` vs `/services.html`), not the markup.
3. **Horizontal overflow at 390px** on `index.html` and `contact.html` (page width 402px). Root cause: grid tracks defaulted to `minmax(auto,1fr)`, so the two-column input rows plus 38px card padding forced a 374px minimum column. Fixed with `minmax(0,1fr)` tracks, `min-width:0` on fields, single-column rows and lighter card padding at ≤480px. The blanket `body{overflow-x:hidden}` that was hiding this was **removed**, and all pages pass without it.
4. **`100vw` full-bleed on the services accordion** (`.prod-stack`): this overflows by the scrollbar width on Windows/classic-scrollbar browsers. Restructured so it sits outside `.wrap` and is full-width by layout.
5. **Missing asset:** `styles.css` referenced `assets/financing-detail.webp` (doesn't exist) for the dark CTA band. Pointed it to `assets/band.jpg`, which index.html already used for the same band.
6. **Console error on every page:** `favicon.ico` 404. Added favicon / apple-touch-icon from the existing logo.
7. **Dead links:** footer "Mon–Sat 8–5" was `href="#"` on all 16 pages. It's now plain text with the same styling.
8. **Empty contact row:** the office address had been commented out but its pin icon was left showing with no text (index, contact). Whole row now commented out. The address is kept in source for later.
9. **Unlinked phone CTAs:** the "give us a call at (951) 330-6784" FAQ answer on the 4 service pages is now a `tel:` link (same number).

## 3. Pages inspected

**Main site (all 16, fully tested):** index, about, services, service-kitchen, service-bathroom, service-adu, service-fullhome, gallery, project-1, blog, blog-plan-renovation, blog-remodel-cost, blog-time-to-remodel, contact, privacy, terms.

**LP site (0 of 7, source not available):** `/`, `/blogs/`, `/lp-adu/`, `/lp-bathroom-remodeling/`, `/lp-home-remodeling/`, `/lp-kitchen-remodeling/`, `/lp/`.

## 4. Forms found and status

| Form | Page | Before | Now |
|---|---|---|---|
| `home-hero-estimate` | index.html `#consult` | `return false`, no names, nothing sent | Validated, named, honest "unavailable" state. **Awaiting GHL endpoint.** |
| `home-footer-estimate` | index.html `#contact` | same | same |
| `contact-page-estimate` | contact.html `#contact-form` | same | same |
| LP forms | lp.* | not inspected | **Blocked: no source** |

Tested in headless Chrome: empty submit blocked by native validation; bad phone rejected; unconfigured → honest error, data kept; mocked endpoint → one request despite 3 submit attempts, correct payload, success shown, form cleared; mocked HTTP 500 → error shown, button re-enabled. The mock was intercepted inside the test browser. **No lead was sent to any real CRM.** Field list and setup steps: `FORMS-INTEGRATION.md`.

## 5. Phone buttons and numbers (unchanged)

Every clickable phone link on the main site uses **`tel:+19513306784` / "(951) 330-6784"**. That's 70 links, all valid E.164, and visible text matches the href in all of them. This matches the number in the client onboarding record.

| Location | Pages | Count |
|---|---|---|
| Utility bar | all 16 | 16 |
| Header call button | all 16 | 16 |
| Mobile menu | all 16 | 16 |
| Footer "Get in Touch" | all 16 | 16 |
| Hero ghost button | index | 1 |
| Final CTA "Call or text" | index | 1 |
| Contact info block | contact | 1 |
| Body copy | blog-time-to-remodel, privacy, terms, 4 service FAQs | 7 |
| Unlinked (meta description, not clickable by nature) | contact | 1 text mention |

**Inconsistency for verification:** the audit lists three numbers. Main site 330-6784 (found, everywhere). LP pages 706-2790 (not inspectable, no source). Yelp 946-2092 (external listing). The onboarding file also lists *Account ID 951-942-6450*, which is a different number again. **No number was changed.**

## 6. Email addresses (unchanged)

Only one address appears: **`nicholasv@inlandconstruction.net`**, which is the authorized rep's email in the onboarding record. 20 `mailto:` links: footer "Email Us" on all 16 pages, plus index final CTA, contact info block, privacy and terms body copy. No template or incorrect email exists on the main site. The "incorrect email" in the brief is on the LP root, which wasn't available. **Nothing was changed.** It needs confirming whether a personal address should be the public business contact.

## 7. LoremFlickr references

**0 found** in the provided source (searched every file). All 7 are on the LP site, so **none removed: blocked.** The main site already uses only local photos.

## 8. Content rewritten

None. The LP root and `/blogs/` rewrites are blocked (no source). The main-site copy was out of scope and left as is.

## 9. Mobile responsiveness

Automated check in headless Chrome on all 16 pages: document scroll width vs viewport, any visible element extending past the viewport edge (excluding clipped containers and the off-canvas menu), console errors, failed local requests. Mobile menu open/close tested at 390px.

| Viewport | Before | After |
|---|---|---|
| 390px | index 402px wide, contact 402px wide (masked by `overflow-x:hidden`); favicon 404 everywhere | **16/16 pass**, no overflow, no console errors, no failed requests |
| 768px | pass (favicon 404) | **16/16 pass** |
| 1440px | pass in headless Chrome. `100vw` would overflow on classic-scrollbar browsers | **16/16 pass**, `100vw` removed |

Spot-checked visually: the final-CTA form stacks cleanly at 390px, the hero form error state fits, and the desktop services accordion is unchanged in appearance.

## 10. Broken links corrected

- `services.html` mobile menu: `services.html class=` → `services.html`
- `styles.css`: `assets/financing-detail.webp` (missing) → `assets/band.jpg`
- `/favicon.ico` (missing, requested by every page) → `assets/favicon.png`
- Footer hours `href="#"` × 16 → plain text

All internal `href`/`src`/anchor targets now resolve (automated check). External links (Hearth financing, social, Google Maps) weren't reachable from the test environment and weren't verified.

## 11. Remaining issues (main site, not fixed: need client decision)

1. **Fabricated reviews on the homepage.** `index.html` `#reviews` shows three invented testimonials (Sarah M., James R., Diana L.) marked "Verified review" with 5 stars. The source comment says `PLACEHOLDER — swap with real Google / Yelp reviews before launch`. If this is live, it's a consumer-protection risk. **Recommend removing the section or replacing it with real reviews before anything else.**
2. Unverified claims to confirm with the client: "Family owned & operated", "Owner-involved… every project", "On time", the city labels on gallery photos, and "reach out within one business day".
3. `assets/svc-adu.jpg` (modern two-storey house with pool) should be confirmed as a real IRC project. The ADU service card and page rely on it.
4. The services accordion cards on the homepage link to `#consult` rather than the individual service pages. They work, but this is a missed navigation path.
5. The off-canvas mobile menu stays in the tab order when closed (keyboard accessibility). This is minor.
6. The GitHub repo `advancedmarketers/inland` is behind this zip (it still says "Bonded", which the zip removed). Make sure the right version gets deployed.

---

## PENDING ITEMS (external dependencies)

- **LP site source code.** Needed for: LP root content rewrite, `/blogs/` rewrite, removing 7 LoremFlickr images, the `(951) 555-0142` number, the LP email, LP forms, LP mobile overflow at 390px, and LP nav. Please provide the repo or export (or the builder access, if it's on a page builder such as GHL Sites).
- **GHL integration.** Waiting for the inbound webhook URL (or embed code). One-line change in `form-config.js`. Steps are in `FORMS-INTEGRATION.md`. **Leads are not being delivered until then.**
- **Phone number replacement.** Waiting for verification of which number is correct: 330-6784 (main site), 706-2790 (LP), 946-2092 (Yelp), or 942-6450 (onboarding account ID).
- **Email replacement.** Waiting for the correct business email. The main site uses `nicholasv@inlandconstruction.net` in 20 links. The LP's incorrect email hasn't been identified (no source).
- **Missing project photos.** The main site has 30+ real project photos in `assets/`, enough for the LP rewrite. Still needed: a confirmed real ADU project photo (see item 11.3), and before/after pairs if the LP wants that format (`proj-kitchen-before/after`, `proj-bath-before/after` exist).
- **Real reviews.** Needed to replace the placeholder testimonials (item 11.1).
