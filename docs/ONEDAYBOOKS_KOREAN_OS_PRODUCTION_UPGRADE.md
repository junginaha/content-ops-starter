# OneDayBooks Korean Publishing OS — Production Upgrade Contract
Date: 2026-10-11
Status: architecture approved for implementation; not a production-complete claim.

## Verified current baseline
- `src/utils/onedaybooksEngine.js`: plain-text normalization, basic issue scanning, HTML book proof (140×210).
- `src/utils/epubBuilder.js`: browser-side EPUB3 ZIP generation; single content.xhtml, one-entry NAV.
- `src/utils/pdfPreflight.js`: browser-side PDF token scan. This is **advisory** only and must not assert press readiness.
- `src/utils/releaseBuilder.js`: EPUB, HTML proof, clean TXT, metadata, SHA-256 manifest. **Not** a press-ready print PDF.
- `docs/ONEDAYBOOKS_OS_MVP.md`: existing P0 workflow and internal measurements.
- Existing website routes and public business service are out of scope of disruptive changes.

## Product invariants
1. Canonical `BookSpec` is a deterministic typed AST: `book > frontmatter/chapters/backmatter > blocks > inline spans`; stable IDs and original-source line/offset mapping.
2. Each imported DOCX, HWPX, TXT/Markdown is preserved byte-for-byte and SHA-256 hashed. PDF is accepted only as reference or with explicit extraction-quality warning; never silently flatten captions/tables/footnotes.
3. User-authored edits are never silently rewritten. AI suggestions are separately tracked, diffed, and author-approved.
4. Shared design token set drives cover, frontmatter, chapters, footnotes, and export outputs. 140×210mm is a **preset**, not a universal trim size.
5. Printed book interior PDF, wrap cover PDF and reflowable EPUB must be generated as three distinct deliverables from one approved snapshot.
6. No unconditional promise of ISBN issuance, bookstore listing, dispatch, or same-day external production.
7. Author rights, licenses, credits and sensitive manuscript access are explicit gated decisions.
8. Do not upload copyrighted manuscripts, personal data, or unpublished works to external providers without a clear permission boundary.
9. No production deployment or main branch merge until complete acceptance checks pass.

## Output architecture
```
Input adapters (TXT/MD/DOCX/HWPX) => loss report + immutable originals
  => BookSpec canonical JSON + assets + metadata + revision history
  => editorial rule engine + optional LLM suggestions + approval
  => design tokens + genre-specific curated templates
  => rendering adapters:
       print: Vivliostyle vs PrinceXML benchmarked on Korean fixture corpus
       ebook: EPUB3 (chapter XHTML, nav/landmarks, images, alt, CSS)
       cover: width = back + spine + front + bleed/safety; printer-specific
  => validators:
       EPUBCheck; rendering diff; font embedding; PDF parser; PDF/X profile
       dimensions/TrimBox/BleedBox; effective DPI; color/ICC; binding/page count
       rights/metadata/version/approval checks
  => human release certificate + signed checksums
  => distribution/print adapters (only after confirmed integration contracts)
```

## Required upgrade sequence / acceptance
### P0: safe QA terminology [first protective patch]
- Browser PDF token scanner reports `advisoryPassed`, never `ready=true`.
- Actual readiness is blocked pending PDF library/preflight validation.
- Test PDFs include compressed/xref-stream files, multiple page sizes, missing font embedding, RGB/CMYK and transparent objects.
- A failed or unverified check must block `PRINT_READY`.

### P1: canonical BookSpec and deterministic Korean parser
- Split metadata, title, chapter hierarchy, paragraphs, epigraph, captions, footnotes, tables, figures, bibliography, rights.
- Maintain original-to-normalized mapping and paragraph IDs.
- Compare TXT/DOCX/HWPX fixture ingestion to expected AST; fail on missing content.
- Validate Hangul composition, Unicode normalization decisions, punctuation, hanging and widow/orphan handling.

### P2: print engine + template system
- Compare Vivliostyle and PrinceXML on identical Korean fonts and licensed fixtures.
- Paginated layout MUST include fixed trim, running heads, page numbers, chapter starts, notes, captions, blank-verso handling.
- Validate all pages independently; use explicit MediaBox/TrimBox/BleedBox configuration per printer.
- Separate interior bleed policy from cover bleed; NEVER assume all interiors must be trim+6mm.
- Record font licenses/embedding rights. Do not distribute bundled proprietary font binaries.

### P3: professional cover
- Curated design system (typography hierarchy, grids, colors, image provenance and crop).
- Calculate spine from printer-specific stock + binding + final page count; no universal formula.
- Distinguish foil/spot process plate, rich black, overprint and printer-provided ICC preset.
- Black-on-black art and specialty finish require dedicated proof and printer confirmation.
- Unit and visual comparison tests between cover and inside design.

### P4: production EPUB3
- One chapter per XHTML with stable heading anchors.
- Correct full `nav.xhtml` and landmarks, OPF metadata, image embedding/alt and accessible reading order.
- EPUBCheck in CI; open in at least two reading engines; cover and page breaks smoke tests.
- ISBN must be verified before asserting validity; book-specific format identifiers managed separately.

### P5: workflow OS and controlled release
- Persistent per-project status, retries, idempotent jobs, snapshots, queue, audit log.
- States: RECEIVED -> NORMALIZED -> EDITORIAL_REVIEW -> DESIGNED -> PROOF -> QA -> AUTHOR_APPROVED -> RELEASE_APPROVED -> EXPORTED.
- Restricted transitions; blocking checks and human rights approval prevent unsafe release.
- Export `print/interior.pdf`, `print/cover.pdf`, `ebook/book.epub`, original/snapshot, report, release manifest.
- Checksums and timestamp refer to one immutable approved revision only.
- B2B tenant isolation, encryption at rest, role-based authorization; no manuscripts in public repository or browser-local long-term storage.

### P6: practical business proof
- Run at least three real approved Korean manuscripts covering prose, images/tables, footnotes.
- Record end-to-end internal elapsed time, human minutes/title, QA first-pass rate, rework rate, real COGS/title.
- Printer acceptance of interior+cover and retailer EPUB acceptance required to claim production-ready.
- Compare owner intervention: measured baselines only, never invented values.

## Acceptance commands (when toolchain installed)
- `npm run build` and dedicated tests must pass on feature branch.
- `epubcheck ebook/book.epub`: zero errors for release build.
- Professional PDF preflight: zero critical issues AND all unresolved checks addressed for selected printer.
- Independent rendered proof inspection; author/editor release approvals attached.
- After validation: create PR, seek review; do not auto-merge/deploy.

## Reference architectures (do not claim internal tech stack knowledge)
- Spines: integrated publishing workflow and human/AI operations.
- Reedsy: predesigned typography themes and book design workflow.
- Pressbooks: single-source multi-format publishing.
- Leanpub: manuscript in Git/GitHub with API-driven builds.
- Lulu: print and fulfillment API adapters.
