# ooOS Cover Intelligence v1

## Implemented
- A cover editorial QA engine in `src/utils/coverIntelligence.js`
- `/os` panel evaluating genre, layout, title length, subtitle length, color count
- Mandatory human sign-off for 120px mobile thumbnail, image/font rights, and printer preflight
- Block/HOLD for missing title/author or unchecked rights / print evidence
- Risk score is **not** a claim about bestseller potential or verified print readiness.

## Methodology and limits
- Prior "100 covers" work established a research protocol, **not a completed coded dataset of 100 independently verified bestselling covers**.
- No book-cover reference images are copied or packaged; the current feature is rules-based.
- Production deployment, full visual inspection, and independent print file verification require follow-up.
- Design inputs remain per-session and are not yet stored in a persistent snapshot. Do not promise persistence.

## QA acceptance
1. `npm run build` succeeds.
2. `/os` loads on phone-sized viewport without horizontal overflow.
3. Title/author empty → HOLD.
4. Rights or print preflight unchecked → HOLD.
5. Genre/layout/color and subtitle controls change displayed risk findings.
6. No claim of bestseller score, rights clearance, or final print approval.
