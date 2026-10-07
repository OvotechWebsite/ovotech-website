# Six requested website fixes

## Backup and scope

- Unchanged starting commit: `34f4d38d4271bb9e9eb1967565c393729a0b2789`.
- GitHub backup branch: `codex/backup-before-six-fixes`.
- Local ZIP: `deliverables/Ovotech-GitHub-Before-Six-Fixes.zip` in the parent workspace.
- Working branch: `codex/six-website-fixes`.
- Preserve “The AI operating layer for primary care”, the existing page layouts, eight modules, forms and backend.

## Changes

1. Replace vendor-specific EMIS/SystmOne wording with clinical-system terminology and write-back with patient-record updates. Screenshots with embedded vendor wording are replaced by labelled SVG workflow illustrations, not presented as actual screenshots. Original image files remain in the repository for reference.
2. Match the owner's confirmed assurance wording across homepage and Trust: DTAC compliant, DSPT standards met, ISO 27001 certified, Cyber Essentials certified. IM1 is consistently described as in progress, matching the existing Trust status; no new approval is asserted. Confirm integration readiness before changing that status.
3. Add a linked website privacy page and footer/form links. The owner confirmed OVO TECH (NW) LTD and retention only until an enquiry has been actioned, followed by deletion. The privacy page is deliberately marked as a draft and noindexed pending confirmation of lawful basis, providers/processing locations and international-transfer safeguards. Do not publish the unfinished legal text as a final notice. The existing backend has no automatic enquiry-deletion workflow; the retention policy needs an operational deletion process.
4. Replace native prompt dialogs with an inline amendment form. Save, Cancel, required values, numeric code format, safe text rendering, Undo and full Reset are supported. Code-format validation is not a SNOMED catalogue validation. Server-rendered scripts on the coding page are inert until the client initialises them, avoiding the previous double execution.
5. Add the previously prepared Medical Coding features/advantages/benefits guide in PDF and Word formats, plus an assurance-request card.
6. Remove the empty testimonial section entirely.

## Validation

- Production build and TypeScript pass (`npm run build`).
- Browser: amend term/code/reason, save, undo to original values, cancel without changes, and reset an amended term to its original value.
- Browser: homepage still says primary care; no empty testimonial heading; homepage and Trust certification badges agree.
- Browser: resources cards render at the current narrow viewport and expose both downloads.
- HTTP: PDF and DOCX return 200 with the appropriate content types.
- PDF text: five pages, no EMIS/SystmOne/write-back references.
- No populated enquiry was submitted and no production deployment was made.

## Release review

Complete the marked privacy details and confirm its text before merging. Review the replacement illustrations alongside the site design. Check certificate scope/validity against the assurance pack. The broader earlier QA report contains other issues outside these six requested changes; this branch is not a full-site sign-off.
