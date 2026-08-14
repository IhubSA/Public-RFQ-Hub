/* ============================================================
   SUPABASE
   ============================================================ */
const SUPABASE_URL = 'https://fokopyjwxlssazaqrldi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZva29weWp3eGxzc2F6YXFybGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTMwMjQsImV4cCI6MjEwMTQ4OTAyNH0.u0QPghZQb9tUrGyQXOzFC5nhXY6p9MzW8cF0SXwTehY';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   VERSION
   ============================================================ */
const VERSION_INFO = {
  version: "2.33.1",
  date: "2026-08-13",
  changelog: [
    "2.33.1 (2026-08-13) — Submitting an application used to just show a small toast that disappeared after a few seconds — easy to miss, and it said nothing about what actually happens next. Applicants now see a proper confirmation screen after applying, staying open until they dismiss it, with their reference number and a clearly set-apart message telling them plainly: their application will be reviewed, and if shortlisted, they'll receive an email with a secure link to submit their full proposal and supporting documents — with a nudge to check spam/junk too. Verified directly with a real rendered screenshot, not just the logic: the modal opens with the correct RFQ title and reference number populated, and the confirmation email still fires exactly as before.",
    "2.33.0 (2026-08-13) — Real phone and tablet pass on the admin console. The sidebar previously collapsed to a bare 64px strip of unlabelled numbers on any screen under 900px wide — barely usable for real navigation. It's now a proper hamburger menu opening a full off-canvas panel with real labels, that closes itself automatically once you tap where you're going. Tables that used to blow out the entire page width on a phone (the RFQ register, Approvals, Audit Trail, Employees, Clarifications, the email log) now scroll horizontally within their own space instead of breaking the layout around them. The New RFQ form's Opens/Closes date fields, which got cut off side-by-side on a true phone width, now stack vertically below it. The public portal was already in solid shape and needed no changes — checked directly at both phone and tablet width. Along the way, testing surfaced and fixed two real bugs in the new mobile nav itself before they shipped: the background dimming overlay could get stuck visible after auto-closing the menu via navigation, and the open sidebar briefly shared a stacking layer with modals, risking one rendering behind the other. Verified directly with real screenshots at 375px and 768px, not just by reasoning about the CSS: sidebar open/closed/auto-close states, the RFQ table scrolling correctly instead of overflowing, the date fields stacking, and the dashboard and kanban pipeline both making full use of the reclaimed width.",
    "2.32.1 (2026-08-13) — The proposal submission deadline field used to pre-fill with a default of 14 days out when inviting an applicant — easy to accidentally accept without actually thinking about whether it was the right date for that specific case. The field now starts genuinely empty every time, forcing a deliberate choice before the invitation can go out. The existing rule that blocks approval without a date was already there and is unaffected — this only removes the default that made it easy to skip past without noticing. Verified directly: the field opens empty, approval is still correctly blocked if left that way, and a properly entered date still works exactly as before.",
    "2.32.0 (2026-08-13) — The public application form now blocks a company from applying to the same RFQ more than once, checked server-side (so it can't be bypassed by tampering with the form) against both company registration number and email address, trimmed and case-insensitive so formatting differences don't slip through. A genuine attempt gets a clear explanation and is pointed to contact procurement directly rather than resubmitting. Fixing this exposed a real problem in how submissions were handled: the form used to show \"Application received\" immediately, before the database write even happened — meaning a rejected duplicate would show a false success message immediately followed by a contradicting error. Submission now properly waits for a real answer from the server before saying anything either way, and the button disables with a 'Submitting…' state in between so there's no room to double-click a submission either. Also fixed a small correctness bug found along the way: the closing-date check on applications was still comparing against a bare date left over from before closing times existed, not the precise timestamp the rest of the system now uses. Verified directly: the duplicate check catches whitespace and case variations against real data, a rejected duplicate shows exactly one clear message with no phantom local entry and the button correctly re-enabling, and a genuine submission still succeeds and fires its confirmation email exactly as before.",
    "2.31.0 (2026-08-13) — Removed the closing-date review lock entirely, at your explicit request, so urgent RFQs can be screened, validated, evaluated, and moved through to an invitation without waiting for the tender to close. Applications, comments, and scoring can now happen on any RFQ regardless of whether it's still open — this reverses the database-level restriction added in an earlier version, across every layer it touched (the database policies on applicants, timeline events, and evaluations, and the matching interface messages that used to block those actions). Two related things were deliberately left untouched, since they're separate features: the 'Closed for Applications' badge on the register still updates correctly once a tender's time passes, and evaluation is still only possible in its own window (Under Evaluation through the Recommendation gate) — that restriction is about pipeline stage ordering, not closing dates, and wasn't part of what changed. Verified directly against the database that reviewing an applicant on an RFQ closing 10 days out now succeeds, and confirmed both of the untouched features still behave exactly as before.",
    "2.30.1 (2026-08-13) — Applications were already fully visible in the Applicants pipeline before an RFQ closes (that was never actually restricted, only reviewing them was) — but there was no quick way to see how many an RFQ had received without leaving the register and digging through a separate tab. The RFQ register now has an Applications column showing a live count for each tender, right next to its status — a non-zero count stands out in bold, so it's obvious at a glance whether interest is coming in, even while the tender is still open. Carried through to the Print / Download List too, so what's printed always matches what's on screen. Verified directly: the count is correct per RFQ, a genuinely empty RFQ shows a muted \"0 received\" rather than looking broken, and the printed list includes the same column with the same numbers.",
    "2.30.0 (2026-08-13) — The invitation to submit a proposal never actually told the applicant when it was due — only the original application had a deadline, and that's a different stage entirely. Approving the Validation gate now requires setting a genuine submission deadline (a real date and time, defaulting to 14 days out but fully adjustable), which is included in the invitation email, shown again prominently on the applicant's submission page, and actually enforced — the system rejects a submission outright once the deadline has passed rather than just displaying it as a suggestion. Staff can see the deadline in the case drawer both before submission (what was promised) and after (what it was). Verified directly: the field only appears for this specific decision, can't be left blank or set in the past, saves atomically alongside the existing invitation token, the real email content was sent and confirmed readable, and the public submission page both displays the deadline correctly and fully blocks the form once it's passed.",
    "2.29.0 (2026-08-12) — RFQs can now have an approver assigned to them, right from the New/Edit RFQ form — a dropdown listing only staff with Approve & Publish RFQs permission. Assigning someone (or changing who's assigned) emails them directly that an RFQ needs their attention, with a link straight to the admin console. This fires when a Draft is newly assigned an approver, and also when a status-change request (Pause/Cancel/Under Review) comes in on an RFQ that already has one assigned — both are genuinely the same underlying need: someone with sign-off authority needs to know something is waiting on them. Re-saving with the same approver already assigned does not re-send the email. Verified directly: the dropdown correctly excludes staff without the right permission, a new assignment notifies the right person with the database write confirmed first, an unassigned RFQ sends nothing, re-saving without changing the approver doesn't re-notify, and a status-change request correctly reaches the assigned approver with the actual reason included.",
    "2.28.0 (2026-08-12) — Added a Print / Download List button to the RFQ register. It opens a clean, formatted version of the register in a new tab and triggers the browser's print dialog, which doubles as a PDF download on every modern browser — no separate export step needed. It respects whatever filters are currently applied (type, status, date range), and says so on the printed page, so what you print always matches what you were looking at on screen. Verified directly: an unfiltered print includes every RFQ with a correct count and 'No filters applied' note, a filtered print includes only the matching RFQs with the applied filters listed, a filter combination matching nothing shows a clear empty message rather than a blank table, and a blocked pop-up tells the user why instead of silently doing nothing.",
    "2.27.1 (2026-08-11) — A genuinely serious one: the admin console treated an empty RFQ table as \"this must be a fresh install\" and automatically wrote the built-in demo dataset back into the live database on load. That logic made sense back when this system had never been used for anything real, but it directly undid a deliberate, requested data reset the moment anyone next opened the admin console — with only an easy-to-miss footer note as any indication it had happened. An empty database is now simply treated as empty, exactly as entered, with no silent repopulation under any circumstance. Verified directly: loading against a database with zero RFQs results in zero RFQs shown, zero write attempts back to the database, and no seeding claim in the footer.",
    "2.27.0 (2026-08-11) — The Scores & ranking panel on Approvals now groups bidders by their RFQ with a clear section header (title, status, bidder count) instead of a flat table where every RFQ's vendors ran together with just a repeated ID column. Each RFQ's bidders now rank and sort within their own section, exactly as they were compared, just far easier to actually read. Bidders who've reached the Recommendation gate now get a 'Select as Preferred Bidder' button right there in the comparison view — it opens the exact same accountable decision modal used everywhere else in the system (name, role, conflict declaration, reason all still required), so choosing a winner while looking at the full comparison doesn't skip any of the sign-off this system is built around. Nothing stops selecting more than one bidder on the same RFQ as Preferred Bidder \u2014 that was already true before this change, just not obvious from the old flat table; each selection is still its own individually accountable decision rather than a bulk tick-and-submit, since a joint-award reason for one vendor is rarely the same as for another. Verified directly: sections render correctly per RFQ, the button only appears at the right stage, an already-selected bidder shows a marker instead of a duplicate button, and clicking through opens the real gate decision with the correct stage and labelling.",
    "2.26.2 (2026-08-11) — The RFQ register kept showing 'Open for Applications' for tenders that had genuinely closed, which read as misleading at a glance. The status badge now shows 'Closed for Applications' once the closing time has passed, in a neutral grey rather than the active gold used for genuinely open tenders. This is display-only by design — the actual stored status stays exactly as it was, since the public portal's visibility rules, the database-level review lock, and the status-change workflow all depend on that real value being untouched. Filtering the register by status still searches the real value too, so nothing else changed underneath. Verified across 8 scenarios: still-open, closed, Published-status closed, and every unrelated status (Draft, Paused, Awarded, Cancelled, no closing date set) all behave exactly as they should, with the underlying stored value confirmed unchanged throughout.",
    "2.26.1 (2026-08-11) — Regret emails were showing a generic, randomly-picked reason from a fixed list ('Mandatory information not supplied', etc.) instead of whatever the reviewer actually typed into the Reason field — meaning the real, specific explanation staff wrote never reached the applicant at all. The Reason field is now what gets sent, word for word, and it's required before a rejection can be recorded — no more silent fallback to a generic line. The field's label now makes clear this text goes straight to the applicant by email, so it's written with that in mind. Verified directly: rejecting with no reason is blocked, the exact typed text is what ends up as the applicant's reason (not a random pick), and this holds across every regret-capable stage.",
    "2.26.0 (2026-08-11) — The public tender listing is now split into two clearly headed sections — Open Tenders and Recently Closed — instead of one flat list. Within Open Tenders, the most recently posted RFQ shows first; within Recently Closed, the one that closed most recently shows first, oldest at the bottom. Verified directly: both section headings appear in the right order, sort order holds within each section, and the layout stays correct whether there are only open RFQs, only recently-closed ones, both, or none at all.",
    "2.25.2 (2026-08-11) — An 'Evaluate this applicant' button was showing at every stage from Under Evaluation all the way through Contract Signed and beyond, with no upper bound — meaning it appeared at Preferred Bidder and Contract Being Drafted too, stages that should already have a locked-in score behind them, not an open invitation to score for the first time. Evaluating (and re-evaluating) is now only possible in the window it actually belongs to: from Under Evaluation up to the Recommendation gate. Past that point, an existing score still shows as a read-only historical record, but the action to create or change one is gone — and if a case reached those later stages without ever being scored, the section now stays empty instead of showing a button that shouldn't be there. Verified all 8 combinations directly: with and without an existing score, at every relevant stage from Under Evaluation through Contract Being Drafted.",
    "2.25.1 (2026-08-11) — The proposal submission page a bidder lands on after being invited now leads with a clear instruction naming the RFQ number and title, telling them plainly to state their full bid amount and upload their scope of works, detailed pricing, and any other supporting documents — this is the one page in the whole system a real bid rides on, so it shouldn't read like a blank form. Adding more than one document was already technically possible but not obvious; the button now relabels itself to \"+ Add another document\" once a file's been added, making it clear multiple uploads are expected.",
    "2.25.0 (2026-08-11) — Closed RFQs used to vanish from the public portal the instant they closed — a real problem, since the invitation email explicitly tells applicants to use the portal's 'Ask a question' option for anything they need to raise. Closed RFQs now stay listed for 20 days after closing, clearly marked 'Closed' with the Apply button removed (applications are still genuinely cut off), while Ask a Question and the tender documents remain available. The question-submission function had the same cutoff and got the same fix, plus a bug fix along the way: it was still comparing against the old date-only format from before closing times existed, so it wasn't as precise as the rest of the system. After 20 days, an RFQ disappears from the public listing as before. Verified directly against the database — still-open, closed 5 days ago, and closed 19 days ago all correctly stay visible; closed 21 days ago correctly disappears.",
    "2.24.0 (2026-08-10) — RFQ closing dates now include a time, not just a day. A bare date was genuinely ambiguous — did it close at midnight, end of business, first thing that morning? The closing-date field (new RFQs, editing, and extensions) is now a real date-and-time picker, and every rule that depends on it — the no-reviews-before-closing lock, the public application cutoff, and public visibility — now compares to the precise minute rather than the calendar day. Existing RFQs default to 23:59:59 on their original date, so nothing changes for them unless edited. Verified directly against the database at minute-level precision: an RFQ closing 5 minutes out stays genuinely locked, and the same RFQ closing 1 minute in the past genuinely unlocks — plus the extend-date flow, the display formatting everywhere a closing time appears, and the full closing-lock regression suite all re-verified against the new precision.",
    "2.23.0 (2026-08-10) — Two real gaps fixed. First: the invitation email silently never fired when Validation was approved through the actual decision gate — it only worked from the automated-advance path, which this transition doesn't use. Second, and bigger: there was no way for an invited applicant to actually submit a proposal back into the system — 'Invited to Submit Proposal' was a dead end. Applicants now get a secure, one-time link in their invitation email (no account needed) that takes them to a page where they submit a total price and their proposal documents; submitting auto-advances them straight to Proposal Submitted and fires the confirmation email, no staff action needed. Staff can see the submitted price and documents in the case drawer, and the Approvals ranking table now shows price alongside score with a sort toggle between the two. Verified the full database round-trip directly, the public form's validation (blocks empty price, no documents, mid-upload submission), the exact payload sent to the backend, a race condition where the invitation email could fire before its link was actually saved, and the score/price sort order in the rankings table.",
    "2.22.1 (2026-08-10) — The conflict-of-interest declaration only had a tick for \"I have a conflict\" — leaving it blank silently meant 'no conflict', which isn't the same as someone actually confirming that. Replaced with two explicit options, neither selected by default: 'No, I have no conflict' or 'Yes, I have a conflict'. Approving, rejecting, or saving a score is now disabled until one is actively chosen — no more deciding by default. Verified directly: both buttons stay disabled with nothing selected, choosing 'No conflict' unlocks them, and the case still routes to the recusal flow exactly as before if 'Yes' is chosen.",
    "2.22.0 (2026-08-10) — The conflict-of-interest declaration on decision gates and evaluations was clearer about what it was for now, but still didn't actually do anything — selecting it was never even read by the code. Fixed: it's now explicit that this is the reviewer's own conflict (not the vendor's), and declaring one genuinely blocks that person from recording the decision or score. Instead, they log a recusal — reason required — to the permanent audit trail, and are told to hand the case to a colleague. Verified directly: approving or saving a score is refused outright while a conflict is checked, a recusal with no reason is rejected, and a valid recusal logs correctly without ever touching the applicant's status or score.",
    "2.21.0 (2026-08-09) — Completed the full set of email notifications from the original 17-step process design. Eight triggers that were either missing or only logged locally now actually send: invitation to submit a proposal, proposal received, signature reminder/escalation, contract signed, and onboarding details — plus the single generic rejection email is now three separate stage-specific ones (screening outcome, validation outcome, approval outcome), each with wording matched to why that particular stage ended the case. Verified all eight fire from the correct action with the correct trigger type, and confirmed real delivery through Resend. Every trigger point from the original design is now wired end to end, aside from 'application incomplete' which has no corresponding action in the system yet.",
    "2.20.0 (2026-08-06) — No application on an RFQ can be reviewed, screened, validated, evaluated, scored, or commented on until that RFQ's closing date has passed — enforced at the database level, not just hidden in the interface. The only thing that can still be done to a still-open RFQ is extend its closing date, which requires a reason and immediately publishes a transparent notice on the public tender listing (previous date, new date, and why). Verified directly against the database: a fully-permissioned account is genuinely blocked from touching an applicant's status while the RFQ is open, and the exact same action succeeds the moment it closes.",
    "2.19.0 (2026-08-06) — Staff are now automatically signed out after 30 minutes of inactivity in the admin console (no mouse movement, clicks, keyboard input, or scrolling). A warning appears 2 minutes before it happens with a 'Stay signed in' option, so nobody gets logged out without notice. Verified the full timeline directly: no warning before 28 minutes, warning shown correctly at 28, confirming activity resets the clock, and the actual sign-out firing correctly at 30 with a clear message on the login screen explaining why.",
    "2.18.1 (2026-08-05) — Fixed a real layout bug on the new 'Set your password' screen: it was placed outside the main app container instead of inside it like the regular sign-in screen, which left a blank screen-height gap above the actual form, requiring a scroll to see it. It now appears immediately, no scrolling needed.",
    "2.18.0 (2026-08-05) — New employees must now set their own password the first time they sign in, replacing the admin-issued temporary one before they can access anything else. The old temporary password stops working the moment they do. Your own account is unaffected. Verified directly against the database that the self-service 'password changed' flag can only ever be cleared on a person's own account, never anyone else's.",
    "2.17.0 (2026-08-05) — Added real evaluation scoring, replacing what used to just be a status label. Fixed criteria (Price 30, Technical capability 25, Experience 20, B-BBEE/local contribution 15, Compliance 10 — 100 points total) scored by one evaluator per applicant, with an optional conflict-of-interest declaration. A new 'Scores & ranking' panel on the Approvals page ranks every evaluated applicant within their own RFQ from highest to lowest, so a recommendation points to a number rather than a preference. Scoring is gated behind the existing Evaluate & Approve permission — verified directly against the database, same as every other permission split in this system.",
    "2.16.0 (2026-08-05) — Added Requests for Clarification: any prospective bidder can ask a question about an open tender from the public portal, no login needed. A new Clarifications tab lets staff (Manage RFQs permission) answer each one either privately (only the asker sees it, by email) or publicly — publishing puts the Q&A on the public tender listing for every current and future bidder to see, and emails everyone who's already applied to that RFQ. Verified directly against the database: anonymous visitors can only ever see answered, published clarifications — never pending ones or private replies to someone else.",
    "2.15.0 (2026-08-05) — RFQs (beyond Draft) can now have a status change requested — Paused, Under Review, or Cancelled — with a reason. This doesn't take effect immediately: it needs a second sign-off from someone with Approve & Publish RFQs permission, who can approve or reject it with their own name, role, and comment. Rejected or approved, the RFQ stays in the register either way for audit purposes — nothing is ever hidden or removed. Also added filter dropdowns on the RFQ register (type, status, and a closing-date range), populated automatically from what's actually in the register. Verified the request/approve permission split directly against the database, the same way the Manage/Publish RFQs split was verified earlier.",
    "2.14.0 (2026-08-05) — Tender document storage switched from a public bucket to short-lived signed links (same protection already used for applicant-submitted documents). Anyone can still open a tender document from the public listing with no login, but there's no longer a permanent, indexable public URL — links are generated fresh and expire after 10 minutes. Applies to admin uploads, the public listing, and downloads.",
    "2.13.1 (2026-08-05) — 'Download tender information' now downloads the actual uploaded tender document(s) when they exist, instead of a generated text summary — the button label changes to match (e.g. 'Download tender document'). Falls back to the text summary only when no documents have been attached to that RFQ.",
    "2.13.0 (2026-08-05) — Migrated the entire backend to a dedicated Supabase project, no longer sharing infrastructure with other clients' data. Same database structure, same security rules, same login — all data (RFQs, applicants, timeline, audit trail) migrated and row-count verified to match exactly. All four server-side functions (employee management, document upload, application submission, email notifications) redeployed to the new project.",
    "2.12.0 (2026-08-04) — Admins with Manage RFQs permission can now attach reference documents (specs, drawings, terms) to an RFQ when creating or editing it. These are publicly downloadable straight from the tender listing, no login or application required. Also added a 'Download tender information' button on each public listing, which generates a plain-text summary of the RFQ (budget, dates, description, required documents) for offline reference. Upload permissions verified directly against the database: an account with Manage RFQs can upload, one without it is rejected, and anonymous visitors can read/download but never write.",
    "2.11.0 (2026-08-04) — Draft RFQs can now be edited (title, budget, dates, description, required documents) before publishing. Split the old 'Manage RFQs' permission in two: Manage RFQs (create/edit Drafts) and a new Approve & Publish RFQs permission — someone can now be allowed to prepare tenders without being able to publish them, or vice versa. Enforced at the database level: tested directly that an edit-only account can change a Draft's details but is blocked from publishing, and a publish-only account can publish but is blocked from editing other fields.",
    "2.10.0 (2026-08-04) — Applicant pipeline board now switches from horizontal-scrolling columns to a stacked vertical layout on phones/small tablets (under ~768px wide). Each stage can also be tapped to collapse/expand on mobile, so a long empty stage doesn't take up scroll space. Desktop is unchanged.",
    "2.9.0 (2026-08-04) — RFQs past their closing date no longer appear on the public portal, enforced at three levels: the database itself now refuses to show expired RFQs to anonymous visitors, the submission function rejects any application to a closed RFQ even if someone bypasses the UI, and the form gives a clear 'this RFQ has closed' message if someone had it open right as the deadline passed.",
    "2.8.0 (2026-08-03) — Added the plumbing for automated emails: application confirmation, Preferred Bidder notification, Contract Drafted notification, a manual 'Send signing invite' button with an optional custom note, and rejection notices. All five are wired up and logged in a new Email Log (visible under Communications) whether or not real sending is connected yet — nothing sends for real until a Resend domain and API key are configured, so this is safe to test against live data in the meantime.",
    "2.7.1 (2026-08-03) — The POPIA privacy notice on the public Apply flow now shows every time someone applies, not just once per browser. (The admin sign-in POPIA notice is unchanged — still once per browser.)",
    "2.7.0 (2026-08-03) — Application submission now goes through a secure server-side function instead of a direct write from the browser, resolving a persistent, hard-to-pin-down permission error that kept recurring on that specific write path. As a side effect, this also removes direct public write access to the applicants/timeline/audit tables entirely, tightening security further. Submissions are now also checked server-side to confirm the RFQ is genuinely still open before accepting them.",
    "2.6.2 (2026-08-03) — If an application still fails to save, the exact error code and message now show directly in the on-screen notification (visible for 20 seconds) instead of only in the browser console — no more digging through DevTools to report a failure",
    "2.6.1 (2026-08-03) — Fixed a real bug where every application submitted from the public portal was generating the same ID (since that page never loads other applicants' IDs, by design, so it had no way to count past them) — every submission after the very first collided and got silently rejected by the database. Public applications now get a collision-safe ID that doesn't depend on knowing what already exists.",
    "2.6.0 (2026-08-03) — Added a POPIA privacy notice popup, shown once per browser before someone applies or signs in. Fixed a real bug where document uploads on the application form were being silently rejected by storage security rules — uploads now go through a secure server-side function instead of directly from the browser, which also tightens document privacy further (no direct public write access to file storage at all now).",
    "2.5.2 (2026-08-03) — Renamed the Employees tab to 'System Users & Admin' (room for more admin tools later); removed leftover test accounts, leaving only the super admin",
    "2.5.1 (2026-08-01) — Fixed error messages from the employee invite/remove function being swallowed by a generic browser error instead of showing the real reason",
    "2.5.0 (2026-08-01) — Employee management is now restricted to a super admin only. This is a fixed designation (not one of the regular checkboxes, and not self-grantable through the UI) — everyone else can no longer view, add, edit, or remove employees, enforced at both the database and the server-side function that creates logins.",
    "2.4.0 (2026-08-01) — Added an Employees section: add/edit/remove staff accounts with granular permissions (Manage RFQs, Screen & Validate, Evaluate & Approve, Manage Contracts, Review Documents, View Audit Trail — nothing ticked means read-only). Permissions are enforced at the database level, not just hidden in the UI. New employees get a real login via a secure server-side function, with a one-time temporary password shown to the admin who added them.",
    "2.3.0 (2026-08-01) — RFQ application form now collects company registration no., position, email, contact number, and an optional comments/questions field, all shown in the admin drawer and saved to the database",
    "2.2.0 (2026-08-01) — Added an installable desktop-app option for admin.html (manifest, service worker, one-click Install button on the login screen and sidebar) using the CNWE logo as the icon; also fixed a broken 'Back to public portal' link on the login screen left over from the page split",
    "2.1.0 (2026-07-31) — Document review comments are now an append-only thread (Add Comment button) instead of a single overwritable note, so nothing a reviewer wrote is ever lost — each entry is attributed to the signed-in reviewer's email and timestamped",
    "2.0.0 (2026-07-31) — Admin console now requires staff login (Supabase Auth). Public portal stays open with no account needed. Database rules rewritten so anonymous visitors can only read open tenders and submit applications — everything else (applicant data, audit trail, decisions, document files) now requires being signed in.",
    "1.9.0 (2026-07-31) — Applicant documents now actually upload to Supabase Storage; reviewers can open/download submitted files and leave a comment on each one",
    "1.8.1 (2026-07-31) — Public portal RFQ cards now only show title/category/description; required documents are revealed inside the Apply modal instead of upfront",
    "1.8.0 (2026-07-31) — Added a Publish action for Draft RFQs so admins can actually get new tenders onto the public portal (previously only the seeded RFQ could ever appear there)",
    "1.7.1 (2026-07-31) — Switched to the legacy anon key format after the new sb_publishable_ key returned 403 on all requests from the deployed site",
    "1.7.0 (2026-07-31) — Version badge added; fixed stale 'not connected' message; write failures now show a toast instead of failing silently",
    "1.6.0 (2026-07-31) — Connected to a live Supabase backend (RFQs, applicants, timeline, audit log all persist)",
    "1.5.0 (2026-07-31) — Applicant pipeline rebuilt to match the 17-step EPC Local Procurement Hub flow exactly",
    "1.4.1 (2026-07-31) — Fixed Contract Signed / Closed being unreachable in the pipeline",
    "1.4.0 (2026-07-30) — Dark KPI dashboard added (charts, stat cards)",
    "1.3.0 (2026-07-30) — Colour palette rebranded to match the CNWE logo",
    "1.2.0 (2026-07-30) — Required-documents builder + applicant document uploads added",
    "1.1.0 (2026-07-30) — CNWE Energy branding applied",
    "1.0.0 (2026-07-30) — Initial RFQ Hub build from spec"
  ]
};
(function initVersionBadge(){
  const badge = document.getElementById('version-badge');
  if(!badge) return;
  badge.textContent = 'v' + VERSION_INFO.version;
  badge.title = VERSION_INFO.changelog.join('\n');
  console.log('%cRFQ Hub v' + VERSION_INFO.version + ' (' + VERSION_INFO.date + ')', 'font-weight:bold;');
  console.log(VERSION_INFO.changelog.join('\n'));
})();

/* ============================================================
   STATE
   ============================================================ */
const RFQ_STATUSES = ["Draft","Pending Internal Approval","Published","Open for Applications","Applications Closed","Screening in Progress","Validation in Progress","Proposal Stage Open","Evaluation in Progress","Approval Pending","Contracting","Awarded","Paused","Under Review","Cancelled","Closed"];

/* Applicant pipeline — mirrors the 17-step EPC Local Procurement Hub flow.
   Steps 1 (Publish) is RFQ-level; step 2+3 (Application+Receipt) are combined
   into "Application Received" since receipt is instantaneous. */
/* Fixed evaluation criteria — same for every RFQ. Points sum to 100. */
const EVALUATION_CRITERIA = [
  { key: "price", label: "Price competitiveness", maxPoints: 30 },
  { key: "technical", label: "Technical capability & quality of proposal", maxPoints: 25 },
  { key: "experience", label: "Experience & track record", maxPoints: 20 },
  { key: "bbbee", label: "B-BBEE / local economic contribution", maxPoints: 15 },
  { key: "compliance", label: "Compliance & completeness of submission", maxPoints: 10 },
];

const KANBAN_STAGES = [
  "Application Received",       // 2+3 Application / Receipt
  "Under Screening",            // 4  Screening
  "Under Validation",           // 5  Validation
  "Invited to Submit Proposal", // 6  Invitation
  "Proposal Submitted",         // 7  Submission
  "Assigned for Evaluation",    // 8  Assign
  "Under Evaluation",           // 9  Evaluation
  "Recommendation Recorded",    // 10 Recommend (awaiting Approval gate)
  "Preferred Bidder",           // 12 Status
  "Contract Being Drafted",     // 13 Draft
  "Awaiting Signature",         // 14 E-Sign
  "Contract Signed",            // 15 Signed
  "Onboarding",                 // 16 Onboard
  "Closed"                      // 17 Close
];

/* The 3 official regret exits from the flow diagram (red arrows) — only these
   stages can end a case as Unsuccessful, each with its own reason pool. */
const REGRET_POOLS = {
  "Under Screening": ["Mandatory information not supplied","Eligibility criteria not met"],
  "Under Validation": ["Supplier information could not be verified","Supporting evidence did not meet requirements"],
  "Recommendation Recorded": ["Recommendation not approved by the delegated authority","Another submission achieved a higher evaluation result","Proposal did not meet the required threshold"],
};

/* Stages the diagram marks as a human decision point (orange) — these open the
   full decision modal (name / role / conflict-of-interest / reason). Everything
   else in KANBAN_STAGES is an automated or system step (blue/green) and advances
   with a single click, no sign-off required. */
const GATE_STAGES = ["Under Screening","Under Validation","Recommendation Recorded","Contract Being Drafted"];
const GATE_QUESTION = {
  "Under Screening": "Eligible & complete?",
  "Under Validation": "Approved to proceed?",
  "Recommendation Recorded": "Approved?",
  "Contract Being Drafted": "Contract issue authorisation",
};

const COMMS = [
  {trig:"Application received (Receipt)", subj:"Your application has been received", body:"Your application has been successfully received."},
  {trig:"Application incomplete", subj:"Additional information required", body:"Your submission requires additional information. A correction link may be provided only where the procurement rules permit corrections."},
  {trig:"Screening outcome — unsuccessful", subj:"Update on your application", body:"Your application will not proceed to the next stage."},
  {trig:"Validation outcome — unsuccessful", subj:"Update on your application", body:"Your application could not be validated and will not proceed to the next stage."},
  {trig:"Invitation to submit a proposal", subj:"You're invited to submit a proposal", body:"You are invited to submit a detailed proposal and quotation via a secure link."},
  {trig:"Proposal received (Submission)", subj:"Your proposal has been recorded", body:"Your proposal has been received and recorded."},
  {trig:"Approval outcome — unsuccessful", subj:"Update on your proposal", body:"Your proposal was evaluated but the recommendation was not approved to proceed."},
  {trig:"Preferred bidder notification (Status)", subj:"You've been approved to proceed to contracting", body:"Your submission has been approved to proceed to the contracting stage. This is not yet a final award or binding contract."},
  {trig:"Contract drafting update (Draft)", subj:"Your contract is being prepared", body:"Your contract is currently being prepared and is subject to the required internal approvals."},
  {trig:"Contract issued (E-Sign)", subj:"Your contract is ready to sign", body:"Your contract is available for electronic signature."},
  {trig:"Signature reminder / escalation", subj:"Signature still outstanding", body:"Your contract remains outstanding and must be signed by the stated deadline."},
  {trig:"Contract completed (Signed)", subj:"Contract fully signed", body:"The contract has been signed by all required parties. A final copy is attached or available through the secure link."},
  {trig:"Onboarding details (Onboard)", subj:"Onboarding details", body:"Please find the onboarding or commencement meeting details."}
];

let uidCounter = 1000;
function uid(prefix){ uidCounter++; return prefix+"-"+uidCounter; }
/* Used where the caller can't see existing IDs to avoid colliding with them
   (the public portal never loads other applicants' data, by design) — a
   sequential counter isn't safe there, so this uses time + randomness instead. */
function uniqueId(prefix){
  return prefix + "-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase();
}
function escapeAttr(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function today(offsetDays){ const d=new Date(); d.setDate(d.getDate()+(offsetDays||0)); return d.toISOString().slice(0,10); }
function nowStamp(){ const d=new Date(); return d.toISOString().slice(0,16).replace('T',' '); }
/* datetime-local inputs work in the browser's own local time — these convert
   between that and the ISO timestamps stored in the database. */
function toDatetimeLocalValue(isoString){
  if(!isoString) return '';
  const d = new Date(isoString);
  if(isNaN(d)) return '';
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromDatetimeLocalValue(val){
  if(!val) return null;
  const d = new Date(val);
  return isNaN(d) ? null : d.toISOString();
}
function formatCloseDisplay(isoString){
  if(!isoString) return '—';
  const d = new Date(isoString);
  if(isNaN(d)) return isoString;
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function defaultCloseDateTime(offsetDays){
  const d = new Date();
  d.setDate(d.getDate() + (offsetDays||0));
  d.setHours(17,0,0,0); // sensible default: close of business
  return d.toISOString();
}

let audit = [];
function logAudit(action, who, note){
  const entry = {ts:nowStamp(), action, who: who||"System", note: note||""};
  audit.unshift(entry);
  renderAudit();
  sb.from('rfq_audit_log').insert({action: entry.action, who: entry.who, note: entry.note})
    .then(({error})=>{ if(error) console.error('audit log persist failed', error); });
}

let rfqs = [];
let applicants = [];

function docReq(name, mandatory){ return {id:uid("DOC"), name, mandatory:mandatory!==false}; }

function seed(){
  rfqs = [
    {id:"RFQ-2026-014", title:"Supply and delivery of laptops — field offices", category:"Goods", status:"Open for Applications", budget:620000, open:today(-6), close:today(9), desc:"Supply of 40 ruggedised laptops with 3-year warranty for regional field teams.",
      requiredDocs:[docReq("CIPC company registration"), docReq("Valid tax clearance certificate"), docReq("B-BBEE certificate / sworn affidavit"), docReq("Company profile", false)]},
    {id:"RFQ-2026-013", title:"Annual financial audit services", category:"Services", status:"Evaluation in Progress", budget:180000, open:today(-40), close:today(-12), desc:"Independent audit of annual financial statements for the current reporting year.",
      requiredDocs:[docReq("CIPC company registration"), docReq("Valid tax clearance certificate"), docReq("Proof of professional indemnity insurance"), docReq("IRBA / SAICA registration")]},
    {id:"RFQ-2026-011", title:"Renovation of Khayelitsha community hall", category:"Works", status:"Contracting", budget:940000, open:today(-70), close:today(-45), desc:"Structural repairs, roofing and accessibility upgrade of the community hall.",
      requiredDocs:[docReq("CIPC company registration"), docReq("Valid tax clearance certificate"), docReq("NHBRC registration"), docReq("Proof of public liability insurance")]},
    {id:"RFQ-2026-009", title:"Warehousing and logistics — disaster relief stock", category:"Services", status:"Awarded", budget:310000, open:today(-110), close:today(-85), desc:"Storage and dispatch of emergency relief stock across three provinces.",
      requiredDocs:[docReq("CIPC company registration"), docReq("Valid tax clearance certificate"), docReq("Proof of warehouse facility", false)]},
    {id:"RFQ-2026-016", title:"Solar backup power — head office", category:"Works", status:"Draft", budget:275000, open:today(3), close:today(24), desc:"Installation of solar and battery backup for the head office building.",
      requiredDocs:[docReq("CIPC company registration"), docReq("Valid tax clearance certificate"), docReq("Electrical installation (NRS) certificate")]},
  ];

  function mk(rfqId, business, name, status, extra){
    const rfq = rfqs.find(r=>r.id===rfqId);
    const missing = extra.missingDocs || [];
    const documents = (rfq.requiredDocs||[]).map(d=>({
      docId:d.id, name:d.name, mandatory:d.mandatory,
      provided: !missing.includes(d.name),
      fileName: missing.includes(d.name) ? null : d.name.split(' ').slice(0,2).join('_')+'.pdf',
      filePath: null, reviewerComments: []
    }));
    const slug = business.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,20);
    const a = {id:uid("APP"), rfq:rfqId, business,
      companyRegNo: extra.regNo || '2019/123456/07',
      name, position: extra.position || 'Director',
      email: extra.email || `info@${slug}.co.za`,
      phone: extra.phone || '082 000 0000',
      comments: extra.comments || '',
      status,
      received:today(extra.receivedOffset||0), reason:extra.reason||null, documents,
      timeline: extra.timeline || [{date:today(extra.receivedOffset||0), action:"Application submitted", actor:name, note:""}]};
    applicants.push(a);
  }

  mk("RFQ-2026-014","Thandeka Office Supplies (Pty) Ltd","Thandeka Nkosi","Under Screening",{receivedOffset:-4,
    timeline:[{date:today(-4),action:"Application submitted",actor:"Thandeka Nkosi"},{date:today(-3),action:"Moved to screening",actor:"Screening Officer"}]});
  mk("RFQ-2026-014","Cape Tech Distributors","Sarah van Wyk","Application Received",{receivedOffset:-1,missingDocs:["B-BBEE certificate / sworn affidavit"],
    timeline:[{date:today(-1),action:"Application submitted",actor:"Sarah van Wyk"}]});
  mk("RFQ-2026-014","Ubuntu IT Solutions","Bongani Dlamini","Under Validation",{receivedOffset:-6,
    timeline:[{date:today(-6),action:"Application submitted",actor:"Bongani Dlamini"},{date:today(-5),action:"Screening passed",actor:"Screening Officer"},{date:today(-4),action:"Moved to validation",actor:"Validator"}]});
  mk("RFQ-2026-014","GreenLeaf Office Interiors","Naledi Mokoena","Invited to Submit Proposal",{receivedOffset:-8,
    timeline:[{date:today(-8),action:"Application submitted",actor:"Naledi Mokoena"},{date:today(-7),action:"Screening passed",actor:"Screening Officer"},{date:today(-6),action:"Validation approved",actor:"Validator"},{date:today(-5),action:"Invitation to submit a proposal sent",actor:"System (automated)"}]});
  mk("RFQ-2026-014","Metro Print & Supply","Riaan Steyn","Proposal Submitted",{receivedOffset:-14,
    timeline:[{date:today(-14),action:"Application submitted",actor:"Riaan Steyn"},{date:today(-12),action:"Screening passed",actor:"Screening Officer"},{date:today(-11),action:"Validation approved",actor:"Validator"},{date:today(-9),action:"Invitation to submit a proposal sent",actor:"System (automated)"},{date:today(-3),action:"Proposal submitted",actor:"Riaan Steyn"}]});

  mk("RFQ-2026-013","Mzansi Assurance Services","Zanele Khumalo","Assigned for Evaluation",{receivedOffset:-27,
    timeline:[{date:today(-27),action:"Application submitted",actor:"Zanele Khumalo"},{date:today(-22),action:"Screening passed",actor:"Screening Officer"},{date:today(-18),action:"Validation approved",actor:"Validator"},{date:today(-14),action:"Invitation to submit a proposal sent",actor:"System (automated)"},{date:today(-9),action:"Proposal submitted",actor:"Zanele Khumalo"},{date:today(-5),action:"Assigned for evaluation",actor:"System (automated)"}]});
  mk("RFQ-2026-013","Thabo Consulting & Co","Thabo Nkosi","Under Evaluation",{receivedOffset:-28,
    timeline:[{date:today(-28),action:"Application submitted",actor:"Thabo Nkosi"},{date:today(-23),action:"Screening passed",actor:"Screening Officer"},{date:today(-19),action:"Validation approved",actor:"Validator"},{date:today(-15),action:"Invitation to submit a proposal sent",actor:"System (automated)"},{date:today(-10),action:"Proposal submitted",actor:"Thabo Nkosi"},{date:today(-6),action:"Assigned for evaluation",actor:"System (automated)"},{date:today(-4),action:"Evaluation started",actor:"Evaluation Panel"}]});
  mk("RFQ-2026-013","Kunene & Associates Auditors","Lindiwe Kunene","Recommendation Recorded",{receivedOffset:-25,
    timeline:[{date:today(-25),action:"Application submitted",actor:"Lindiwe Kunene"},{date:today(-20),action:"Screening passed",actor:"Screening Officer"},{date:today(-16),action:"Validation approved",actor:"Validator"},{date:today(-13),action:"Invitation to submit a proposal sent",actor:"System (automated)"},{date:today(-8),action:"Proposal submitted",actor:"Lindiwe Kunene"},{date:today(-6),action:"Assigned for evaluation",actor:"System (automated)"},{date:today(-5),action:"Evaluation started",actor:"Evaluation Panel"},{date:today(-3),action:"Recommendation recorded — awaiting delegated approval",actor:"Evaluation Panel"}]});
  mk("RFQ-2026-013","Baobab Audit Partners","Michael Reddy","Unsuccessful",{receivedOffset:-25,reason:"Proposal did not meet the required threshold",
    timeline:[{date:today(-25),action:"Application submitted",actor:"Michael Reddy"},{date:today(-16),action:"Validation approved",actor:"Validator"},{date:today(-9),action:"Proposal submitted",actor:"Michael Reddy"},{date:today(-5),action:"Recommendation recorded — awaiting delegated approval",actor:"Evaluation Panel"},{date:today(-2),action:"Marked unsuccessful — proposal did not meet the required threshold",actor:"Delegated Approval Committee"}]});

  mk("RFQ-2026-011","Vukani Engineering","Sipho Radebe","Preferred Bidder",{receivedOffset:-60,
    timeline:[{date:today(-60),action:"Application submitted",actor:"Sipho Radebe"},{date:today(-48),action:"Recommendation recorded — awaiting delegated approval",actor:"Evaluation Panel"},{date:today(-42),action:"Approved — named preferred bidder",actor:"Delegated Approval Committee"}]});
  mk("RFQ-2026-011","Sisonke Construction Group","Andile Mtshali","Contract Being Drafted",{receivedOffset:-65,
    timeline:[{date:today(-65),action:"Application submitted",actor:"Andile Mtshali"},{date:today(-52),action:"Recommendation recorded — awaiting delegated approval",actor:"Evaluation Panel"},{date:today(-40),action:"Approved — named preferred bidder",actor:"Delegated Approval Committee"},{date:today(-30),action:"Contract drafting started",actor:"Contract Manager"}]});
  mk("RFQ-2026-011","KayaBuild Construction","Elmarie Botha","Awaiting Signature",{receivedOffset:-72,
    timeline:[{date:today(-72),action:"Application submitted",actor:"Elmarie Botha"},{date:today(-55),action:"Approved — named preferred bidder",actor:"Delegated Approval Committee"},{date:today(-38),action:"Contract drafting started",actor:"Contract Manager"},{date:today(-20),action:"Contract issued for e-signature",actor:"System (automated)"},{date:today(-6),action:"Signature reminder sent — escalation triggered",actor:"System (automated)"}]});

  mk("RFQ-2026-009","Karoo Logistics & Warehousing","Petrus Botha","Onboarding",{receivedOffset:-108,
    timeline:[{date:today(-108),action:"Application submitted",actor:"Petrus Botha"},{date:today(-90),action:"Approved — named preferred bidder",actor:"Delegated Approval Committee"},{date:today(-70),action:"Contract signed by all parties",actor:"Contract Manager"},{date:today(-60),action:"Onboarding notice issued",actor:"System (automated)"}]});
  mk("RFQ-2026-009","Sunrise Cold Storage","Amelia Fortuin","Contract Signed",{receivedOffset:-112,
    timeline:[{date:today(-112),action:"Application submitted",actor:"Amelia Fortuin"},{date:today(-92),action:"Approved — named preferred bidder",actor:"Delegated Approval Committee"},{date:today(-75),action:"Contract signed by all parties",actor:"Contract Manager"}]});
  mk("RFQ-2026-009","Highveld Relief Support","Johan Pretorius","Closed",{receivedOffset:-115,
    timeline:[{date:today(-115),action:"Application submitted",actor:"Johan Pretorius"},{date:today(-95),action:"Approved — named preferred bidder",actor:"Delegated Approval Committee"},{date:today(-80),action:"Contract signed by all parties",actor:"Contract Manager"},{date:today(-65),action:"Onboarding notice issued",actor:"System (automated)"},{date:today(-50),action:"Procurement record closed and audit file retained",actor:"Procurement Manager"}]});

  audit = [];
  logAudit("RFQ-2026-014 opened for applications","Procurement Manager");
  logAudit("RFQ-2026-013 moved to evaluation","Procurement Manager");
  logAudit("Baobab Audit Partners marked unsuccessful — proposal did not meet the required threshold","Delegated Approval Committee");
  logAudit("RFQ-2026-011 contract drafting task created","System");
  logAudit("RFQ-2026-009 onboarding notice issued","System");
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function toggleSidebar(){
  const sb = document.getElementById('sidebar');
  const willOpen = !sb.classList.contains('open');
  sb.classList.toggle('open', willOpen);
  const overlay = document.getElementById('overlay');
  if(overlay) overlay.classList.toggle('active', willOpen);
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  const overlay = document.getElementById('overlay');
  if(overlay) overlay.classList.remove('active');
}
function switchView(name){
  closeSidebar();
  if(name==='employees' && !(currentEmployee && currentEmployee.is_super_admin)){
    toast("Not available", "Only a super admin can manage employees.");
    return;
  }
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('#tabs .tab').forEach(t=>t.classList.toggle('active', t.dataset.view===name));
  if(name==='dashboard') renderDashboard();
  if(name==='rfqs') renderRfqs();
  if(name==='applicants') renderApplicants();
  if(name==='approvals'){ renderApprovals(); renderRankings(); }
  if(name==='comms') renderComms();
  if(name==='audit') renderAudit();
  if(name==='employees') renderEmployees();
  if(name==='clarifications') renderClarifications();
}
document.querySelectorAll('#tabs .tab').forEach(t=>t.addEventListener('click',()=>switchView(t.dataset.view)));

/* ---- admin.html only: toggling between the login screen and the console ---- */
function showAdmin(){
  const loginView = document.getElementById('login-view');
  if(loginView) loginView.classList.remove('active');
  const cpView = document.getElementById('change-password-view');
  if(cpView) cpView.style.display = 'none';
  document.getElementById('sidebar').style.display='flex';
  document.getElementById('admin-main').style.display='block';
  startIdleWatcher();
}
function showLogin(){
  stopIdleWatcher();
  document.getElementById('sidebar').style.display='none';
  document.getElementById('admin-main').style.display='none';
  const cpView = document.getElementById('change-password-view');
  if(cpView) cpView.style.display = 'none';
  document.getElementById('login-view').classList.add('active');
  const sidebarLogo = document.querySelector('.brand .logo-plate img');
  const loginLogo = document.getElementById('login-logo-slot');
  if(sidebarLogo && loginLogo) loginLogo.src = sidebarLogo.src;
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('login-password').value = '';
}
function showChangePasswordGate(){
  document.getElementById('sidebar').style.display='none';
  document.getElementById('admin-main').style.display='none';
  const loginView = document.getElementById('login-view');
  if(loginView) loginView.classList.remove('active');
  const cpView = document.getElementById('change-password-view');
  cpView.style.display = 'flex';
  const sidebarLogo = document.querySelector('.brand .logo-plate img');
  const cpLogo = document.getElementById('cp-logo-slot');
  if(sidebarLogo && cpLogo) cpLogo.src = sidebarLogo.src;
  document.getElementById('cp-error').style.display = 'none';
  document.getElementById('cp-password').value = '';
  document.getElementById('cp-password-confirm').value = '';
}
async function submitPasswordChange(){
  const pw = document.getElementById('cp-password').value;
  const pw2 = document.getElementById('cp-password-confirm').value;
  const errEl = document.getElementById('cp-error');
  const btn = document.getElementById('cp-submit-btn');
  if(!pw || pw.length < 8){ errEl.textContent = 'Password must be at least 8 characters.'; errEl.style.display='block'; return; }
  if(pw !== pw2){ errEl.textContent = "Passwords don't match."; errEl.style.display='block'; return; }
  btn.disabled = true; btn.textContent = 'Saving…';
  const { error: updateErr } = await sb.auth.updateUser({ password: pw });
  if(updateErr){
    btn.disabled = false; btn.textContent = 'Set password and continue';
    errEl.textContent = updateErr.message || 'Could not update your password — please try again.';
    errEl.style.display = 'block';
    return;
  }
  const { error: rpcErr } = await sb.rpc('mark_password_changed');
  if(rpcErr) console.error('mark_password_changed failed', rpcErr); // not fatal — the password itself is already changed
  if(currentEmployee) currentEmployee.must_change_password = false;
  btn.disabled = false; btn.textContent = 'Set password and continue';
  toast("Password set", "You're all set — welcome in.");
  showAdmin();
}


/* ============================================================
   POPIA NOTICE — shown once per browser before applying or signing in.
   ============================================================ */
function popiaSeen(key){
  try{ return localStorage.getItem(key) === '1'; } catch(e){ return false; }
}
function popiaMark(key){
  try{ localStorage.setItem(key, '1'); } catch(e){ /* private browsing etc. — just don't persist */ }
}
let pendingApplyRfqId = null;
function handleApplyClick(rfqId){
  pendingApplyRfqId = rfqId;
  const modal = document.getElementById('modal-popia-apply');
  if(!modal){ openApply(rfqId); return; } // safety fallback if the modal isn't on this page
  modal.classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function acknowledgePopiaThenSubmit(){
  if(popiaSeen('popia_ack_admin')){ handleLoginSubmit(); return; }
  const modal = document.getElementById('modal-popia-signin');
  if(!modal){ handleLoginSubmit(); return; }
  modal.classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function acknowledgePopia(which){
  if(which==='apply'){
    closeAll();
    if(pendingApplyRfqId){ openApply(pendingApplyRfqId); pendingApplyRfqId = null; }
  } else if(which==='signin'){
    popiaMark('popia_ack_admin');
    closeAll();
    handleLoginSubmit();
  }
}

async function handleLoginSubmit(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-submit-btn');
  if(!email || !password){ errEl.textContent = 'Enter your email and password.'; errEl.style.display='block'; return; }
  btn.disabled = true; btn.textContent = 'Signing in…';
  const { error } = await sb.auth.signInWithPassword({ email, password });
  btn.disabled = false; btn.textContent = 'Sign in';
  if(error){
    errEl.textContent = error.message || 'Sign in failed. Check your email and password.';
    errEl.style.display = 'block';
    return;
  }
  await loadAdminData();
  populateRfqFilter();
  renderDashboard(); renderRfqs(); renderApplicants(); renderApprovals(); renderAudit();
  if(currentEmployee && currentEmployee.must_change_password){
    showChangePasswordGate();
  } else {
    showAdmin();
  }
}

const btnSignout = document.getElementById('btn-signout');
if(btnSignout) btnSignout.addEventListener('click', async ()=>{
  await sb.auth.signOut();
  window.location.href = 'index.html';
});

/* ---- Idle timeout: auto sign-out after 30 minutes of inactivity, with a 2-minute warning ---- */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const IDLE_WARNING_MS = 2 * 60 * 1000;
let lastActivityAt = Date.now();
let idleCheckInterval = null;
let idleWarningShown = false;
function resetIdleTimer(){
  lastActivityAt = Date.now();
  idleWarningShown = false;
}
function startIdleWatcher(){
  ['mousemove','mousedown','keydown','scroll','touchstart','click'].forEach(evt=>{
    document.addEventListener(evt, resetIdleTimer, {passive:true});
  });
  resetIdleTimer();
  if(idleCheckInterval) clearInterval(idleCheckInterval);
  idleCheckInterval = setInterval(checkIdleStatus, 10000);
}
function stopIdleWatcher(){
  if(idleCheckInterval){ clearInterval(idleCheckInterval); idleCheckInterval = null; }
}
function checkIdleStatus(){
  const elapsed = Date.now() - lastActivityAt;
  if(elapsed >= IDLE_TIMEOUT_MS){
    performIdleLogout();
  } else if(elapsed >= IDLE_TIMEOUT_MS - IDLE_WARNING_MS && !idleWarningShown){
    idleWarningShown = true;
    const modal = document.getElementById('modal-idle-warning');
    if(modal){ modal.classList.add('active'); document.getElementById('overlay').classList.add('active'); }
  }
}
async function performIdleLogout(){
  stopIdleWatcher();
  closeAll();
  await sb.auth.signOut();
  currentEmployee = null;
  showLogin();
  const errEl = document.getElementById('login-error');
  if(errEl){ errEl.textContent = "You were signed out after 30 minutes of inactivity."; errEl.style.display = 'block'; }
}

/* ---- admin.html only: "Install as desktop app" ---- */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredInstallPrompt = e;
  const btnLogin = document.getElementById('install-btn-login');
  const btnSidebar = document.getElementById('install-btn-sidebar');
  if(btnLogin) btnLogin.style.display = 'block';
  if(btnSidebar) btnSidebar.style.display = 'block';
});
async function triggerInstall(){
  if(!deferredInstallPrompt){
    toast("Already installed or unsupported", "If you don't see an install prompt, your browser may not support this, or it's already installed.");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  const btnLogin = document.getElementById('install-btn-login');
  const btnSidebar = document.getElementById('install-btn-sidebar');
  if(btnLogin) btnLogin.style.display = 'none';
  if(btnSidebar) btnSidebar.style.display = 'none';
}
window.addEventListener('appinstalled', ()=>{ toast("Installed", "CNWE Admin has been added to your desktop."); });
if('serviceWorker' in navigator && document.getElementById('login-view')){
  navigator.serviceWorker.register('sw.js').catch(e=>console.error('service worker registration failed', e));
}

/* ---- index.html only: the public portal's top bar reflects whether the
   visitor happens to already have an admin session (shared across both
   pages via Supabase's browser-stored session) — no page toggling needed
   since this page IS the public view. ---- */
async function updatePublicTopbar(){
  const msgEl = document.getElementById('public-topbar-msg');
  const linkEl = document.getElementById('public-topbar-link');
  if(!msgEl || !linkEl) return;
  const { data: { session } } = await sb.auth.getSession();
  if(session){
    msgEl.textContent = "You're signed in as an admin.";
    linkEl.textContent = '← Back to admin register';
  } else {
    msgEl.textContent = 'Looking to manage tenders?';
    linkEl.textContent = 'Staff login';
  }
}

/* ============================================================
   BADGES / HELPERS
   ============================================================ */
function rfqBadgeClass(s){
  if(["Awarded","Contract Signed","Closed"].includes(s)) return "sage";
  if(["Cancelled"].includes(s)) return "rust";
  if(["Draft","Pending Internal Approval"].includes(s)) return "ink";
  if(["Paused","Under Review"].includes(s)) return "gold";
  if(s==="Closed for Applications") return "ink";
  return "gold";
}
/* Display-only: the stored status stays "Open for Applications"/"Published" —
   that's what every actual rule in the system (public visibility, RLS, the
   status-change workflow) keys off. This just relabels the badge staff see
   once the closing time has genuinely passed, so the register doesn't keep
   reading "Open" for something no longer accepting applications. */
function rfqDisplayStatus(r){
  if((r.status==="Open for Applications"||r.status==="Published") && rfqIsClosed(r.id)) return "Closed for Applications";
  return r.status;
}
function appBadgeClass(s){
  if(s==="Unsuccessful"||s==="Ineligible"||s==="Validation Failed"||s==="Incomplete") return "rust";
  if(["Contract Signed","Onboarding","Closed","Preferred Bidder","Awarded"].includes(s)) return "sage";
  if(s==="Application Received") return "ink";
  return "gold";
}
function rfqTitle(id){ const r=rfqs.find(x=>x.id===id); return r? r.title : id; }
function zar(n){ return "R "+Number(n).toLocaleString('en-ZA'); }

/* ============================================================
   DASHBOARD — dark KPI theme, chart helpers
   ============================================================ */
const KD_PALETTE = ['#3B82F6','#22C55E','#A855F7','#F59E0B','#14B8A6','#EC4899','#FACC15'];
const KD_ICONS = {
  dollar:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  users:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  target:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  briefcase:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
};

function kdMonthKeys(n){
  const out=[]; const d=new Date();
  d.setDate(1);
  for(let i=n-1;i>=0;i--){
    const m=new Date(d.getFullYear(), d.getMonth()-i, 1);
    out.push({key:m.getFullYear()+'-'+m.getMonth(), label:m.toLocaleString('en-US',{month:'short'})});
  }
  return out;
}
function kdMonthKeyOf(dateStr){ const d=new Date(dateStr); return d.getFullYear()+'-'+d.getMonth(); }

function kdDonut(segments, size, thickness, centerBig, centerSmall){
  const total = segments.reduce((s,x)=>s+x.value,0)||1;
  const r=(size-thickness)/2, c=size/2, circ=2*Math.PI*r;
  let offset=0;
  const circles = segments.map(seg=>{
    const frac=seg.value/total, dash=frac*circ, gap=circ-dash;
    const el=`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${thickness}" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${c} ${c})"></circle>`;
    offset+=dash; return el;
  }).join('');
  const center = centerBig ? `<div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
      <div class="kd-gauge-n" style="font-size:${size>110?'20px':'15px'};">${centerBig}</div>
      ${centerSmall?`<div class="kd-gauge-l">${centerSmall}</div>`:''}
    </div>` : '';
  return `<div style="position:relative; width:${size}px; height:${size}px; flex-shrink:0;"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${circles}</svg>${center}</div>`;
}
function kdLine(values, w, h, color){
  const max=Math.max(...values,1), min=Math.min(...values,0), range=(max-min)||1;
  const stepX = values.length>1 ? w/(values.length-1) : w;
  const pts = values.map((v,i)=>{ const x=i*stepX; const y=h-((v-min)/range)*(h-14)-7; return [x,y]; });
  const ptStr = pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const dots = pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${color}"></circle>`).join('');
  const areaPts = `0,${h} ${ptStr} ${w},${h}`;
  const gid='lg'+Math.floor(Math.random()*100000);
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.32"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${areaPts}" fill="url(#${gid})"></polygon>
    <polyline points="${ptStr}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"></polyline>
    ${dots}
  </svg>`;
}

function renderDashboard(){
  const activeRfqs = rfqs.filter(r=>!["Draft","Cancelled","Closed"].includes(r.status));
  const draftRfqs = rfqs.filter(r=>r.status==="Draft");
  const totalValue = activeRfqs.reduce((s,r)=>s+r.budget,0);
  const activeApplicants = applicants.filter(a=>!["Unsuccessful","Closed"].includes(a.status));
  const unsuccessful = applicants.filter(a=>a.status==="Unsuccessful");
  const newThisWeek = applicants.filter(a=> new Date(a.received) >= new Date(today(-7))).length;
  const pipelineHealth = applicants.length ? Math.round((applicants.length-unsuccessful.length)/applicants.length*100) : 0;

  /* ---- stat cards ---- */
  document.getElementById('kd-stats').innerHTML = `
    <div class="kd-stat"><div class="kd-icon" style="background:#3B82F6;">${KD_ICONS.dollar}</div>
      <div class="kd-n">${zar(totalValue)}</div><div class="kd-l">Total procurement value</div>
      <div class="kd-delta up">● <span class="sub">${activeRfqs.length} active RFQs</span></div></div>
    <div class="kd-stat"><div class="kd-icon" style="background:#22C55E;">${KD_ICONS.users}</div>
      <div class="kd-n">${activeApplicants.length}</div><div class="kd-l">Applicants in pipeline</div>
      <div class="kd-delta up">● <span class="sub">${newThisWeek} received this week</span></div></div>
    <div class="kd-stat"><div class="kd-icon" style="background:#A855F7;">${KD_ICONS.target}</div>
      <div class="kd-n">${pipelineHealth}%</div><div class="kd-l">Pipeline health</div>
      <div class="kd-delta down">● <span class="sub">${unsuccessful.length} unsuccessful</span></div></div>
    <div class="kd-stat"><div class="kd-icon" style="background:#F59E0B;">${KD_ICONS.briefcase}</div>
      <div class="kd-n">${activeRfqs.length}</div><div class="kd-l">Active RFQs</div>
      <div class="kd-delta up">● <span class="sub">${draftRfqs.length} in draft</span></div></div>
  `;

  /* ---- bar chart: RFQs published over time ---- */
  const months = kdMonthKeys(6);
  const counts = months.map(m=> rfqs.filter(r=>kdMonthKeyOf(r.open)===m.key).length);
  const maxCount = Math.max(...counts,1);
  document.getElementById('kd-bars').innerHTML = `<div class="kd-bar-chart">${months.map((m,i)=>`
    <div class="kd-bar-col">
      <div class="kd-bar-val">${counts[i]||''}</div>
      <div class="kd-bar" style="height:${counts[i]? Math.max(8,(counts[i]/maxCount*110)) : 3}px;"></div>
      <div class="kd-bar-label">${m.label}</div>
    </div>`).join('')}</div>`;

  /* ---- donut: budget by category ---- */
  const catMap = {};
  activeRfqs.forEach(r=>{ catMap[r.category] = (catMap[r.category]||0) + r.budget; });
  const catSegs = Object.keys(catMap).map((k,i)=>({label:k, value:catMap[k], color:KD_PALETTE[i%KD_PALETTE.length]}));
  document.getElementById('kd-donut1').innerHTML = `<div class="kd-donut-wrap">
    ${kdDonut(catSegs.length?catSegs:[{value:1,color:'#2A3B57'}], 116, 15, zar(totalValue).replace('R ','R'), 'Total')}
    <div class="kd-donut-legend">${catSegs.map(s=>`<div class="row"><span class="dot" style="background:${s.color};"></span>${s.label}<span class="val">${zar(s.value)}</span></div>`).join('') || '<div class="row">No active RFQs yet</div>'}</div>
  </div>`;

  /* ---- ranked list: top applicants by progress ---- */
  const ranked = applicants.filter(a=>a.status!=="Unsuccessful").map(a=>{
    const idx = KANBAN_STAGES.indexOf(a.status);
    const pct = idx>=0 ? Math.round(((idx+1)/KANBAN_STAGES.length)*100) : (a.status==="Closed"?100:0);
    return {a, pct};
  }).sort((x,y)=>y.pct-x.pct).slice(0,5);
  document.getElementById('kd-rank').innerHTML = ranked.map((r,i)=>`
    <div class="kd-rank-row">
      <span class="kd-rank-dot" style="background:${KD_PALETTE[i%KD_PALETTE.length]};"></span>
      <span class="kd-rank-name">${r.a.business}</span>
      <span class="kd-rank-score">${r.pct}%</span>
      <span class="kd-rank-trend ${r.a.timeline.length>1?'up':'flat'}">${r.a.timeline.length>1?'▲':'—'}</span>
    </div>`).join('') || `<div style="color:var(--kd-dim); font-size:12px;">No applicants yet.</div>`;

  /* ---- donut: applicant status mix ---- */
  const closedGroup = applicants.filter(a=>["Contract Signed","Onboarding","Closed"].includes(a.status)).length;
  const mix = [
    {label:'Active', value: applicants.length-unsuccessful.length-closedGroup, color:'#3B82F6'},
    {label:'Unsuccessful', value: unsuccessful.length, color:'#F87171'},
    {label:'Closed / Onboarded', value: closedGroup, color:'#22C55E'},
  ].filter(s=>s.value>0);
  document.getElementById('kd-donut2').innerHTML = `<div class="kd-donut-wrap">
    ${kdDonut(mix.length?mix:[{value:1,color:'#2A3B57'}], 108, 15, String(applicants.length), 'Total')}
    <div class="kd-donut-legend">${mix.map(s=>`<div class="row"><span class="dot" style="background:${s.color};"></span>${s.label}<span class="val">${s.value}</span></div>`).join('') || '<div class="row">No applicants yet</div>'}</div>
  </div>`;

  /* ---- gauge: pipeline health ---- */
  document.getElementById('kd-gauge').innerHTML = `<div class="kd-gauge-wrap">
    ${kdDonut([{value:pipelineHealth,color:'#A855F7'},{value:100-pipelineHealth,color:'#26314A'}], 118, 14, pipelineHealth+'%', 'Active vs. unsuccessful')}
    <div class="kd-gauge-delta">${applicants.length-unsuccessful.length} of ${applicants.length} applicants still active</div>
  </div>`;

  /* ---- line chart: contract value trend (cumulative) ---- */
  let running=0;
  const cumValues = months.map(m=>{ running += rfqs.filter(r=>kdMonthKeyOf(r.open)===m.key).reduce((s,r)=>s+r.budget,0); return running; });
  document.getElementById('kd-line').innerHTML = `<div class="kd-line-val">${zar(running)}</div>
    <div class="kd-line-chart">${kdLine(cumValues, 260, 100, '#14B8A6')}</div>
    <div style="display:flex; justify-content:space-between; font-size:9.5px; color:var(--kd-dim); margin-top:2px;">${months.map(m=>`<span>${m.label}</span>`).join('')}</div>`;

  /* ---- mini bar: pending gates by type ---- */
  const gateGroups = {};
  pendingApprovals().forEach(p=>{ gateGroups[p.gate] = (gateGroups[p.gate]||0)+1; });
  const gateEntries = Object.entries(gateGroups);
  const maxGate = Math.max(...gateEntries.map(e=>e[1]),1);
  document.getElementById('kd-minibar').innerHTML = gateEntries.length ? `<div class="kd-minibar">${gateEntries.map(([label,val],i)=>`
    <div class="col"><div class="b" style="height:${Math.max(10,val/maxGate*70)}px; background:${KD_PALETTE[i%KD_PALETTE.length]};"></div>
    <div class="lab">${label.split(' ').slice(0,2).join(' ')}</div></div>`).join('')}</div>`
    : `<div style="color:var(--kd-dim); font-size:12px;">No gates pending.</div>`;
}



/* ============================================================
   RFQs
   ============================================================ */
function populateRfqCategoryStatusFilters(){
  const catSel = document.getElementById('rfq-filter-category');
  const statSel = document.getElementById('rfq-filter-status');
  if(!catSel || !statSel) return;
  const curCat = catSel.value || 'all';
  const curStat = statSel.value || 'all';
  const cats = [...new Set(rfqs.map(r=>r.category).filter(Boolean))].sort();
  const stats = [...new Set(rfqs.map(r=>r.status).filter(Boolean))].sort();
  catSel.innerHTML = `<option value="all">All types</option>` + cats.map(c=>`<option value="${escapeAttr(c)}">${escapeAttr(c)}</option>`).join('');
  statSel.innerHTML = `<option value="all">All statuses</option>` + stats.map(s=>`<option value="${escapeAttr(s)}">${escapeAttr(s)}</option>`).join('');
  if(cats.includes(curCat)) catSel.value = curCat;
  if(stats.includes(curStat)) statSel.value = curStat;
}
function clearRfqFilters(){
  document.getElementById('rfq-filter-category').value = 'all';
  document.getElementById('rfq-filter-status').value = 'all';
  document.getElementById('rfq-filter-date-from').value = '';
  document.getElementById('rfq-filter-date-to').value = '';
  renderRfqs();
}
function getFilteredRfqs(){
  const cat = document.getElementById('rfq-filter-category').value || 'all';
  const stat = document.getElementById('rfq-filter-status').value || 'all';
  const dateFrom = document.getElementById('rfq-filter-date-from').value;
  const dateTo = document.getElementById('rfq-filter-date-to').value;
  return rfqs.filter(r=>
    (cat==='all' || r.category===cat) &&
    (stat==='all' || r.status===stat) &&
    (!dateFrom || !r.close || new Date(r.close) >= new Date(dateFrom)) &&
    (!dateTo || !r.close || new Date(r.close) < new Date(new Date(dateTo).getTime() + 24*60*60*1000))
  );
}
function printRfqList(){
  const filtered = getFilteredRfqs();
  const catSel = document.getElementById('rfq-filter-category');
  const statSel = document.getElementById('rfq-filter-status');
  const dateFrom = document.getElementById('rfq-filter-date-from').value;
  const dateTo = document.getElementById('rfq-filter-date-to').value;
  const filterNotes = [];
  if(catSel.value !== 'all') filterNotes.push(`Type: ${catSel.value}`);
  if(statSel.value !== 'all') filterNotes.push(`Status: ${statSel.value}`);
  if(dateFrom) filterNotes.push(`Closes after ${dateFrom}`);
  if(dateTo) filterNotes.push(`Closes before ${dateTo}`);

  const rows = filtered.map(r => `
    <tr>
      <td>${escapeAttr(r.id)}</td>
      <td>${escapeAttr(r.title)}</td>
      <td>${escapeAttr(r.category)}</td>
      <td>${zar(r.budget)}</td>
      <td>${escapeAttr(rfqDisplayStatus(r))}</td>
      <td>${applicants.filter(a=>a.rfq===r.id).length}</td>
      <td>${escapeAttr(r.open||'')}</td>
      <td>${formatCloseDisplay(r.close)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>RFQ Register — CNWE Energy</title>
    <style>
      body{ font-family: Arial, Helvetica, sans-serif; color:#0B3654; margin:32px; }
      h1{ font-size:20px; margin-bottom:2px; }
      .meta{ color:#6B7785; font-size:12px; margin-bottom:18px; }
      table{ width:100%; border-collapse:collapse; font-size:12px; }
      th{ text-align:left; background:#0B3654; color:#fff; padding:8px 10px; }
      td{ padding:7px 10px; border-bottom:1px solid #D8DEE4; }
      tr:nth-child(even) td{ background:#F3F5F7; }
      @media print { body{ margin:12mm; } }
    </style></head>
    <body>
      <h1>CNWE Energy — RFQ Register</h1>
      <div class="meta">
        Generated ${new Date().toLocaleString('en-ZA')} · ${filtered.length} RFQ${filtered.length===1?'':'s'}
        ${filterNotes.length ? ' · Filtered by: ' + filterNotes.join(', ') : ' · No filters applied'}
      </div>
      <table>
        <tr><th>Reference</th><th>Title</th><th>Category</th><th>Budget</th><th>Status</th><th>Applications</th><th>Opens</th><th>Closes</th></tr>
        ${rows || '<tr><td colspan="8" style="text-align:center; color:#6B7785;">No RFQs match the current filters.</td></tr>'}
      </table>
    </body></html>`;

  const win = window.open('', '_blank');
  if(!win){ toast("Pop-up blocked", "Please allow pop-ups for this site to print or download the list."); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
function renderRfqs(){
  populateRfqCategoryStatusFilters();
  const filtered = getFilteredRfqs();
  document.getElementById('rfq-table').innerHTML = `
    <tr><th>Reference</th><th>Title</th><th>Category</th><th>Budget</th><th>Status</th><th>Applications</th><th>Opens</th><th>Closes</th><th></th></tr>
    ${filtered.map(r=>{
      const appCount = applicants.filter(a=>a.rfq===r.id).length;
      return `<tr class="rowlink" onclick="focusRfqInPipeline('${r.id}')">
      <td class="ref mono">${r.id}</td><td>${r.title}</td><td>${r.category}</td><td class="mono">${zar(r.budget)}</td>
      <td>
        <span class="badge ${rfqBadgeClass(rfqDisplayStatus(r))}">${rfqDisplayStatus(r)}</span>
        ${r.pendingStatusChange ? `<div style="font-size:10.5px; color:var(--ink-3); margin-top:3px;">⏳ Pending: ${escapeAttr(r.pendingStatusChange.targetStatus)}</div>` : ''}
      </td>
      <td class="mono" style="${appCount>0?'font-weight:600;':'color:var(--ink-3);'}">${appCount} received</td>
      <td class="mono">${r.open}</td><td class="mono">${formatCloseDisplay(r.close)}${(r.extensionNotices&&r.extensionNotices.length) ? ` <span title="Extended ${r.extensionNotices.length}x">⏱</span>` : ''}</td>
      <td style="white-space:nowrap;">
        ${r.status==="Draft" && can('can_manage_rfqs') ? `<button class="btn small secondary" onclick="event.stopPropagation(); openEditRfq('${r.id}')">Edit</button>` : ''}
        ${r.status==="Draft" && can('can_publish_rfqs') ? `<button class="btn small gold" onclick="event.stopPropagation(); requestPublishRfq('${r.id}')">Publish</button>` : ''}
        ${r.pendingStatusChange && can('can_publish_rfqs') ? `<button class="btn small gold" onclick="event.stopPropagation(); openRfqStatusReview('${r.id}')">Review</button>` : ''}
        ${!r.pendingStatusChange && r.status!=="Draft" && can('can_manage_rfqs') ? `<button class="btn small secondary" onclick="event.stopPropagation(); openRfqStatusRequest('${r.id}')">Change status</button>` : ''}
        ${["Open for Applications","Published"].includes(r.status) && can('can_publish_rfqs') ? `<button class="btn small secondary" onclick="event.stopPropagation(); openExtendDate('${r.id}')">Extend date</button>` : ''}
      </td></tr>`;
    }).join('') || `<tr><td colspan="9" style="text-align:center; color:var(--ink-3); padding:20px;">No RFQs match these filters.</td></tr>`}
  `;
}
function focusRfqInPipeline(id){
  switchView('applicants');
  document.getElementById('rfq-filter').value = id;
  renderApplicants();
}

let newRfqDocs = [];
let editingRfqId = null;
function populateApproverDropdown(selectedId){
  const sel = document.getElementById('nr-approver');
  if(!sel) return;
  const eligible = employees.filter(e => e.can_publish_rfqs);
  sel.innerHTML = `<option value="">No one assigned</option>` + eligible.map(e=>`<option value="${e.id}">${escapeAttr(e.name)} (${escapeAttr(e.position||e.email)})</option>`).join('');
  sel.value = selectedId || '';
}
function openNewRfq(){
  editingRfqId = null;
  document.getElementById('nr-modal-title').textContent = 'New RFQ record';
  document.getElementById('nr-save-btn').textContent = 'Save as Draft';
  document.getElementById('nr-modal-note').innerHTML = 'This record is created as <strong>Draft</strong>. Publishing requires sign-off from the Procurement Manager or delegated authority — recorded as a decision gate.';
  newRfqDocs = [docReq("CIPC company registration"), docReq("Valid tax clearance certificate")];
  newRfqAttachments = [];
  document.getElementById('nr-title').value='';
  document.getElementById('nr-category').value='';
  document.getElementById('nr-budget').value='';
  document.getElementById('nr-open').value='';
  document.getElementById('nr-close').value='';
  document.getElementById('nr-desc').value='';
  populateApproverDropdown(null);
  renderNrDocList();
  renderNrAttachList();
  document.getElementById('modal-newrfq').classList.add('active'); document.getElementById('overlay').classList.add('active');
}
function openEditRfq(id){
  const r = rfqs.find(x=>x.id===id);
  if(!r) return;
  if(r.status !== "Draft"){ toast("Can't edit", "Only Draft RFQs can be edited — this one has already been published."); return; }
  editingRfqId = id;
  document.getElementById('nr-modal-title').textContent = `Edit ${r.id}`;
  document.getElementById('nr-save-btn').textContent = 'Save changes';
  document.getElementById('nr-modal-note').innerHTML = 'This RFQ is still a <strong>Draft</strong> — changes here are safe until it\'s published.';
  newRfqDocs = (r.requiredDocs||[]).map(d=>({...d}));
  newRfqAttachments = (r.attachments||[]).map(f=>({...f, uploading:false}));
  document.getElementById('nr-title').value = r.title||'';
  document.getElementById('nr-category').value = r.category||'';
  document.getElementById('nr-budget').value = r.budget||'';
  document.getElementById('nr-open').value = r.open||'';
  document.getElementById('nr-close').value = toDatetimeLocalValue(r.close);
  document.getElementById('nr-desc').value = r.desc||'';
  populateApproverDropdown(r.assignedApproverId);
  renderNrDocList();
  renderNrAttachList();
  document.getElementById('modal-newrfq').classList.add('active'); document.getElementById('overlay').classList.add('active');
}
function renderNrDocList(){
  const el = document.getElementById('nr-doclist');
  el.innerHTML = newRfqDocs.length ? newRfqDocs.map((d,i)=>`
    <div class="docreq-row">
      <span>${d.name} ${d.mandatory? '<span class="badge rust" style="margin-left:4px;">Mandatory</span>' : '<span class="badge ink" style="margin-left:4px;">Optional</span>'}</span>
      <button type="button" class="rm" onclick="removeDocRequirement(${i})" title="Remove">✕</button>
    </div>`).join('') : `<div style="font-size:12px; color:var(--ink-3);">No documents added yet.</div>`;
}
function addDocRequirement(){
  const input = document.getElementById('nr-doc-input');
  const name = input.value.trim();
  if(!name) return;
  const mandatory = document.getElementById('nr-doc-mandatory').checked;
  newRfqDocs.push(docReq(name, mandatory));
  input.value='';
  document.getElementById('nr-doc-mandatory').checked = true;
  renderNrDocList();
}
function removeDocRequirement(i){ newRfqDocs.splice(i,1); renderNrDocList(); }

let newRfqAttachments = [];
async function renderNrAttachList(){
  const el = document.getElementById('nr-attachlist');
  if(!el) return;
  if(!newRfqAttachments.length){
    el.innerHTML = `<div style="font-size:12px; color:var(--ink-3);">No tender documents attached yet.</div>`;
    return;
  }
  // Fetch a fresh short-lived link for each saved attachment (not ones still mid-upload).
  await Promise.all(newRfqAttachments.map(async f=>{
    if(f.uploading || !f.path) return;
    const { data, error } = await sb.storage.from('rfq-documents').createSignedUrl(f.path, 600);
    f._previewUrl = error ? null : data.signedUrl;
  }));
  el.innerHTML = newRfqAttachments.map((f,i)=>`
    <div class="docreq-row">
      <span>${f.uploading ? 'Uploading…' : (f._previewUrl ? `<a href="${f._previewUrl}" target="_blank" rel="noopener">${escapeAttr(f.name)}</a>` : escapeAttr(f.name))}</span>
      <button type="button" class="rm" onclick="removeRfqAttachment(${i})" title="Remove">✕</button>
    </div>`).join('');
}
async function handleRfqAttachment(input){
  const file = input.files && input.files[0];
  if(!file) return;
  input.value = '';
  const idx = newRfqAttachments.length;
  newRfqAttachments.push({name:file.name, path:null, uploading:true});
  renderNrAttachList();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${editingRfqId||'new'}/${Date.now()}_${safeName}`;
  try{
    const { error: uploadErr } = await sb.storage.from('rfq-documents').upload(path, file, {upsert:false, contentType:file.type||'application/octet-stream'});
    if(uploadErr) throw uploadErr;
    newRfqAttachments[idx].path = path;
    newRfqAttachments[idx].uploading = false;
  } catch(e){
    console.error('rfq document upload failed', e);
    toast("Upload failed", `Could not upload ${file.name} — please try again.`);
    newRfqAttachments.splice(idx,1);
  }
  renderNrAttachList();
}
function removeRfqAttachment(i){
  const f = newRfqAttachments[i];
  if(f && f.path) sb.storage.from('rfq-documents').remove([f.path]).then(({error})=>{ if(error) console.error('attachment delete failed', error); });
  newRfqAttachments.splice(i,1);
  renderNrAttachList();
}

async function createRfq(){
  const title = document.getElementById('nr-title').value.trim();
  if(!title){ toast("Missing title","Give this RFQ a title before saving."); return; }
  if(newRfqAttachments.some(f=>f.uploading)){ toast("Still uploading","Please wait for tender document uploads to finish before saving."); return; }
  const selectedApproverId = document.getElementById('nr-approver').value || null;

  if(editingRfqId){
    const r = rfqs.find(x=>x.id===editingRfqId);
    if(!r){ toast("Not found","Could not find that RFQ to update."); closeAll(); return; }
    const previousApproverId = r.assignedApproverId || null;
    r.title = title;
    r.category = document.getElementById('nr-category').value||"General";
    r.budget = Number(document.getElementById('nr-budget').value)||0;
    r.open = document.getElementById('nr-open').value||today();
    r.close = fromDatetimeLocalValue(document.getElementById('nr-close').value) || defaultCloseDateTime(21);
    r.desc = document.getElementById('nr-desc').value||"";
    r.requiredDocs = newRfqDocs.slice();
    r.attachments = newRfqAttachments.map(f=>({name:f.name, path:f.path}));
    r.assignedApproverId = selectedApproverId;
    renderRfqs();
    logAudit(`${r.id} edited (still Draft)`,"Procurement Manager");
    closeAll();
    toast("RFQ updated", `${r.id} has been saved.`);
    const { error } = await sb.from('rfq_rfqs').update({title:r.title, category:r.category, budget:r.budget, open_date:r.open, close_date:r.close, description:r.desc, required_docs:r.requiredDocs, attachments:r.attachments||[], assigned_approver_id:r.assignedApproverId}).eq('id', r.id);
    if(error){ console.error('editRfq persist failed', error); toast("Not saved to database", "The change shows locally but failed to save to Supabase — check the console."); return; }
    if(selectedApproverId && selectedApproverId !== previousApproverId) notifyAssignedApprover(r, 'This RFQ is a Draft awaiting your review and publishing.');
    return;
  }

  uidCounter++;
  const id = "RFQ-2026-"+uidCounter;
  const r = {id, title, category:document.getElementById('nr-category').value||"General",
    budget:Number(document.getElementById('nr-budget').value)||0, status:"Draft",
    open:document.getElementById('nr-open').value||today(), close:fromDatetimeLocalValue(document.getElementById('nr-close').value) || defaultCloseDateTime(21),
    desc:document.getElementById('nr-desc').value||"", requiredDocs:newRfqDocs.slice(),
    attachments:newRfqAttachments.map(f=>({name:f.name, path:f.path})), assignedApproverId:selectedApproverId};
  rfqs.unshift(r);
  populateRfqFilter();
  logAudit(`${id} created as Draft with ${newRfqDocs.length} required document(s)`,"Procurement Manager");
  closeAll();
  toast("RFQ saved", `${id} created as a Draft. Publishing requires sign-off.`);
  switchView('rfqs');
  const { error } = await sb.from('rfq_rfqs').insert({id:r.id, title:r.title, category:r.category, status:r.status, budget:r.budget, open_date:r.open, close_date:r.close, description:r.desc, required_docs:r.requiredDocs, attachments:r.attachments||[], assigned_approver_id:r.assignedApproverId});
  if(error){ console.error('createRfq persist failed', error); toast("Not saved to database", "The RFQ shows locally but failed to save to Supabase — check the console."); return; }
  if(selectedApproverId) notifyAssignedApprover(r, 'This new RFQ is a Draft awaiting your review and publishing.');
}
function notifyAssignedApprover(r, message){
  const approver = employees.find(e => e.id === r.assignedApproverId);
  if(!approver || !approver.email) return;
  sb.functions.invoke('send-notification-email', { body: {
    trigger: 'rfq_approval_needed', recipientEmail: approver.email, recipientName: approver.name, rfqId: r.id,
    customMessage: message, triggeredBy: (currentEmployee&&currentEmployee.email)||'system',
  } }).then(({data,error})=>{ if(error||!data||!data.success) console.error('approver notification failed', error||data); });
}

/* ============================================================
   APPLICANTS / KANBAN
   ============================================================ */
function populateRfqFilter(){
  const sel = document.getElementById('rfq-filter');
  sel.innerHTML = `<option value="all">All RFQs</option>` + rfqs.map(r=>`<option value="${r.id}">${r.id} — ${r.title}</option>`).join('');
}

function renderApplicants(){
  const filter = document.getElementById('rfq-filter').value || 'all';
  const list = applicants.filter(a=> filter==='all' || a.rfq===filter);
  const kanban = document.getElementById('kanban');
  const cols = KANBAN_STAGES.map(stage=>{
    const items = list.filter(a=>a.status===stage);
    const doneStage = ["Contract Signed","Onboarding","Closed"].includes(stage);
    return `<div class="kcol">
      <div class="kcol-head" onclick="this.parentElement.classList.toggle('collapsed')"><span>${stage}</span><span>${items.length}</span></div>
      <div class="kcol-cards">
        ${items.map(a=>`<div class="kcard ${doneStage?'awarded':''}" onclick="openApplicant('${a.id}')">
          <div class="biz">${a.business}</div>
          <div class="ref mono">${a.id} · ${rfqTitle(a.rfq).split(' ').slice(0,3).join(' ')}…</div>
        </div>`).join('')}
      </div>
    </div>`;
  }).join('');
  const unsuccessful = list.filter(a=>a.status==="Unsuccessful");
  const unsCol = `<div class="kcol">
    <div class="kcol-head" onclick="this.parentElement.classList.toggle('collapsed')"><span>Unsuccessful</span><span>${unsuccessful.length}</span></div>
    <div class="kcol-cards">
      ${unsuccessful.map(a=>`<div class="kcard unsuccessful" onclick="openApplicant('${a.id}')">
        <div class="biz">${a.business}</div><div class="ref mono">${a.id}</div>
      </div>`).join('')}
    </div>
  </div>`;
  kanban.innerHTML = cols + unsCol;
}

let currentApplicantEvaluation = null;
function renderEvaluationSection(a){
  const el = document.getElementById('ad-evaluation');
  if(!el) return;
  const stageIdx = KANBAN_STAGES.indexOf(a.status);
  const reachedEvaluation = stageIdx >= KANBAN_STAGES.indexOf("Under Evaluation");
  // Evaluation belongs to the window between reaching "Under Evaluation" and the
  // Recommendation gate — once a recommendation has moved the case past that point
  // (Preferred Bidder, Contract Being Drafted, etc.), the score that justified it
  // shouldn't still be editable, and there's nothing to "start" evaluating either.
  const evaluationActionable = reachedEvaluation && stageIdx <= KANBAN_STAGES.indexOf("Recommendation Recorded");
  const ev = currentApplicantEvaluation;

  if(!ev && !evaluationActionable){ el.innerHTML = ''; return; }

  let html = `<h3 style="font-size:13px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-3); margin:22px 0 4px 0;">Evaluation</h3>`;

  if(ev){
    html += `
      <div style="background:var(--paper-2); border-radius:var(--radius); padding:10px 12px; margin-bottom:8px;">
        ${(ev.scores||[]).map(s=>`<div class="field-row"><span class="k">${escapeAttr(s.label)}</span><span class="mono">${s.score} / ${s.maxPoints}</span></div>`).join('')}
        <div class="field-row" style="border-top:1px solid var(--line); margin-top:4px; padding-top:6px;"><span class="k" style="font-weight:600;">Total</span><span class="mono" style="font-weight:600;">${ev.total_score} / 100</span></div>
        <div class="field-row"><span class="k">Evaluator</span><span>${escapeAttr(ev.evaluator)}</span></div>
        <div class="field-row"><span class="k">Date</span><span class="mono">${(ev.evaluated_at||'').slice(0,10)}</span></div>
        ${ev.conflict_declared ? `<div class="field-row"><span class="k">Conflict declared</span><span class="badge rust">Yes${ev.conflict_notes? ' — '+escapeAttr(ev.conflict_notes):''}</span></div>` : ''}
      </div>
      ${(evaluationActionable && can('can_evaluate_approve')) ? `<button class="btn small secondary" onclick="openEvaluationModal('${a.id}')">Re-evaluate</button>` : ''}
    `;
  } else {
    html += can('can_evaluate_approve')
      ? `<button class="btn small gold" onclick="openEvaluationModal('${a.id}')">Evaluate this applicant</button>`
      : `<span style="font-size:12px; color:var(--ink-3);">Not yet evaluated. You don't have permission to score applicants.</span>`;
  }
  el.innerHTML = html;
}
let evaluatingApplicantId = null;
function openEvaluationModal(applicantId){
  const a = applicants.find(x=>x.id===applicantId);
  if(!a) return;
  evaluatingApplicantId = applicantId;
  document.getElementById('eval-context').textContent = `${a.business} — ${a.id} — ${rfqTitle(a.rfq)}`;
  const existing = currentApplicantEvaluation && currentApplicantEvaluation.applicant_id===applicantId ? currentApplicantEvaluation : null;
  document.getElementById('eval-criteria-list').innerHTML = EVALUATION_CRITERIA.map(c=>{
    const prior = existing ? (existing.scores||[]).find(s=>s.key===c.key) : null;
    return `
      <div style="margin-bottom:12px;">
        <label style="display:flex; justify-content:space-between; margin-bottom:3px;"><span>${c.label}</span><span class="mono" style="font-weight:400; color:var(--ink-3);">out of ${c.maxPoints}</span></label>
        <input type="number" class="eval-score-input" data-key="${c.key}" data-max="${c.maxPoints}" min="0" max="${c.maxPoints}" value="${prior?prior.score:0}" oninput="updateEvalTotal()">
      </div>`;
  }).join('');
  document.getElementById('eval-coi-none').checked = existing ? !existing.conflict_declared : false;
  document.getElementById('eval-coi-yes').checked = existing ? !!existing.conflict_declared : false;
  document.getElementById('eval-conflict-notes').value = existing ? (existing.conflict_notes||'') : '';
  toggleEvalConflictUI();
  updateEvalTotal();
  document.getElementById('modal-evaluation').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function toggleEvalConflictUI(){
  const noneChecked = document.getElementById('eval-coi-none').checked;
  const yesChecked = document.getElementById('eval-coi-yes').checked;
  document.getElementById('eval-conflict-notes-wrap').style.display = yesChecked ? 'block' : 'none';
  document.getElementById('eval-coi-blocked-note').style.display = yesChecked ? 'block' : 'none';
  document.getElementById('eval-coi-prompt-note').style.display = (!noneChecked && !yesChecked) ? 'block' : 'none';
  document.getElementById('eval-save-btn').style.display = yesChecked ? 'none' : 'inline-block';
  document.getElementById('eval-save-btn').disabled = !noneChecked;
  document.getElementById('eval-recuse-btn').style.display = yesChecked ? 'inline-block' : 'none';
}
function updateEvalTotal(){
  const inputs = [...document.querySelectorAll ? document.querySelectorAll('.eval-score-input') : []];
  let total = 0;
  inputs.forEach(inp=>{
    let v = Math.max(0, Math.min(Number(inp.value)||0, Number(inp.dataset.max)));
    inp.value = v;
    total += v;
  });
  const totalEl = document.getElementById('eval-total');
  if(totalEl) totalEl.textContent = `${total} / 100`;
}
async function submitEvaluation(){
  if(!document.getElementById('eval-coi-none').checked){ toast("Can't proceed", "Please confirm you have no conflict of interest before saving this evaluation."); return; }
  const a = applicants.find(x=>x.id===evaluatingApplicantId);
  if(!a) return;
  const inputs = [...document.querySelectorAll('.eval-score-input')];
  const scores = EVALUATION_CRITERIA.map(c=>{
    const inp = inputs.find(i=>i.dataset.key===c.key);
    const score = inp ? Math.max(0, Math.min(Number(inp.value)||0, c.maxPoints)) : 0;
    return { key:c.key, label:c.label, maxPoints:c.maxPoints, score };
  });
  const total = scores.reduce((sum,s)=>sum+s.score, 0);
  const evaluator = (currentEmployee && currentEmployee.email) || 'Unknown';

  const payload = { applicant_id:a.id, scores, total_score:total, conflict_declared:false, conflict_notes:null, evaluator, evaluated_at:new Date().toISOString() };
  const { data, error } = await sb.from('rfq_evaluations').upsert(payload, {onConflict:'applicant_id'}).select().maybeSingle();
  if(error){ console.error('evaluation save failed', error); toast("Not saved", "Could not save this evaluation — check the console."); return; }

  currentApplicantEvaluation = data || payload;
  logAudit(`${a.business} evaluated — total score ${total}/100`, evaluator, '');
  closeAll();
  toast("Evaluation saved", `${a.business} scored ${total}/100.`);
  renderEvaluationSection(a);
  renderRankings();
}
function submitEvalRecusal(){
  const a = applicants.find(x=>x.id===evaluatingApplicantId);
  if(!a) return;
  const reason = document.getElementById('eval-conflict-notes').value.trim();
  if(!reason){ toast("Details required", "Please describe the nature of the conflict before logging your recusal."); return; }
  const evaluator = (currentEmployee && currentEmployee.email) || 'Unknown';
  logAudit(`${evaluator} declared a conflict of interest and stepped back from evaluating ${a.business} (${a.id})`, evaluator, reason);
  toast("Recusal logged", "No score was recorded. Please hand this case to a colleague without a conflict.");
  closeAll();
  renderAudit();
}

function rfqIsClosed(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  if(!r || !r.close) return false;
  const d = new Date(r.close);
  return !isNaN(d) && d < new Date();
}

function renderProposalSection(a){
  const el = document.getElementById('ad-proposal');
  if(!el) return;
  if(!a.proposal){
    if(a.status === 'Invited to Submit Proposal' && a.proposalDeadline){
      el.innerHTML = `
        <h3 style="font-size:13px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-3); margin:22px 0 4px 0;">Proposal invitation sent</h3>
        <div class="field-row"><span class="k">Submission deadline</span><span class="mono" style="font-weight:600;">${formatCloseDisplay(a.proposalDeadline)}</span></div>
        <p style="font-size:11.5px; color:var(--ink-3); margin-top:4px;">The applicant was given this deadline in their invitation email and sees it again on their submission page.</p>
      `;
    } else {
      el.innerHTML = '';
    }
    return;
  }
  el.innerHTML = `
    <h3 style="font-size:13px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-3); margin:22px 0 4px 0;">Submitted proposal</h3>
    <div class="field-row"><span class="k">Total price</span><span class="mono" style="font-weight:600;">${escapeAttr(String(a.proposal.totalPrice))}</span></div>
    <div class="field-row"><span class="k">Submitted</span><span class="mono">${(a.proposal.submittedAt||'').slice(0,10)}</span></div>
    ${a.proposalDeadline ? `<div class="field-row"><span class="k">Deadline was</span><span class="mono">${formatCloseDisplay(a.proposalDeadline)}</span></div>` : ''}
    <div id="ad-proposal-docs" style="margin-top:6px;"><span style="font-size:12px; color:var(--ink-3);">Loading document links…</span></div>
  `;
  const docs = a.proposal.documents || [];
  Promise.all(docs.map(async d=>{
    try{
      const { data, error } = await sb.storage.from('applicant-documents').createSignedUrl(d.path, 600);
      return { name:d.fileName, url: (!error && data) ? data.signedUrl : null };
    } catch(e){ console.error('signed url failed for proposal doc', d.path, e); return { name:d.fileName, url:null }; }
  })).then(resolved=>{
    const docsEl = document.getElementById('ad-proposal-docs');
    if(!docsEl) return;
    docsEl.innerHTML = resolved.length ? resolved.map(d=>
      d.url ? `<div><a href="${d.url}" target="_blank" rel="noopener">${escapeAttr(d.name)}</a></div>` : `<div>${escapeAttr(d.name)} <span style="color:var(--ink-3); font-size:11px;">(link unavailable)</span></div>`
    ).join('') : `<span style="font-size:12px; color:var(--ink-3);">No documents.</span>`;
  });
}

async function openApplicant(id){
  const a = applicants.find(x=>x.id===id);
  if(!a) return;
  document.getElementById('ad-ref').textContent = a.id + " · " + a.rfq;
  document.getElementById('ad-business').textContent = a.business;
  document.getElementById('ad-status').innerHTML = `<span class="badge ${appBadgeClass(a.status)}">${a.status}</span>` + (a.reason? ` <span class="badge rust">${a.reason}</span>`:'');

  document.getElementById('ad-fields').innerHTML = `
    <div class="field-row"><span class="k">Contact</span><span>${a.name}${a.position? ' — '+escapeAttr(a.position):''}</span></div>
    <div class="field-row"><span class="k">Email</span><span>${a.email? `<a href="mailto:${escapeAttr(a.email)}">${escapeAttr(a.email)}</a>` : '—'}</span></div>
    <div class="field-row"><span class="k">Phone</span><span>${a.phone? escapeAttr(a.phone) : '—'}</span></div>
    <div class="field-row"><span class="k">Company reg. no.</span><span class="mono">${a.companyRegNo? escapeAttr(a.companyRegNo) : '—'}</span></div>
    <div class="field-row"><span class="k">RFQ</span><span>${rfqTitle(a.rfq)}</span></div>
    <div class="field-row"><span class="k">Received</span><span class="mono">${a.received}</span></div>
    <div class="field-row"><span class="k">Reference</span><span class="mono">${a.id}</span></div>
    ${a.comments ? `<div class="field-row" style="display:block;"><span class="k">Comments / questions</span><div style="margin-top:4px; font-size:12.5px; color:var(--ink); background:var(--paper-2); border-radius:var(--radius); padding:8px 10px;">${escapeAttr(a.comments)}</div></div>` : ''}
  `;

  renderProposalSection(a);

  const docs = a.documents || [];
  document.getElementById('applicant-drawer').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  document.getElementById('ad-docs').innerHTML = docs.length ? `<div style="font-size:12px; color:var(--ink-3);">Loading document links…</div>` : `<div style="font-size:12px; color:var(--ink-3);">No document requirements were set on this RFQ.</div>`;

  // Load this applicant's evaluation, if any, and render that section.
  const { data: evalData } = await sb.from('rfq_evaluations').select('*').eq('applicant_id', a.id).maybeSingle();
  currentApplicantEvaluation = evalData || null;
  renderEvaluationSection(a);

  // Generate a short-lived signed URL for each uploaded document (bucket is private).
  const signedUrls = {};
  await Promise.all(docs.filter(d=>d.filePath).map(async d=>{
    try{
      const { data, error } = await sb.storage.from('applicant-documents').createSignedUrl(d.filePath, 600);
      if(!error && data) signedUrls[d.docId] = data.signedUrl;
    } catch(e){ console.error('signed url failed for', d.filePath, e); }
  }));

  document.getElementById('ad-docs').innerHTML = docs.length ? docs.map(d=>`
    <div class="doc-check-block">
      <div class="doc-check">
        <span>${d.name}${d.mandatory? '<span class="req" style="color:var(--rust); font-size:10.5px; margin-left:5px;">Required</span>' : ''}</span>
        ${d.provided
          ? (signedUrls[d.docId]
              ? `<a href="${signedUrls[d.docId]}" target="_blank" rel="noopener" class="badge sage" style="text-decoration:none;">↗ Open ${d.fileName}</a>`
              : `<span class="badge sage">✓ ${d.fileName}</span>`)
          : `<span class="badge rust">Not provided</span>`}
      </div>
      ${d.provided ? `
        <div class="doc-comments">
          ${docCommentsOf(d).map(c=>`
            <div class="doc-comment-item">
              <div class="dc-text">${escapeAttr(c.text)}</div>
              <div class="dc-meta">${escapeAttr(c.author)}${c.date? ' · '+escapeAttr(c.date):''}</div>
            </div>`).join('') || `<div class="dc-empty">No comments yet.</div>`}
          <div class="doc-comment-add">
            ${can('can_review_documents') ? `
              <input type="text" class="doc-comment-input" id="new-comment-${d.docId}" placeholder="Add a review comment…" onkeydown="if(event.key==='Enter'){addDocComment('${a.id}','${d.docId}');}">
              <button class="btn small secondary" onclick="addDocComment('${a.id}','${d.docId}')">Add Comment</button>
            ` : `<span style="font-size:11px; color:var(--ink-3);">You don't have permission to add document comments.</span>`}
          </div>
        </div>` : ''}
    </div>`).join('') : `<div style="font-size:12px; color:var(--ink-3);">No document requirements were set on this RFQ.</div>`;

  const actionsEl = document.getElementById('ad-actions');
  const nextStage = KANBAN_STAGES[KANBAN_STAGES.indexOf(a.status)+1];
  const canAny = can('can_screen_validate') || can('can_evaluate_approve') || can('can_manage_contracts') || can('can_review_documents');

  if(a.status==="Unsuccessful"||a.status==="Closed"){
    actionsEl.innerHTML = `<span style="font-size:12px;color:var(--ink-3);">Case closed — no further stage changes.</span>`;
  } else if(a.status==="Awaiting Signature"){
    if(can('can_manage_contracts')){
      actionsEl.innerHTML = `
        <button class="btn small gold" onclick="advanceDirect('${a.id}','Contract Signed','Contract Manager (e-signature platform)')">✓ Mark fully signed</button>
        <button class="btn small secondary" onclick="sendReminder('${a.id}')">Send reminder / escalate</button>
        <button class="btn small secondary" onclick="sendSigningInvite('${a.id}')">✉ Send signing invite</button>
        <div style="width:100%; font-size:11px; color:var(--ink-3); margin-top:2px;">Matches the flow's "Fully signed?" check — No loops back with a reminder, it doesn't regret the case.</div>`;
    } else {
      actionsEl.innerHTML = `<span style="font-size:12px;color:var(--ink-3);">You don't have permission to manage contracts.</span>`;
    }
  } else if(GATE_STAGES.includes(a.status)){
    const gatePerm = a.status==="Recommendation Recorded" ? 'can_evaluate_approve'
      : a.status==="Contract Being Drafted" ? 'can_manage_contracts'
      : 'can_screen_validate';
    const hasRegret = !!REGRET_POOLS[a.status];
    if(can(gatePerm)){
      actionsEl.innerHTML = `
        <button class="btn small gold" onclick="requestApproval('${a.id}')">Record decision — ${GATE_QUESTION[a.status]}</button>
        <div style="width:100%; font-size:11px; color:var(--ink-3); margin-top:2px;">This is a human decision point in the flow${hasRegret? ' — it can end the case as unsuccessful' : ''}.</div>`;
    } else {
      actionsEl.innerHTML = `<span style="font-size:12px;color:var(--ink-3);">You don't have permission to record this decision.</span>`;
    }
  } else if(nextStage){
    if(canAny){
      actionsEl.innerHTML = `
        <button class="btn small gold" onclick="advanceDirect('${a.id}','${nextStage}','System (automated)')">Advance to: ${nextStage}</button>
        <div style="width:100%; font-size:11px; color:var(--ink-3); margin-top:2px;">Automated step in the flow — no sign-off required.</div>`;
    } else {
      actionsEl.innerHTML = `<span style="font-size:12px;color:var(--ink-3);">You have read-only access.</span>`;
    }
  } else {
    actionsEl.innerHTML = `<span style="font-size:12px;color:var(--ink-3);">End of pipeline.</span>`;
  }

  document.getElementById('ad-timeline').innerHTML = a.timeline.slice().reverse().map(t=>`
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-body">
      <div class="action">${t.action}</div><div class="meta">${t.date} · ${t.actor}</div>
    </div></div>`).join('');

}

/* Normalizes a document's comment history — handles the old single-string
   shape (reviewerComment) from before this was a thread, so nothing already
   saved is lost. */
function docCommentsOf(d){
  if(d.reviewerComments && d.reviewerComments.length) return d.reviewerComments;
  if(d.reviewerComment) return [{text:d.reviewerComment, author:'Unknown', date:''}];
  return [];
}

/* Appends a new reviewer comment on a document — never overwrites prior ones. */
async function addDocComment(applicantId, docId){
  const a = applicants.find(x=>x.id===applicantId);
  if(!a) return;
  const doc = (a.documents||[]).find(d=>d.docId===docId);
  if(!doc) return;
  const inputEl = document.getElementById('new-comment-'+docId);
  const text = inputEl.value.trim();
  if(!text) return;

  const { data: { session } } = await sb.auth.getSession();
  const author = (session && session.user && session.user.email) || 'Reviewer';

  doc.reviewerComments = docCommentsOf(doc);
  doc.reviewerComments.push({text, author, date: nowStamp()});
  delete doc.reviewerComment;

  sb.from('rfq_applicants').update({documents:a.documents}).eq('id', a.id)
    .then(({error})=>{
      if(error){ console.error('doc comment persist failed', error); toast("Not saved to database", "Comment saved locally but failed to save — check the console."); }
      else { toast("Comment added", `Note added to ${doc.name}.`); }
    });

  openApplicant(applicantId);
}

/* Persists an applicant's current status/reason plus one new timeline row. */
function persistApplicantChange(a, timelineEntry, extraFields){
  const payload = Object.assign({status:a.status, reason:a.reason||null}, extraFields||{});
  const updatePromise = sb.from('rfq_applicants').update(payload).eq('id', a.id)
    .then(({error})=>{ if(error){ console.error('applicant status persist failed', error); toast("Not saved to database", `${a.business}'s status changed locally but failed to save — check the console.`); } return {error}; });
  sb.from('rfq_timeline_events').insert({applicant_id:a.id, event_date:timelineEntry.date, action:timelineEntry.action, actor:timelineEntry.actor, note:timelineEntry.note||null})
    .then(({error})=>{ if(error) console.error('timeline persist failed', error); });
  return updatePromise;
}

/* Automated / system-step advance — no decision modal, matches the diagram's
   blue/green (automated & process) coloured steps. */
function advanceDirect(applicantId, nextStage, actor){
  const a = applicants.find(x=>x.id===applicantId);
  if(!a) return;
  a.status = nextStage;
  const entry = {date:today(), action:`Advanced to ${nextStage}`, actor: actor||"System (automated)"};
  a.timeline.push(entry);
  persistApplicantChange(a, entry);
  logAudit(`${a.business} advanced to ${nextStage}`, actor||"System", "automated step");
  toast("Advanced", `${a.business} is now ${nextStage}.`);
  if(nextStage === 'Contract Being Drafted') triggerEmail('contract_drafted', a.id);
  if(nextStage === 'Invited to Submit Proposal') triggerEmail('invitation_to_submit', a.id);
  if(nextStage === 'Proposal Submitted') triggerEmail('proposal_received', a.id);
  if(nextStage === 'Contract Signed') triggerEmail('contract_signed', a.id);
  if(nextStage === 'Onboarding') triggerEmail('onboarding', a.id);
  renderApplicants(); renderApprovals(); renderDashboard();
  if(document.getElementById('applicant-drawer').classList.contains('active')) openApplicant(applicantId);
}

/* "Fully signed?" No branch — reminder/escalation, does not regret the case. */
function sendReminder(applicantId){
  const a = applicants.find(x=>x.id===applicantId);
  if(!a) return;
  const entry = {date:today(), action:"Signature reminder sent — escalation triggered", actor:"System (automated)"};
  a.timeline.push(entry);
  persistApplicantChange(a, entry);
  logAudit(`Signature reminder sent to ${a.business}`, "System", "escalation triggered");
  triggerEmail('signature_reminder', a.id);
  toast("Reminder sent", `${a.business} has been reminded — case stays at Awaiting Signature.`);
  renderApplicants(); renderApprovals(); renderDashboard();
  if(document.getElementById('applicant-drawer').classList.contains('active')) openApplicant(applicantId);
}

/* Manual trigger — the person handling the contract confirms it's actually
   ready before the applicant is invited to sign, with an optional note. */
function sendSigningInvite(applicantId){
  const a = applicants.find(x=>x.id===applicantId);
  if(!a) return;
  const customMessage = prompt(`Optional note to include in the signing invite to ${a.business} (leave blank for none):`, '');
  if(customMessage === null) return; // cancelled
  const entry = {date:today(), action:"Signing invite sent to applicant", actor: (currentEmployee && currentEmployee.email) || "Contract Manager"};
  a.timeline.push(entry);
  persistApplicantChange(a, entry);
  logAudit(`Signing invite sent to ${a.business}`, (currentEmployee && currentEmployee.email) || "Contract Manager", customMessage || '');
  toast("Signing invite queued", `${a.business} will be sent a signing invite.`);
  triggerEmail('signing_invite', a.id, { customMessage: customMessage || undefined });
  if(document.getElementById('applicant-drawer').classList.contains('active')) openApplicant(applicantId);
}

let pendingAction = null;
function toggleConflictUI(){
  const noneChecked = document.getElementById('ap-coi-none').checked;
  const yesChecked = document.getElementById('ap-coi-yes').checked;
  document.getElementById('ap-coi-reason-wrap').style.display = yesChecked ? 'block' : 'none';
  document.getElementById('ap-coi-blocked-note').style.display = yesChecked ? 'block' : 'none';
  document.getElementById('ap-coi-prompt-note').style.display = (!noneChecked && !yesChecked) ? 'block' : 'none';
  document.getElementById('ap-normal-fields').style.display = yesChecked ? 'none' : 'block';
  document.getElementById('ap-normal-actions').style.display = yesChecked ? 'none' : 'inline';
  document.getElementById('ap-approve-btn').disabled = !noneChecked;
  document.getElementById('ap-reject-btn').disabled = !noneChecked;
  document.getElementById('ap-recuse-btn').style.display = yesChecked ? 'inline-block' : 'none';
}
function resetConflictUI(){
  document.getElementById('ap-coi-none').checked = false;
  document.getElementById('ap-coi-yes').checked = false;
  document.getElementById('ap-coi-reason').value = '';
  document.getElementById('ap-comment').value = '';
  toggleConflictUI();
}
function requestApproval(applicantId){
  const a = applicants.find(x=>x.id===applicantId);
  const nextStage = KANBAN_STAGES[KANBAN_STAGES.indexOf(a.status)+1];
  const hasRegret = !!REGRET_POOLS[a.status];
  pendingAction = {type:'applicant', applicantId, nextStage, hasRegret};
  document.getElementById('ap-title').textContent = `Record decision — ${GATE_QUESTION[a.status]}`;
  document.getElementById('ap-context').textContent = `${a.business} (${a.id}) is at "${a.status}". Approving moves the case to "${nextStage}".${hasRegret? ' Rejecting marks it Unsuccessful and queues the regret email.' : ''} This requires an authorised sign-off.`;
  document.getElementById('ap-approve-btn').style.display = 'inline-block';
  document.getElementById('ap-approve-btn').textContent = `Approve → ${nextStage}`;
  document.getElementById('ap-reject-btn').style.display = hasRegret ? 'inline-block' : 'none';
  document.getElementById('ap-reject-btn').textContent = 'Regret / Unsuccessful';
  const isInvitation = nextStage === 'Invited to Submit Proposal';
  document.getElementById('ap-deadline-wrap').style.display = isInvitation ? 'block' : 'none';
  document.getElementById('ap-deadline').value = '';
  resetConflictUI();
  document.getElementById('modal-approval').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}

/* Publishing a Draft RFQ — this is what makes it appear in the public portal. */
function requestPublishRfq(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  pendingAction = {type:'rfq_publish', rfqId};
  document.getElementById('ap-title').textContent = 'Publish RFQ';
  document.getElementById('ap-context').textContent = `"${r.title}" (${r.id}) will move from Draft to Open for Applications and become visible on the public portal. This requires an authorised sign-off.`;
  document.getElementById('ap-approve-btn').style.display = 'inline-block';
  document.getElementById('ap-approve-btn').textContent = 'Approve → Publish';
  document.getElementById('ap-reject-btn').style.display = 'none';
  resetConflictUI();
  document.getElementById('modal-approval').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function submitRecusal(){
  const name = document.getElementById('ap-name').value.trim() || "Unnamed reviewer";
  const role = document.getElementById('ap-role').value.trim() || "Authorised reviewer";
  const reason = document.getElementById('ap-coi-reason').value.trim();
  if(!reason){ toast("Details required", "Please describe the nature of the conflict before logging your recusal."); return; }

  let subject = 'this case';
  if(pendingAction && pendingAction.type==='applicant'){
    const a = applicants.find(x=>x.id===pendingAction.applicantId);
    if(a) subject = `${a.business} (${a.id})`;
  } else if(pendingAction && pendingAction.type==='rfq_publish'){
    const r = rfqs.find(x=>x.id===pendingAction.rfqId);
    if(r) subject = `${r.id} — ${r.title}`;
  }
  logAudit(`${name} declared a conflict of interest and stepped back from ${subject}`, `${name} · ${role}`, reason);
  toast("Recusal logged", "No decision was recorded. Please hand this case to a colleague without a conflict.");
  closeAll();
  renderAudit();
}

let rfqStatusRequestId = null;
function openRfqStatusRequest(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  if(!r) return;
  rfqStatusRequestId = rfqId;
  document.getElementById('rsr-context').textContent = `${r.id} — ${r.title} (currently ${r.status})`;
  document.getElementById('rsr-target').value = 'Paused';
  document.getElementById('rsr-reason').value = '';
  document.getElementById('modal-rfq-status-request').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function submitRfqStatusRequest(){
  const r = rfqs.find(x=>x.id===rfqStatusRequestId);
  if(!r) return;
  const targetStatus = document.getElementById('rsr-target').value;
  const reason = document.getElementById('rsr-reason').value.trim();
  if(!reason){ toast("Reason required", "Please explain why this status change is being requested."); return; }
  r.pendingStatusChange = { targetStatus, reason, requestedBy: (currentEmployee&&currentEmployee.email)||'Unknown', requestedAt: new Date().toISOString() };
  logAudit(`${r.id} — status change requested: ${targetStatus}`, (currentEmployee&&currentEmployee.email)||'Unknown', reason);
  closeAll();
  renderRfqs();
  toast("Submitted for review", `${r.id}'s status change now needs approval before it takes effect.`);
  if(r.assignedApproverId) notifyAssignedApprover(r, `A status change to "${targetStatus}" has been requested on this RFQ and needs your approval. Reason given: ${reason}`);
  sb.from('rfq_rfqs').update({pending_status_change:r.pendingStatusChange}).eq('id', r.id)
    .then(({error})=>{ if(error){ console.error('rfq status request persist failed', error); toast("Not saved to database", "The request shows locally but failed to save — check the console."); } });
}

let rfqStatusReviewId = null;
function openRfqStatusReview(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  if(!r || !r.pendingStatusChange) return;
  rfqStatusReviewId = rfqId;
  const p = r.pendingStatusChange;
  document.getElementById('rsv-context').innerHTML = `<strong>${r.id} — ${r.title}</strong><br>Current status: ${r.status} → Requested: <strong>${escapeAttr(p.targetStatus)}</strong><br>Requested by ${escapeAttr(p.requestedBy)}<br><br>Reason: ${escapeAttr(p.reason)}`;
  document.getElementById('rsv-name').value = '';
  document.getElementById('rsv-role').value = '';
  document.getElementById('rsv-comment').value = '';
  document.getElementById('modal-rfq-status-review').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function resolveRfqStatusRequest(isApprove){
  const r = rfqs.find(x=>x.id===rfqStatusReviewId);
  if(!r || !r.pendingStatusChange) return;
  const name = document.getElementById('rsv-name').value.trim() || "Unnamed reviewer";
  const role = document.getElementById('rsv-role').value.trim() || "Authorised reviewer";
  const comment = document.getElementById('rsv-comment').value.trim();
  const p = r.pendingStatusChange;

  if(isApprove){
    r.status = p.targetStatus;
    r.pendingStatusChange = null;
    logAudit(`${r.id} status changed to ${p.targetStatus} — approved`, `${name} · ${role}`, comment||p.reason);
    toast("Status change approved", `${r.id} is now ${p.targetStatus}.`);
    sb.from('rfq_rfqs').update({status:r.status, pending_status_change:null}).eq('id', r.id)
      .then(({error})=>{ if(error){ console.error('rfq status approve persist failed', error); toast("Not saved to database", "The change shows locally but failed to save — check the console."); } });
  } else {
    r.pendingStatusChange = null;
    logAudit(`${r.id} status change request rejected (would have been ${p.targetStatus})`, `${name} · ${role}`, comment);
    toast("Request rejected", `${r.id} stays at ${r.status}.`);
    sb.from('rfq_rfqs').update({pending_status_change:null}).eq('id', r.id)
      .then(({error})=>{ if(error){ console.error('rfq status reject persist failed', error); toast("Not saved to database", "The change shows locally but failed to save — check the console."); } });
  }
  closeAll();
  renderRfqs();
  renderDashboard();
}

let extendingRfqId = null;
function openExtendDate(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  if(!r) return;
  extendingRfqId = rfqId;
  document.getElementById('ext-context').textContent = `${r.id} — ${r.title} — currently closes ${formatCloseDisplay(r.close)}`;
  document.getElementById('ext-new-date').value = '';
  document.getElementById('ext-new-date').min = toDatetimeLocalValue(r.close);
  document.getElementById('ext-reason').value = '';
  document.getElementById('modal-extend-date').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function submitExtendDate(){
  const r = rfqs.find(x=>x.id===extendingRfqId);
  if(!r) return;
  const newDateRaw = document.getElementById('ext-new-date').value;
  const reason = document.getElementById('ext-reason').value.trim();
  if(!newDateRaw){ toast("New date required", "Please choose the new closing date and time."); return; }
  const newDate = fromDatetimeLocalValue(newDateRaw);
  if(!newDate || new Date(newDate) <= new Date(r.close)){ toast("Date must be later", `The new closing date and time must be after the current one (${formatCloseDisplay(r.close)}).`); return; }
  if(!reason){ toast("Reason required", "Please explain why the closing date is being extended — this is shown publicly."); return; }

  const notice = { previousDate:r.close, newDate, reason, extendedBy:(currentEmployee&&currentEmployee.email)||'Unknown', extendedAt:new Date().toISOString() };
  const previousClose = r.close;
  r.extensionNotices = [...(r.extensionNotices||[]), notice];
  r.close = newDate;
  logAudit(`${r.id} closing date extended from ${formatCloseDisplay(previousClose)} to ${formatCloseDisplay(newDate)}`, (currentEmployee&&currentEmployee.email)||'Unknown', reason);
  closeAll();
  renderRfqs();
  toast("Closing date extended", `${r.id} now closes ${formatCloseDisplay(newDate)}. A public notice has been published.`);
  sb.from('rfq_rfqs').update({close_date:r.close, extension_notices:r.extensionNotices}).eq('id', r.id)
    .then(({error})=>{ if(error){ console.error('extend date persist failed', error); toast("Not saved to database", "The change shows locally but failed to save — check the console."); } });
}

/* ============================================================
   CLARIFICATIONS (Request for Clarification / Q&A)
   ============================================================ */
let clarifications = [];
function triggerClarificationEmail(trigger, payload){
  sb.functions.invoke('send-notification-email', {
    body: { trigger, triggeredBy: (currentEmployee && currentEmployee.email) || 'system', ...payload }
  }).then(({data, error})=>{
    if(error || (data && data.error)) console.error('clarification email trigger failed', trigger, error || (data && data.error));
  }).catch(e=>console.error('clarification email trigger failed', trigger, e));
}
async function renderClarifications(){
  const filterSel = document.getElementById('clar-filter-rfq');
  if(!filterSel) return;
  const curFilter = filterSel.value || 'all';
  filterSel.innerHTML = `<option value="all">All RFQs</option>` + rfqs.map(r=>`<option value="${r.id}">${r.id} — ${r.title}</option>`).join('');
  if(rfqs.some(r=>r.id===curFilter)) filterSel.value = curFilter;

  const { data, error } = await sb.from('rfq_clarifications').select('*').order('created_at', {ascending:false});
  if(error){ console.error('clarifications load failed', error); return; }
  clarifications = data || [];

  const filter = filterSel.value || 'all';
  const list = clarifications.filter(c=> filter==='all' || c.rfq_id===filter);
  const table = document.getElementById('clar-table');
  table.innerHTML = `
    <tr><th>RFQ</th><th>Question</th><th>From</th><th>Status</th><th></th></tr>
    ${list.map((c,i)=>`<tr>
      <td class="ref mono">${escapeAttr(c.rfq_id)}</td>
      <td style="max-width:320px;">${escapeAttr(c.question)}</td>
      <td>${escapeAttr(c.asked_by_name)}${c.asked_by_business? ' · '+escapeAttr(c.asked_by_business):''}</td>
      <td>${c.status==='answered'
          ? `<span class="badge ${c.visibility==='public'?'sage':'ink'}">${c.visibility==='public'?'Published':'Answered privately'}</span>`
          : `<span class="badge gold">Pending</span>`}</td>
      <td>${c.status==='pending' && can('can_manage_rfqs') ? `<button class="btn small gold" onclick="openClarificationAnswer(${c.id})">Answer</button>` : ''}</td>
    </tr>`).join('') || `<tr><td colspan="5" style="text-align:center; color:var(--ink-3); padding:20px;">No clarification requests yet.</td></tr>`}
  `;
}
let clarAnswerId = null;
function openClarificationAnswer(id){
  const c = clarifications.find(x=>x.id===id);
  if(!c) return;
  clarAnswerId = id;
  document.getElementById('clar-answer-context').innerHTML = `<strong>${escapeAttr(c.rfq_id)}</strong><br>From ${escapeAttr(c.asked_by_name)}${c.asked_by_business? ' ('+escapeAttr(c.asked_by_business)+')':''} — ${escapeAttr(c.asked_by_email)}<br><br>${escapeAttr(c.question)}`;
  document.getElementById('clar-answer-text').value = '';
  document.getElementById('clar-vis-private').checked = true;
  document.getElementById('modal-clarification-answer').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
async function submitClarificationAnswer(){
  const c = clarifications.find(x=>x.id===clarAnswerId);
  if(!c) return;
  const answer = document.getElementById('clar-answer-text').value.trim();
  if(!answer){ toast("Answer required", "Please write a response before sending."); return; }
  const visibility = document.getElementById('clar-vis-public').checked ? 'public' : 'private';

  const { error } = await sb.from('rfq_clarifications').update({
    answer, status:'answered', visibility,
    answered_by: (currentEmployee&&currentEmployee.email)||'Unknown',
    answered_at: new Date().toISOString(),
  }).eq('id', c.id);
  if(error){ console.error('clarification answer persist failed', error); toast("Not saved", "Could not save this answer — check the console."); return; }

  logAudit(`Clarification answered on ${c.rfq_id}${visibility==='public'?' — published for all bidders':' — replied privately'}`, (currentEmployee&&currentEmployee.email)||'Unknown', answer.slice(0,200));
  closeAll();
  toast("Answer sent", visibility==='public' ? "Published — visible to all bidders, and existing applicants are being notified." : "Sent privately to the bidder who asked.");
  renderClarifications();

  triggerClarificationEmail('clarification_answered', { recipientEmail:c.asked_by_email, recipientName:c.asked_by_name, rfqId:c.rfq_id, question:c.question, answer });

  if(visibility==='public'){
    const rfqApplicants = applicants.filter(a=>a.rfq===c.rfq_id);
    rfqApplicants.forEach(a=>triggerEmail('clarification_published', a.id, { question:c.question, answer }));
  }
}

function generateSecureToken(){
  if(window.crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g,'');
  return Array.from({length:32}, ()=>Math.floor(Math.random()*16).toString(16)).join('');
}

async function submitApproval(isApprove){
  if(!document.getElementById('ap-coi-none').checked){ toast("Can't proceed", "Please confirm you have no conflict of interest before recording this decision."); return; }
  const name = document.getElementById('ap-name').value.trim() || "Unnamed reviewer";
  const role = document.getElementById('ap-role').value.trim() || "Authorised reviewer";
  const comment = document.getElementById('ap-comment').value.trim();

  if(pendingAction && pendingAction.type==='rfq_publish'){
    const r = rfqs.find(x=>x.id===pendingAction.rfqId);
    if(isApprove){
      r.status = "Open for Applications";
      logAudit(`${r.id} published — now open for applications`, `${name} · ${role}`, comment);
      toast("RFQ published", `${r.title} is now visible on the public portal.`);
      sb.from('rfq_rfqs').update({status:r.status}).eq('id', r.id)
        .then(({error})=>{ if(error){ console.error('rfq publish persist failed', error); toast("Not saved to database", `${r.id} published locally but failed to save — check the console.`); } });
    }
    closeAll();
    renderRfqs();
    renderDashboard();
    return;
  }

  if(pendingAction){
    const a = applicants.find(x=>x.id===pendingAction.applicantId);
    if(isApprove){
      const isInvitation = pendingAction.nextStage === 'Invited to Submit Proposal';
      let deadlineIso = null;
      if(isInvitation){
        const deadlineRaw = document.getElementById('ap-deadline').value;
        if(!deadlineRaw){ toast("Deadline required", "Please set a proposal submission deadline before inviting this applicant."); return; }
        deadlineIso = fromDatetimeLocalValue(deadlineRaw);
        if(!deadlineIso || new Date(deadlineIso) <= new Date()){ toast("Deadline must be in the future", "Please choose a proposal submission deadline that hasn't already passed."); return; }
      }
      a.status = pendingAction.nextStage;
      const entry = {date:today(), action:`Advanced to ${pendingAction.nextStage}`, actor:`${name} (${role})`};
      a.timeline.push(entry);
      const extraFields = {};
      if(isInvitation){
        a.proposalToken = generateSecureToken();
        a.proposalDeadline = deadlineIso;
        extraFields.proposal_token = a.proposalToken;
        extraFields.proposal_deadline = a.proposalDeadline;
      }
      await persistApplicantChange(a, entry, extraFields);
      logAudit(`${a.business} advanced to ${pendingAction.nextStage}`, `${name} · ${role}`, comment);
      toast("Decision recorded", `${a.business} is now ${pendingAction.nextStage}.`);
      if(pendingAction.nextStage === 'Preferred Bidder') triggerEmail('preferred_bidder', a.id);
      if(isInvitation) triggerEmail('invitation_to_submit', a.id);
    } else {
      const originStage = a.status;
      if(!comment){ toast("Reason required", "Please explain why this application is being marked unsuccessful — this is shared with the applicant by email."); return; }
      a.reason = comment;
      a.status = "Unsuccessful";
      const entry = {date:today(), action:`Marked unsuccessful — ${a.reason}`, actor:`${name} (${role})`};
      a.timeline.push(entry);
      persistApplicantChange(a, entry);
      logAudit(`${a.business} marked unsuccessful — ${a.reason}`, `${name} · ${role}`, comment);
      toast("Regret recorded", `${a.business} moved to Unsuccessful. Regret email queued for release.`);
      const regretTrigger = { "Under Screening":"screening_rejected", "Under Validation":"validation_rejected", "Recommendation Recorded":"approval_rejected" }[originStage] || "rejected";
      triggerEmail(regretTrigger, a.id);
    }
  }
  closeAll();
  renderApplicants();
  renderApprovals();
  renderDashboard();
}

/* ============================================================
   APPROVALS (pending gates)
   ============================================================ */
function pendingApprovals(){
  // The 4 human-decision points from the flow diagram, plus signature follow-up.
  const gateStatuses = {
    "Under Screening":"Screening decision — eligible & complete?",
    "Under Validation":"Validation decision — approved to proceed?",
    "Recommendation Recorded":"Approval decision — delegated authority",
    "Contract Being Drafted":"Contract issue authorisation",
    "Awaiting Signature":"Signature outstanding — reminder / escalation",
  };
  return applicants.filter(a=>gateStatuses[a.status]).map(a=>({applicant:a, gate:gateStatuses[a.status]}));
}
function approvalCardHtml(p){
  const a = p.applicant;
  return `<div class="approval-card">
    <div class="gate">${p.gate}</div>
    <div class="subject">${a.business}</div>
    <div class="meta">${a.id} · ${rfqTitle(a.rfq)} · currently ${a.status}</div>
    <div class="actions">
      <button class="btn small gold" onclick="openApplicant('${a.id}')">Review case</button>
    </div>
  </div>`;
}
function renderApprovals(){
  const list = pendingApprovals();
  document.getElementById('approvals-list').innerHTML = list.length
    ? list.map(approvalCardHtml).join('')
    : `<div class="empty-state">Nothing is waiting on a decision-maker right now.</div>`;
}

async function renderRankings(){
  const filterSel = document.getElementById('rank-filter-rfq');
  if(!filterSel) return;
  const curFilter = filterSel.value || 'all';
  filterSel.innerHTML = `<option value="all">All RFQs</option>` + rfqs.map(r=>`<option value="${r.id}">${r.id} — ${r.title}</option>`).join('');
  if(rfqs.some(r=>r.id===curFilter)) filterSel.value = curFilter;
  const filter = filterSel.value || 'all';
  const sortBy = (document.getElementById('rank-sort-by') || {}).value || 'score';

  const { data, error } = await sb.from('rfq_evaluations').select('*');
  const container = document.getElementById('rank-table');
  if(error){ console.error('rankings load failed', error); container.innerHTML = ''; return; }

  const rows = (data||[]).map(ev=>{
    const a = applicants.find(x=>x.id===ev.applicant_id);
    return a ? { ev, a } : null;
  }).filter(Boolean).filter(r => filter==='all' || r.a.rfq===filter);

  // Group by RFQ, rank within each group — comparing across different tenders wouldn't mean anything.
  const byRfq = {};
  rows.forEach(r=>{ (byRfq[r.a.rfq] = byRfq[r.a.rfq]||[]).push(r); });
  const rfqIds = Object.keys(byRfq).sort();

  if(!rfqIds.length){
    container.innerHTML = `<div style="text-align:center; color:var(--ink-3); padding:20px;">No evaluations recorded yet${filter!=='all'? ' for this RFQ':''}.</div>`;
    return;
  }

  container.innerHTML = rfqIds.map(rid=>{
    const r0 = rfqs.find(x=>x.id===rid);
    const group = byRfq[rid].sort((x,y)=>{
      if(sortBy==='price'){
        const px = x.a.proposal ? x.a.proposal.totalPrice : Infinity;
        const py = y.a.proposal ? y.a.proposal.totalPrice : Infinity;
        return px - py; // lowest price first
      }
      return y.ev.total_score - x.ev.total_score; // highest score first
    });
    return `
      <div style="padding:14px 16px 4px 16px; border-top:1px solid var(--line); background:var(--paper-2);">
        <div style="font-weight:600; font-size:13.5px;">${escapeAttr(rid)} — ${escapeAttr(r0 ? r0.title : '')}</div>
        <div style="font-size:11.5px; color:var(--ink-3); margin-top:2px;">${group.length} evaluated bidder${group.length===1?'':'s'}${r0 ? ' · '+escapeAttr(r0.status) : ''}</div>
      </div>
      <table>
        <tr><th>Rank</th><th>Applicant</th><th>Status</th><th>Price</th><th>Score</th><th></th><th></th></tr>
        ${group.map((r,i)=>{
          const isPreferredAlready = KANBAN_STAGES.indexOf(r.a.status) >= KANBAN_STAGES.indexOf('Preferred Bidder');
          const canSelect = r.a.status === 'Recommendation Recorded' && can('can_evaluate_approve');
          return `<tr class="rowlink" onclick="openApplicant('${r.a.id}')">
            <td class="mono">${i===0? '🏆 1' : (i+1)}</td>
            <td>${escapeAttr(r.a.business)}</td>
            <td><span class="badge ${appBadgeClass(r.a.status)}">${r.a.status}</span></td>
            <td class="mono">${r.a.proposal ? escapeAttr(String(r.a.proposal.totalPrice)) : '—'}</td>
            <td class="mono" style="font-weight:${i===0?'600':'400'};">${r.ev.total_score} / 100</td>
            <td>${r.ev.conflict_declared? `<span class="badge rust">Conflict declared</span>` : ''}</td>
            <td>${isPreferredAlready ? `<span style="font-size:11px; color:var(--sage);">✓ Selected</span>` : canSelect ? `<button class="btn small gold" onclick="event.stopPropagation(); requestApproval('${r.a.id}')">Select as Preferred Bidder</button>` : ''}</td>
          </tr>`;
        }).join('')}
      </table>
    `;
  }).join('');
}

/* ============================================================
   COMMUNICATIONS
   ============================================================ */
function renderComms(){
  document.getElementById('comms-list').innerHTML = COMMS.map(c=>`
    <div class="comm-card">
      <div class="trig">${c.trig}</div>
      <div class="subj">${c.subj}</div>
      <div class="bodytext">"${c.body}"</div>
    </div>`).join('');
  renderEmailLog();
}

const EMAIL_STATUS_BADGE = {
  sent: 'sage', skipped_not_configured: 'gold', failed: 'rust',
};
const EMAIL_STATUS_LABEL = {
  sent: 'Sent', skipped_not_configured: 'Not sent — Resend not configured yet', failed: 'Failed',
};
let emailLogRows = [];
async function renderEmailLog(){
  const table = document.getElementById('email-log-table');
  const statusEl = document.getElementById('email-log-status');
  if(!table) return;
  const { data, error } = await sb.from('rfq_email_log').select('*').order('created_at', {ascending:false}).limit(50);
  if(error){ console.error('email log load failed', error); table.innerHTML = ''; return; }
  emailLogRows = data || [];
  if(statusEl){
    const configured = emailLogRows.some(r=>r.status==='sent');
    statusEl.textContent = configured
      ? 'Every triggered email is logged here — real sending is active.'
      : "Every triggered email is logged here. Resend isn't connected yet, so nothing is actually delivered — this shows exactly what would be sent once it is.";
  }
  table.innerHTML = `
    <tr><th>When</th><th>Trigger</th><th>To</th><th>Subject</th><th>Status</th></tr>
    ${emailLogRows.map((r,i)=>`<tr class="rowlink" onclick="showEmailLogDetail(${i})">
      <td class="mono" style="font-size:11px;">${(r.created_at||'').replace('T',' ').slice(0,16)}</td>
      <td>${escapeAttr(r.trigger_type)}</td>
      <td>${escapeAttr(r.recipient_email||'—')}</td>
      <td>${escapeAttr(r.subject||'—')}</td>
      <td><span class="badge ${EMAIL_STATUS_BADGE[r.status]||'ink'}">${EMAIL_STATUS_LABEL[r.status]||r.status}</span></td>
    </tr>`).join('') || `<tr><td colspan="5" style="text-align:center; color:var(--ink-3); padding:20px;">No emails triggered yet.</td></tr>`}
  `;
}
function showEmailLogDetail(i){
  const r = emailLogRows[i];
  if(!r) return;
  const lines = [
    `To: ${r.recipient_email || '(none on file)'}`,
    `Subject: ${r.subject || ''}`,
    `Status: ${EMAIL_STATUS_LABEL[r.status] || r.status}${r.error_message ? ' — '+r.error_message : ''}`,
    '',
    r.body || '',
  ];
  alert(lines.join('\n'));
}

/* ============================================================
   AUDIT
   ============================================================ */
function renderAudit(){
  const el = document.getElementById('audit-list');
  if(!el) return;
  el.innerHTML = audit.map(e=>`
    <div class="audit-row"><div class="ts">${e.ts}</div>
      <div><div>${e.action}</div><div class="who">${e.who}${e.note? ' — "'+e.note+'"':''}</div></div>
    </div>`).join('');
}
function exportAudit(){
  const text = audit.map(e=>`${e.ts}\t${e.who}\t${e.action}${e.note? ' — '+e.note:''}`).join('\n');
  const blob = new Blob([text], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='rfq-hub-audit-trail.txt'; a.click();
  toast("Exported", "Audit trail downloaded as a structured text file.");
}

/* ============================================================
   PUBLIC PORTAL
   ============================================================ */
async function renderPublic(){
  const now = new Date();
  const GRACE_DAYS = 20;
  const visible = rfqs.filter(r=>{
    if(!(r.status==="Open for Applications"||r.status==="Published")) return false;
    if(!r.close) return true;
    const closeDate = new Date(r.close);
    const graceDeadline = new Date(closeDate.getTime() + GRACE_DAYS*86400000);
    return now <= graceDeadline;
  });
  // Tender documents live in a private bucket now — fetch a short-lived link
  // for each one before rendering, rather than trusting a stored permanent URL.
  await Promise.all(visible.flatMap(r => (r.attachments||[]).map(async f=>{
    if(!f.path) return;
    const { data, error } = await sb.storage.from('rfq-documents').createSignedUrl(f.path, 600);
    f._signedUrl = error ? null : data.signedUrl;
  })));
  // Published Q&A — visible to everyone, no login, per RFQ.
  const { data: clarData } = await sb.from('rfq_clarifications').select('rfq_id, question, answer').eq('status','answered').eq('visibility','public');
  const clarByRfq = {};
  (clarData||[]).forEach(c=>{ (clarByRfq[c.rfq_id] = clarByRfq[c.rfq_id]||[]).push(c); });

  const stillOpen = visible.filter(r => !(r.close && new Date(r.close) < now))
    .sort((a,b) => new Date(b.open||0) - new Date(a.open||0)); // newest posted first
  const closedRecent = visible.filter(r => r.close && new Date(r.close) < now)
    .sort((a,b) => new Date(b.close) - new Date(a.close)); // most recently closed first

  function renderCard(r){
    const isClosed = r.close && new Date(r.close) < now;
    return `
    <div class="prfq-card">
      <h3>${r.title}${isClosed ? ' <span class="badge" style="background:var(--paper-2); color:var(--ink-3); font-weight:600;">Closed</span>' : ''}</h3>
      <div class="meta">${r.id} · ${r.category} · Closes ${formatCloseDisplay(r.close)}</div>
      ${isClosed ? `<div style="font-size:12px; color:var(--ink-3); margin:6px 0 10px 0;">This tender has closed and is no longer accepting applications. Questions are still welcome while evaluation is under way.</div>` : ''}
      ${(r.extensionNotices&&r.extensionNotices.length) ? `
        <div style="background:#FCF3DE; border:1px solid var(--gold); border-radius:var(--radius); padding:8px 10px; margin:8px 0 12px 0; font-size:12.5px; color:var(--ink);">
          ${r.extensionNotices.map(n=>`<div style="margin-bottom:4px;"><strong>⏱ Closing date extended</strong> from ${formatCloseDisplay(n.previousDate)} to ${formatCloseDisplay(n.newDate)}. Reason: ${escapeAttr(n.reason)}</div>`).join('')}
        </div>` : ''}
      <div class="desc">${r.desc}</div>
      ${(r.attachments&&r.attachments.length) ? `
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-3); margin-bottom:5px;">Tender documents</div>
        <ul class="doclist-public" style="margin-bottom:14px;">
          ${r.attachments.map(f=>f._signedUrl ? `<li><span class="dot"></span><a href="${f._signedUrl}" target="_blank" rel="noopener" download>${escapeAttr(f.name)}</a></li>` : '').join('')}
        </ul>` : ''}
      ${(clarByRfq[r.id]&&clarByRfq[r.id].length) ? `
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-3); margin-bottom:5px;">Published questions &amp; answers</div>
        <div style="margin-bottom:14px;">
          ${clarByRfq[r.id].map(c=>`
            <div style="background:var(--paper-2); border-radius:var(--radius); padding:8px 10px; margin-bottom:6px;">
              <div style="font-weight:600; font-size:12.5px;">Q: ${escapeAttr(c.question)}</div>
              <div style="font-size:12.5px; margin-top:3px;">A: ${escapeAttr(c.answer)}</div>
            </div>`).join('')}
        </div>` : ''}
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${isClosed ? '' : `<button class="btn gold" onclick="handleApplyClick('${r.id}')">Apply now</button>`}
        <button class="btn secondary" onclick="openAskQuestion('${r.id}')">❓ Ask a question</button>
        <button class="btn secondary" onclick="downloadRfqInfo('${r.id}')">⬇ ${(r.attachments&&r.attachments.length) ? (r.attachments.length>1?'Download tender documents':'Download tender document') : 'Download tender information'}</button>
      </div>
    </div>`;
  }

  if(!visible.length){
    document.getElementById('public-rfq-list').innerHTML = `<div class="empty-state">No RFQs are currently open for applications.</div>`;
    return;
  }
  document.getElementById('public-rfq-list').innerHTML = `
    ${stillOpen.length ? `
      <h2 class="public-section-heading">Open Tenders</h2>
      ${stillOpen.map(renderCard).join('')}
    ` : ''}
    ${closedRecent.length ? `
      <h2 class="public-section-heading" style="margin-top:28px;">Recently Closed</h2>
      ${closedRecent.map(renderCard).join('')}
    ` : ''}
  `;
}
let askQuestionRfqId = null;
function openAskQuestion(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  if(!r) return;
  askQuestionRfqId = rfqId;
  document.getElementById('aq-context').textContent = `Asking about ${r.id} — ${r.title}`;
  document.getElementById('aq-business').value = '';
  document.getElementById('aq-name').value = '';
  document.getElementById('aq-email').value = '';
  document.getElementById('aq-question').value = '';
  document.getElementById('modal-ask-question').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function submitAskQuestion(){
  const business = document.getElementById('aq-business').value.trim();
  const name = document.getElementById('aq-name').value.trim();
  const email = document.getElementById('aq-email').value.trim();
  const question = document.getElementById('aq-question').value.trim();
  if(!name || !email || !question){ toast("Missing details", "Name, email, and your question are all required."); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ toast("Check the email address", "That doesn't look like a valid email address."); return; }
  closeAll();
  toast("Question sent", "The procurement team will respond to you by email.");
  sb.functions.invoke('submit-clarification', { body: { rfqId: askQuestionRfqId, question, name, email, business: business||null } })
    .then(async ({data, error})=>{
      if(error || (data && data.error)){
        let message = (data && data.error) || (error && error.message);
        if(error && error.context && typeof error.context.json === 'function'){
          try{ const b = await error.context.json(); message = b.error || message; } catch(e2){}
        }
        console.error('ask question failed', message);
        toast("Couldn't send your question", message || "Please try again.", 20000);
      }
    });
}
async function downloadRfqInfo(rfqId){
  const r = rfqs.find(x=>x.id===rfqId);
  if(!r) return;

  if(r.attachments && r.attachments.length){
    // Real tender documents exist — fetch a fresh signed link right now and download those.
    for(const f of r.attachments){
      if(!f.path) continue;
      const { data, error } = await sb.storage.from('rfq-documents').createSignedUrl(f.path, 600);
      if(error){ console.error('signed url failed', error); toast("Couldn't open document", `${f.name} — please try again.`); continue; }
      const a = document.createElement('a');
      a.href = data.signedUrl; a.download = f.name; a.target = '_blank'; a.rel = 'noopener';
      a.click();
    }
    return;
  }

  const lines = [
    `${r.title}`,
    `Reference: ${r.id}`,
    `Category: ${r.category}`,
    `Estimated budget: ${zar(r.budget)}`,
    `Opens: ${r.open}`,
    `Closes: ${formatCloseDisplay(r.close)}`,
    '',
    'Scope summary:',
    r.desc || '(none provided)',
    '',
    'Required documents to apply:',
    ...(r.requiredDocs&&r.requiredDocs.length ? r.requiredDocs.map(d=>`  - ${d.name}${d.mandatory? ' (mandatory)':' (optional)'}`) : ['  (none specified)']),
  ];
  const text = lines.join('\n');
  const blob = new Blob([text], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`${r.id}-tender-information.txt`; a.click();
}
let applyingTo = null;
let applyDocState = [];
function openApply(rfqId){
  applyingTo = rfqId;
  const rfq = rfqs.find(r=>r.id===rfqId);
  applyDocState = (rfq.requiredDocs||[]).map(d=>({docId:d.id, name:d.name, mandatory:d.mandatory, fileName:null, filePath:null, uploading:false}));
  document.getElementById('apply-context').textContent = `Applying to ${rfqId} — ${rfqTitle(rfqId)}`;
  document.getElementById('apply-business').value='';
  document.getElementById('apply-regno').value='';
  document.getElementById('apply-name').value='';
  document.getElementById('apply-position').value='';
  document.getElementById('apply-email').value='';
  document.getElementById('apply-phone').value='';
  document.getElementById('apply-comments').value='';
  renderApplyDocList();
  document.getElementById('modal-apply').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function renderApplyDocList(){
  const el = document.getElementById('apply-doclist');
  if(!applyDocState.length){ el.innerHTML = `<div style="font-size:12px; color:var(--ink-3);">No documents were specified for this RFQ.</div>`; return; }
  el.innerHTML = applyDocState.map((d,i)=>`
    <div class="upload-row ${d.filePath? 'done':''}">
      <div class="dname">${d.name}${d.mandatory? '<span class="req">Required</span>' : ''}</div>
      ${d.uploading
        ? `<span class="fname">Uploading…</span>`
        : d.filePath
          ? `<span class="fname">✓ ${d.fileName}</span>`
          : d.fileName
            ? `<span class="fname" style="color:var(--rust);">Upload failed — retry</span><label class="upload-btn">Choose file<input type="file" onchange="handleDocFile(${i}, this)"></label>`
            : `<label class="upload-btn">Choose file<input type="file" onchange="handleDocFile(${i}, this)"></label>`}
    </div>`).join('');
}
async function handleDocFile(i, input){
  const file = input.files && input.files[0];
  if(!file) return;
  applyDocState[i].fileName = file.name;
  applyDocState[i].filePath = null;
  applyDocState[i].uploading = true;
  renderApplyDocList();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${applyingTo}/${Date.now()}_${safeName}`;
  try{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    const { data, error } = await sb.functions.invoke('upload-document', { body: formData });
    if(error){
      let message = error.message;
      if(error.context && typeof error.context.json === 'function'){
        try{ const body = await error.context.json(); message = body.error || message; } catch(e2){ /* ignore */ }
      }
      throw new Error(message);
    }
    if(data && data.error) throw new Error(data.error);
    applyDocState[i].filePath = path;
  } catch(e){
    console.error('document upload failed', e);
    toast("Upload failed", `Could not upload ${file.name} — please try again.`);
  }
  applyDocState[i].uploading = false;
  renderApplyDocList();
}
async function submitApplication(){
  const business = document.getElementById('apply-business').value.trim();
  const regNo = document.getElementById('apply-regno').value.trim();
  const name = document.getElementById('apply-name').value.trim();
  const position = document.getElementById('apply-position').value.trim();
  const email = document.getElementById('apply-email').value.trim();
  const phone = document.getElementById('apply-phone').value.trim();
  const comments = document.getElementById('apply-comments').value.trim();

  const targetRfq = rfqs.find(r=>r.id===applyingTo);
  if(targetRfq && targetRfq.close && new Date(targetRfq.close) < new Date()){
    toast("This RFQ has closed", `Applications for ${targetRfq.title} closed on ${formatCloseDisplay(targetRfq.close)}.`, 20000);
    closeAll();
    renderPublic();
    return;
  }
  if(!business || !regNo || !name || !position || !email || !phone){
    toast("Missing details","Business name, company registration no., name, position, email and contact number are all required.");
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    toast("Check the email address","That doesn't look like a valid email address.");
    return;
  }
  if(applyDocState.some(d=>d.uploading)){ toast("Still uploading","Please wait for document uploads to finish before submitting."); return; }
  const missingMandatory = applyDocState.filter(d=>d.mandatory && !d.filePath);
  if(missingMandatory.length){
    toast("Documents outstanding", `Please upload: ${missingMandatory.map(d=>d.name).join(', ')}.`);
    return;
  }
  const documents = applyDocState.map(d=>({docId:d.docId, name:d.name, mandatory:d.mandatory, provided:!!d.filePath, fileName:d.fileName, filePath:d.filePath||null, reviewerComments:[]}));
  const a = {id:uniqueId("APP"), rfq:applyingTo, business, companyRegNo:regNo, name, position, email, phone, comments, status:"Application Received", received:today(), reason:null, documents,
    timeline:[{date:today(), action:"Application submitted", actor:name}]};

  const submitBtn = document.getElementById('apply-submit-btn');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Submitting…'; }

  const { data, error } = await sb.functions.invoke('submit-application', {
    body: { id:a.id, rfqId:a.rfq, business:a.business, companyRegNo:a.companyRegNo, name:a.name, position:a.position, email:a.email, phone:a.phone, comments:a.comments||null, documents:a.documents, timeline:a.timeline }
  });

  if(error || (data && data.error)){
    let message = (data && data.error) || (error && error.message);
    if(error && error.context && typeof error.context.json === 'function'){
      try{ const body = await error.context.json(); message = body.error || message; } catch(e2){ /* ignore */ }
    }
    console.error('application submission failed', message);
    if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Submit Application'; }
    toast("Could not submit your application", message || 'Something went wrong — please try again.', 20000);
    return;
  }

  applicants.push(a);
  closeAll();
  document.getElementById('ac-rfq-title').textContent = targetRfq ? targetRfq.title : a.rfq;
  document.getElementById('ac-reference').textContent = a.id;
  document.getElementById('modal-application-confirmed').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  triggerEmail('application_received', a.id);
}

/* ============================================================
   MODALS / TOAST
   ============================================================ */
function closeAll(){
  document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active'));
  const drawer = document.getElementById('applicant-drawer');
  if(drawer) drawer.classList.remove('active');
  const sb = document.getElementById('sidebar');
  if(sb) sb.classList.remove('open');
  const overlay = document.getElementById('overlay');
  if(overlay) overlay.classList.remove('active');
  pendingAction = null;
}
function toast(title, msg, durationMs){
  const wrap = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className='toast';
  t.innerHTML = `<div class="tt">${title}</div><div>${msg}</div>`;
  wrap.appendChild(t);
  setTimeout(()=>t.remove(), durationMs || 5200);
}

/* ============================================================
   INIT — auth-aware: public visitors only ever see open RFQs;
   full admin data only loads for a signed-in session.
   ============================================================ */
async function initAdminPage(){
  renderComms(); // static content, safe to show immediately
  try{
    const { data: { session } } = await sb.auth.getSession();
    if(session){
      await loadAdminData();
      bumpUidCounterPastExisting();
      populateRfqFilter();
      renderDashboard();
      renderRfqs();
      renderApplicants();
      renderApprovals();
      renderRankings();
      renderAudit();
      renderEmployees();
      renderClarifications();
      applyPermissionUI();
      if(currentEmployee && currentEmployee.must_change_password){
        showChangePasswordGate();
      } else {
        showAdmin();
      }
    } else {
      showLogin();
    }
  } catch(e){
    console.error('Supabase unavailable', e);
    showLogin();
    toast("Working offline", "Couldn't reach the database — try again shortly.");
  }
}

/* Hides admin-console affordances the current employee doesn't have permission for. */
function applyPermissionUI(){
  document.querySelectorAll('.btn.gold[onclick="openNewRfq()"]').forEach(btn=>{
    btn.style.display = can('can_manage_rfqs') ? '' : 'none';
  });
  const auditTab = document.querySelector('#tabs .tab[data-view="audit"]');
  if(auditTab) auditTab.style.display = can('can_view_audit') ? '' : 'none';
  const employeesTab = document.querySelector('#tabs .tab[data-view="employees"]');
  const isSuperAdmin = !!(currentEmployee && currentEmployee.is_super_admin);
  if(employeesTab) employeesTab.style.display = isSuperAdmin ? '' : 'none';
}

async function initPublicPage(){
  const submitToken = new URLSearchParams(location.search).get('submit');
  if(submitToken){
    document.getElementById('public-view').style.display = 'none';
    document.getElementById('proposal-submit-view').style.display = 'block';
    return initProposalSubmitView(submitToken);
  }
  try{
    await loadPublicData();
  } catch(e){
    console.error('Supabase unavailable, showing local demo data only', e);
    seed();
    toast("Working offline", "Couldn't reach the database — showing local demo data that won't be saved.");
  }
  renderPublic();
  updatePublicTopbar();
}

/* ============================================================
   PROPOSAL SUBMISSION — the secure-link page an invited applicant
   lands on to actually submit their priced proposal.
   ============================================================ */
let proposalToken = null;
let proposalDocState = [];

async function initProposalSubmitView(token){
  proposalToken = token;
  const contextEl = document.getElementById('ps-context');
  const bodyEl = document.getElementById('ps-body');
  try{
    const { data, error } = await sb.functions.invoke('submit-proposal', { body: { action:'lookup', token } });
    if(error || !data || data.error || !data.success){
      contextEl.textContent = '';
      bodyEl.innerHTML = `<div style="padding:16px; background:#FBEAE6; border:1px solid var(--rust); border-radius:var(--radius); color:var(--rust);">${escapeAttr((data&&data.error)||'This link is invalid or has expired. Please contact the procurement team if you believe this is a mistake.')}</div>`;
      return;
    }
    contextEl.textContent = `${data.business} — ${data.rfqTitle} (${data.rfqId})`;
    if(data.alreadySubmitted){
      const p = data.proposal;
      bodyEl.innerHTML = `
        <div style="padding:16px; background:var(--paper-2); border-radius:var(--radius);">
          <strong>A proposal has already been submitted for this application.</strong>
          ${p ? `<div style="margin-top:10px; font-size:13px; color:var(--ink-2);">
            <div>Total price: <strong>${escapeAttr(String(p.totalPrice))}</strong></div>
            <div>Documents: ${(p.documents||[]).map(d=>escapeAttr(d.fileName)).join(', ')||'—'}</div>
            <div>Submitted: ${(p.submittedAt||'').slice(0,10)}</div>
          </div>` : ''}
          <p style="margin-top:10px; font-size:13px; color:var(--ink-2);">If you need to make a change, please contact the procurement team directly.</p>
        </div>`;
      return;
    }
    if(data.deadlinePassed){
      bodyEl.innerHTML = `
        <div style="padding:16px; background:#FBEAE6; border:1px solid var(--rust); border-radius:var(--radius); color:var(--rust);">
          <strong>The submission deadline for this proposal has passed.</strong>
          <p style="margin-top:8px; font-size:13px;">Deadline was ${formatCloseDisplay(data.proposalDeadline)}. Please contact the procurement team directly if you believe this is a mistake.</p>
        </div>`;
      return;
    }
    proposalDocState = [];
    bodyEl.innerHTML = `
      <div style="padding:14px 16px; background:#FCF3DE; border:1px solid var(--gold); border-radius:var(--radius); font-size:13.5px; color:var(--ink); margin-bottom:16px; line-height:1.5;">
        You have been selected to submit your bid for <strong>RFQ No. ${escapeAttr(data.rfqId)}</strong> — ${escapeAttr(data.rfqTitle)}. Please state the full bid amount and upload all relevant documents, including your scope of works, detailed pricing, and any other documents that support your bid.
        ${data.proposalDeadline ? `<div style="margin-top:8px; font-weight:600;">Submission deadline: ${formatCloseDisplay(data.proposalDeadline)}</div>` : ''}
      </div>
      <label>Total price (incl. VAT)</label>
      <input type="number" id="ps-price" min="0" step="0.01" placeholder="e.g. 125000.00">
      <label style="margin-top:12px;">Proposal documents</label>
      <div id="ps-doc-list"></div>
      <label class="upload-btn" style="margin-top:6px;"><span id="ps-add-doc-label">Add a document</span><input type="file" id="ps-file-input" onchange="handleProposalFile(this)"></label>
      <p style="font-size:11.5px; color:var(--ink-3); margin-top:6px;">Add your priced quotation, scope of works, and any other supporting documents — use "Add another document" as many times as you need.</p>
      <button class="btn gold" style="width:100%; margin-top:16px;" onclick="submitProposalForm()">Submit Proposal</button>
    `;
    renderProposalDocList();
  } catch(e){
    console.error('proposal lookup failed', e);
    bodyEl.innerHTML = `<div style="padding:16px; background:#FBEAE6; border:1px solid var(--rust); border-radius:var(--radius); color:var(--rust);">Couldn't load this page — check your connection and try again.</div>`;
  }
}
function renderProposalDocList(){
  const el = document.getElementById('ps-doc-list');
  if(!el) return;
  el.innerHTML = proposalDocState.map((d,i)=>`
    <div class="field-row" style="align-items:center;">
      <span class="fname">${d.uploading ? 'Uploading…' : escapeAttr(d.fileName)}</span>
      <button class="btn small secondary" onclick="removeProposalDoc(${i})" ${d.uploading?'disabled':''}>Remove</button>
    </div>`).join('');
  const addLabel = document.getElementById('ps-add-doc-label');
  if(addLabel) addLabel.textContent = proposalDocState.length ? '+ Add another document' : 'Add a document';
}
function removeProposalDoc(i){
  proposalDocState.splice(i,1);
  renderProposalDocList();
}
async function handleProposalFile(input){
  const file = input.files && input.files[0];
  if(!file) return;
  input.value = '';
  const idx = proposalDocState.length;
  proposalDocState.push({fileName:file.name, filePath:null, uploading:true});
  renderProposalDocList();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `proposals/${proposalToken}/${Date.now()}_${safeName}`;
  try{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    const { data, error } = await sb.functions.invoke('upload-document', { body: formData });
    if(error){
      let message = error.message;
      if(error.context && typeof error.context.json === 'function'){
        try{ const body = await error.context.json(); message = body.error || message; } catch(e2){ /* ignore */ }
      }
      throw new Error(message);
    }
    if(data && data.error) throw new Error(data.error);
    proposalDocState[idx].filePath = path;
  } catch(e){
    console.error('proposal document upload failed', e);
    toast("Upload failed", `Could not upload ${file.name} — please try again.`);
    proposalDocState.splice(idx,1);
  }
  proposalDocState[idx] && (proposalDocState[idx].uploading = false);
  renderProposalDocList();
}
async function submitProposalForm(){
  const price = Number(document.getElementById('ps-price').value);
  if(!price || price <= 0){ toast("Total price required", "Please enter a valid total price."); return; }
  if(proposalDocState.some(d=>d.uploading)){ toast("Still uploading", "Please wait for your document(s) to finish uploading."); return; }
  const documents = proposalDocState.filter(d=>d.filePath).map(d=>({fileName:d.fileName, path:d.filePath}));
  if(documents.length === 0){ toast("Document required", "Please add at least one proposal document."); return; }

  try{
    const { data, error } = await sb.functions.invoke('submit-proposal', { body: { action:'submit', token:proposalToken, totalPrice:price, documents } });
    if(error || !data || data.error || !data.success){
      toast("Couldn't submit", (data&&data.error) || "Something went wrong — please try again.");
      return;
    }
    document.getElementById('ps-body').innerHTML = `
      <div style="padding:16px; background:#EAF3EC; border:1px solid var(--sage); border-radius:var(--radius); color:var(--sage);">
        <strong>Your proposal has been submitted.</strong>
        <p style="margin-top:8px; font-size:13px;">A confirmation email is on its way. Our team will be in touch once evaluation is complete.</p>
      </div>`;
  } catch(e){
    console.error('proposal submit failed', e);
    toast("Couldn't submit", "Something went wrong — please try again.");
  }
}

/* Anonymous/public bootstrap — RLS itself restricts this to open/published RFQs only. */
async function loadPublicData(){
  const { data, error } = await sb.from('rfq_rfqs').select('id, title, category, status, budget, open_date, close_date, description, required_docs, attachments, extension_notices').order('created_at', {ascending:true});
  if(error){ console.error('public rfq load failed', error); toast("Working offline", "Couldn't load open tenders — check your connection."); return; }
  rfqs = (data||[]).map(r=>({id:r.id, title:r.title, category:r.category, status:r.status, budget:Number(r.budget), open:r.open_date, close:r.close_date, desc:r.description, requiredDocs:r.required_docs||[], attachments:r.attachments||[], extensionNotices:r.extension_notices||[]}));
}

/* Signed-in admin bootstrap — full read access, seeds a genuinely empty database. */
async function loadAdminData(){
  const footEl = document.getElementById('sidebar-foot');
  try{
    await loadFromSupabase();
    if(footEl) footEl.innerHTML = `🟢 Connected to Supabase — live data (${rfqs.length} RFQs, ${applicants.length} applicants).`;
    await loadEmployeesAndPermissions();
  } catch(e){
    console.error('Supabase unavailable, showing local demo data only', e);
    seed();
    if(footEl) footEl.innerHTML = '🔴 Working offline — could not reach Supabase. Changes here will NOT be saved.';
    toast("Working offline", "Couldn't reach the database — showing local demo data that won't be saved.");
  }
  bumpUidCounterPastExisting();
}

let employees = [];
let currentEmployee = null; // the logged-in user's own permission row
async function loadEmployeesAndPermissions(){
  const { data, error } = await sb.from('rfq_employees').select('*').order('created_at', {ascending:true});
  if(error){ console.error('employees load failed', error); return; }
  employees = data || [];
  const { data: { user } } = await sb.auth.getUser();
  currentEmployee = employees.find(e=>e.id === (user && user.id)) || null;
}
function can(perm){
  // The founding admin (no employees row resolvable yet, e.g. mid-load) defaults to
  // false-safe; once currentEmployee loads, real permissions apply.
  return !!(currentEmployee && currentEmployee[perm]);
}

/* ============================================================
   EMPLOYEES
   ============================================================ */
/* supabase-js hides a failed Edge Function's actual response body behind a generic
   FunctionsHttpError — this pulls out the real message/debug info we sent back. */
/* Fires a notification email via the send-notification-email function. Never
   blocks the calling action on failure — email is best-effort, logged either
   way (see rfq_email_log), and never breaks the actual workflow action. */
function triggerEmail(trigger, applicantId, extra){
  sb.functions.invoke('send-notification-email', {
    body: { trigger, applicantId, triggeredBy: (currentEmployee && currentEmployee.email) || 'public', ...(extra||{}) }
  }).then(({data, error})=>{
    if(error || (data && data.error)){
      console.error('email trigger failed', trigger, applicantId, error || (data && data.error));
    } else if(data && data.status === 'sent'){
      toast("Email sent", `Notification sent to the applicant.`);
    } else if(data && data.status === 'skipped_not_configured'){
      console.log('Email not sent (Resend not yet configured) — logged as:', data.subject);
    }
  }).catch(e=>console.error('email trigger failed', trigger, applicantId, e));
}

async function unwrapFunctionError(error, data){
  if(data && data.error) return { message: data.error, debug: data.debug };
  if(error && error.context && typeof error.context.json === 'function'){
    try{
      const body = await error.context.json();
      return { message: body.error, debug: body.debug };
    } catch(e){ /* fall through */ }
  }
  return { message: (error && error.message) || null, debug: null };
}

const PERM_LABELS = {
  can_manage_rfqs: 'Manage RFQs',
  can_publish_rfqs: 'Approve & Publish RFQs',
  can_screen_validate: 'Screen & Validate',
  can_evaluate_approve: 'Evaluate & Approve',
  can_manage_contracts: 'Manage Contracts',
  can_review_documents: 'Review Documents',
  can_view_audit: 'View Audit Trail',
};
function renderEmployees(){
  const el = document.getElementById('employees-table');
  if(!el) return;
  el.innerHTML = `
    <tr><th>Name</th><th>Email</th><th>Position</th><th>Permissions</th><th></th></tr>
    ${employees.map(e=>{
      const perms = Object.keys(PERM_LABELS).filter(k=>e[k]);
      const permBadges = perms.length ? perms.map(k=>`<span class="badge gold" style="margin:1px;">${PERM_LABELS[k]}</span>`).join('') : `<span class="badge ink">Read only</span>`;
      return `<tr class="rowlink" onclick="openEditEmployee('${e.id}')">
        <td>${escapeAttr(e.name)}</td><td>${escapeAttr(e.email)}</td><td>${escapeAttr(e.position||'—')}</td>
        <td>${permBadges}</td><td class="mono ref">${e.id===currentEmployee?.id? 'you' : ''}</td></tr>`;
    }).join('')}
  `;
}

let editingEmployeeId = null;
function openAddEmployee(){
  editingEmployeeId = null;
  document.getElementById('emp-modal-title').textContent = 'Add employee';
  document.getElementById('emp-name').value = '';
  document.getElementById('emp-email').value = '';
  document.getElementById('emp-email').disabled = false;
  document.getElementById('emp-position').value = '';
  ['rfqs','publish','screen','evaluate','contracts','docs','audit'].forEach(k=>{ document.getElementById('emp-perm-'+k).checked = false; });
  document.getElementById('emp-remove-btn').style.display = 'none';
  document.getElementById('emp-save-btn').textContent = 'Send invite';
  document.getElementById('modal-employee').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function openEditEmployee(id){
  const e = employees.find(x=>x.id===id);
  if(!e) return;
  editingEmployeeId = id;
  document.getElementById('emp-modal-title').textContent = 'Edit employee';
  document.getElementById('emp-name').value = e.name||'';
  document.getElementById('emp-email').value = e.email||'';
  document.getElementById('emp-email').disabled = true; // email can't change post-invite in this build
  document.getElementById('emp-position').value = e.position||'';
  document.getElementById('emp-perm-rfqs').checked = !!e.can_manage_rfqs;
  document.getElementById('emp-perm-publish').checked = !!e.can_publish_rfqs;
  document.getElementById('emp-perm-screen').checked = !!e.can_screen_validate;
  document.getElementById('emp-perm-evaluate').checked = !!e.can_evaluate_approve;
  document.getElementById('emp-perm-contracts').checked = !!e.can_manage_contracts;
  document.getElementById('emp-perm-docs').checked = !!e.can_review_documents;
  document.getElementById('emp-perm-audit').checked = !!e.can_view_audit;
  document.getElementById('emp-remove-btn').style.display = 'inline-block';
  document.getElementById('emp-save-btn').textContent = 'Save changes';
  document.getElementById('modal-employee').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}
function readPermsFromForm(){
  return {
    can_manage_rfqs: document.getElementById('emp-perm-rfqs').checked,
    can_publish_rfqs: document.getElementById('emp-perm-publish').checked,
    can_screen_validate: document.getElementById('emp-perm-screen').checked,
    can_evaluate_approve: document.getElementById('emp-perm-evaluate').checked,
    can_manage_contracts: document.getElementById('emp-perm-contracts').checked,
    can_review_documents: document.getElementById('emp-perm-docs').checked,
    can_view_audit: document.getElementById('emp-perm-audit').checked,
  };
}
async function saveEmployee(){
  const name = document.getElementById('emp-name').value.trim();
  const email = document.getElementById('emp-email').value.trim();
  const position = document.getElementById('emp-position').value.trim();
  if(!name || !email){ toast("Missing details", "Name and email are both required."); return; }
  const perms = readPermsFromForm();
  const saveBtn = document.getElementById('emp-save-btn');

  if(editingEmployeeId){
    saveBtn.disabled = true;
    const { error } = await sb.from('rfq_employees').update({ name, position: position||null, ...perms }).eq('id', editingEmployeeId);
    saveBtn.disabled = false;
    if(error){ console.error('employee update failed', error); toast("Not saved", "Could not update this employee — check the console."); return; }
    logAudit(`Employee updated — ${name} (${email})`, currentEmployee?.email || 'Admin', Object.keys(perms).filter(k=>perms[k]).map(k=>PERM_LABELS[k]).join(', ') || 'Read only');
    toast("Employee updated", `${name}'s details have been saved.`);
    closeAll();
    await loadEmployeesAndPermissions();
    renderEmployees();
    applyPermissionUI();
  } else {
    saveBtn.disabled = true; saveBtn.textContent = 'Sending invite…';
    const { data: { session } } = await sb.auth.getSession();
    const { data, error } = await sb.functions.invoke('manage-employee', {
      body: { action: 'invite', name, email, position, permissions: perms },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    saveBtn.disabled = false; saveBtn.textContent = 'Send invite';
    if(error || (data && data.error)){
      const { message, debug } = await unwrapFunctionError(error, data);
      console.error('employee invite failed', message, debug);
      toast("Could not add employee", message || "Something went wrong — check the console.");
      return;
    }
    logAudit(`Employee added — ${name} (${email})`, currentEmployee?.email || 'Admin', Object.keys(perms).filter(k=>perms[k]).map(k=>PERM_LABELS[k]).join(', ') || 'Read only');
    closeAll();
    await loadEmployeesAndPermissions();
    renderEmployees();
    document.getElementById('tp-name').textContent = name;
    document.getElementById('tp-password').value = data.tempPassword;
    document.getElementById('modal-temp-password').classList.add('active');
    document.getElementById('overlay').classList.add('active');
  }
}
async function removeEmployee(){
  if(!editingEmployeeId) return;
  const e = employees.find(x=>x.id===editingEmployeeId);
  if(!confirm(`Remove ${e ? e.name : 'this employee'}? They will no longer be able to sign in.`)) return;
  const { data: { session } } = await sb.auth.getSession();
  const { data, error } = await sb.functions.invoke('manage-employee', {
    body: { action: 'deactivate', employeeId: editingEmployeeId },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if(error || (data && data.error)){
    const { message } = await unwrapFunctionError(error, data);
    console.error('employee removal failed', message);
    toast("Could not remove employee", message || "Something went wrong — check the console.");
    return;
  }
  logAudit(`Employee removed — ${e ? e.name+' ('+e.email+')' : editingEmployeeId}`, currentEmployee?.email || 'Admin');
  toast("Employee removed", `${e ? e.name : 'Employee'} can no longer sign in.`);
  closeAll();
  await loadEmployeesAndPermissions();
  renderEmployees();
}
function copyTempPassword(){
  const input = document.getElementById('tp-password');
  input.select();
  try{ document.execCommand('copy'); toast("Copied", "Temporary password copied to clipboard."); }
  catch(e){ toast("Couldn't copy", "Please select and copy the password manually."); }
}

function bumpUidCounterPastExisting(){
  let max = uidCounter;
  const scanText = JSON.stringify(rfqs) + JSON.stringify(applicants);
  scanText.replace(/-(\d{3,})/g, (m,n)=>{ const v=parseInt(n,10); if(v>max) max=v; return m; });
  uidCounter = max;
}

async function pushSeedToSupabase(){
  const rfqRows = rfqs.map(r=>({id:r.id, title:r.title, category:r.category, status:r.status, budget:r.budget, open_date:r.open, close_date:r.close, description:r.desc, required_docs:r.requiredDocs||[], attachments:r.attachments||[]}));
  const { error: e1 } = await sb.from('rfq_rfqs').insert(rfqRows);
  if(e1) console.error('seed rfqs insert failed', e1);

  const appRows = applicants.map(a=>({id:a.id, rfq_id:a.rfq, business:a.business, company_reg_no:a.companyRegNo||null, contact_name:a.name, position:a.position||null, email:a.email||null, phone:a.phone||null, comments:a.comments||null, status:a.status, received_date:a.received, reason:a.reason, documents:a.documents||[]}));
  const { error: e2 } = await sb.from('rfq_applicants').insert(appRows);
  if(e2) console.error('seed applicants insert failed', e2);

  const timelineRows = [];
  applicants.forEach(a=>{ (a.timeline||[]).forEach(t=>{ timelineRows.push({applicant_id:a.id, event_date:t.date, action:t.action, actor:t.actor, note:t.note||null}); }); });
  if(timelineRows.length){
    const { error: e3 } = await sb.from('rfq_timeline_events').insert(timelineRows);
    if(e3) console.error('seed timeline insert failed', e3);
  }
  // audit rows were already pushed individually by logAudit() while seed() ran above.
}

async function loadFromSupabase(){
  const [rfqRes, appRes, tlRes, auditRes] = await Promise.all([
    sb.from('rfq_rfqs').select('*').order('created_at', {ascending:true}),
    sb.from('rfq_applicants').select('*').order('created_at', {ascending:true}),
    sb.from('rfq_timeline_events').select('*').order('event_date', {ascending:true}).order('id', {ascending:true}),
    sb.from('rfq_audit_log').select('*').order('ts', {ascending:false}),
  ]);
  if(rfqRes.error||appRes.error||tlRes.error||auditRes.error){
    console.error('load errors', rfqRes.error, appRes.error, tlRes.error, auditRes.error);
  }

  const timelineByApplicant = {};
  (tlRes.data||[]).forEach(t=>{
    (timelineByApplicant[t.applicant_id] = timelineByApplicant[t.applicant_id]||[]).push({date:t.event_date, action:t.action, actor:t.actor, note:t.note||''});
  });

  rfqs = (rfqRes.data||[]).map(r=>({id:r.id, title:r.title, category:r.category, status:r.status, budget:Number(r.budget), open:r.open_date, close:r.close_date, desc:r.description, requiredDocs:r.required_docs||[], attachments:r.attachments||[], pendingStatusChange:r.pending_status_change||null, extensionNotices:r.extension_notices||[], assignedApproverId:r.assigned_approver_id||null}));
  applicants = (appRes.data||[]).map(a=>({id:a.id, rfq:a.rfq_id, business:a.business, companyRegNo:a.company_reg_no, name:a.contact_name, position:a.position, email:a.email, phone:a.phone, comments:a.comments, status:a.status, received:a.received_date, reason:a.reason, documents:a.documents||[], timeline: timelineByApplicant[a.id] || [], proposal:a.proposal||null, proposalToken:a.proposal_token||null, proposalDeadline:a.proposal_deadline||null}));
  audit = (auditRes.data||[]).map(e=>({ts: (e.ts||'').replace('T',' ').slice(0,16), action:e.action, who:e.who, note:e.note||''}));
}
