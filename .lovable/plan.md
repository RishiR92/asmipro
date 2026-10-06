# Asmi proof ticker and desktop structure

## What will change

- Change the availability line to **“Only 500 spots left.”**, removing “waitlist” from that sentence.
- Do not create a fake countdown that resets or fabricated city joins presented as live activity. Keep the 500-place launch allocation truthful and update it from confirmed signups.
- Start city proof at **Bay Area 550**, **Los Angeles 433**, and **New York 278**, then increase the matching city only when a real signup is confirmed.
- Turn the proof strip into one large, high-impact sequence:
  - “Team from” with a rotating Meta / Google / Amazon name ticker.
  - The label then transitions to “Backed by leaders at,” with a rotating Snap / Meta / Google name ticker.
  - Keep the reduced-motion version static and fully readable.
- Remove the repeated company ticker beneath Rish and Satwik; the founder section will contain only their portraits, names, roles, and experience.
- Preserve the mobile layout that is already working while restructuring desktop into stronger, easier-to-scan chapters: wider content rails, consistent section spacing, controlled text widths, balanced two-column pairings, and clearer alignment between headings and content.
- Keep English and Spanish versions aligned.

## Technical details

- Replace the current two-row company ticker with a single staged ticker that rotates both its label and company names as one coordinated sequence.
- Add verified baseline city totals to the shared counting helper, then layer confirmed database signups on top so the city figures move only with real joins.
- Update the shared launch allocation from 200 to 500 and keep confirmation positions based on the existing queue logic unless the displayed city totals are explicitly meant to redefine queue size.
- Add desktop-only layout rules at the existing large-screen breakpoint; mobile spacing and ordering remain unchanged.
- Validate desktop at 1280px and the current 1522px width, plus mobile at 390px, with reduced-motion and both languages checked.
