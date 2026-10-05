# Asmi for Pros conversion refresh

## What the research says
- Pros are tired of paying for shared leads that do not answer or book. Outcome-based pricing is the clearest point of difference.
- Lead with the result, not the technology: a paid job, one pro, no bidding, no charge for a dead lead.
- “AI crew” works best when translated into everyday outcomes: answers when you cannot, books work, prepares quotes, rearranges the day, orders parts, invoices, and follows up.
- Pros are not anti-technology; they reject extra tools and steps. “Use it by text or voice” is stronger than software terminology.
- Commission transparency builds trust. State “starts at 15%” before signup and show a consistent $300 → $45 → $255 example.
- Named founders, operating history, location, and credible backers should be visually prominent before the final signup ask.
- Motion should behave like printed pieces settling or stamps landing—useful and restrained, never a distraction.

Evidence reviewed includes Google Local Services pricing/conversion analysis, Angi’s provider disclosures, TaskRabbit onboarding, ServiceTitan contractor research, contractor-platform community feedback, FTC trust guidance, and research on language barriers in the trades.

## Page changes
1. **Simplify the first screen**
   - Preserve the current cream/cobalt/lime riso identity and Space Grotesk type.
   - Make “Paid jobs. No lead fees.” the single dominant message.
   - Use one short support line: Asmi brings jobs customers have already paid for; the crew handles office work by text or voice.
   - Keep one waitlist button and the existing illustration, but reduce secondary labels and loading noise.
   - Add “30+ languages” as a compact proof point rather than another paragraph.

2. **Tell one clear story**
   - Keep the current overall sequence: promise → credibility → pain → two benefits → day with Asmi → economics → process → team → availability → FAQ → join.
   - Reword role labels such as “front desk,” “estimator,” and “dispatcher” into actions pros immediately recognize.
   - Keep voice support present but secondary; the main story remains paid jobs plus less office work.
   - Update English and Spanish together from the shared copy source.

3. **Make pricing concrete**
   - Add a configurable “commission starts at 15%” value.
   - Update every worked example consistently to $300 paid, $45 to Asmi, $255 to the pro.
   - Clarify that the pro sees the exact amount before accepting and pays nothing on their existing customers.

4. **Strengthen company trust**
   - Build the selected “Riso-print mobile refinement” for the team area: two substantial founder profiles, a separated founder note, and a cleaner named-backer list.
   - Use “Rish” and “Satwik” everywhere.
   - Replace the founder note with a sharper version centered on 5,000 completed home-service tasks, missed work, failed leads, and Asmi fixing both.
   - Change “Is Asmi a real company?” to “How can I trust Asmi?” and answer with specific company, team, and backer facts.
   - Use the supplied Rish and Satwik portraits, cropped consistently and treated in the restrained print style selected for this section.

5. **Remove the obstructive repeat CTA**
   - Remove the persistent bottom waitlist bar.
   - Keep only the opening and closing signup actions.

## Waitlist flow
1. **Location**
   - When “Somewhere else” is selected, reveal a required city field.
   - Add a nullable database field for this city, validate and length-limit it on both the page and server, and include it in owner exports.

2. **Accurate confirmation**
   - Step 1 collects location, name, phone, and contact permission, then saves a recoverable draft.
   - Step 2 collects trade, crew size, zip, business, and optional email. The primary action confirms the waitlist entry.
   - Do not say “on the list,” calculate/show position, count the signup in public totals, or credit a referral until step 2 succeeds.
   - Remove the misleading skip-to-confirmation path.

3. **Cleaner form copy**
   - Remove “Takes 20 seconds,” “A few taps help us set you up,” and “No card. No contract. We never sell your number” from the form.
   - Remove the long AI/terms paragraph the user called out.
   - Retain a short explicit contact opt-in near the phone field and the linked Terms/Privacy reference. This preserves a clear record of permission for US waitlist texts and calls without the cluttered copy.

4. **Referral sharing**
   - Keep native Share so phones open installed options such as WhatsApp and iMessage.
   - Keep a separate Copy link action; simplify the three-column action row so these two choices are unmistakable.

## Technical details
- Add `service_city` and a draft/confirmed status to waitlist records without exposing the table publicly.
- Update the public signup handler so all inputs are validated server-side and only confirmed entries affect counts, positions, and referrals.
- Preserve existing rate limits, attribution, and owner spreadsheet synchronization.
- Update metadata descriptions to mention text and voice support where relevant.
- Test English and Spanish, the “somewhere else” path, true two-step confirmation, sharing/copying, referral credit, public counts, and mobile/desktop layout.
- Submit one controlled test entry, verify it reaches the database, then remove only that test row.

## Validation and launch notes
- The 30+ language and voice claims will be presented as current capabilities, based on the user’s confirmation.
- The exact legal wording in Privacy and Terms remains a separate launch dependency because the old repository text was not provided.
- Real founding-spot caps and a support text number remain hidden until supplied.
