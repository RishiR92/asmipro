# Asmi proof ticker and desktop structure

## What will change

- Change the availability line to **“Only 486 spots left.”**, removing “waitlist” from that sentence.
- Animate the promotional spots figure down by one every 10 seconds, from 486 through 400, then reset it to 486 and repeat.
- Start city proof at **Bay Area 550**, **Los Angeles 433**, and **New York 278**. Every 10 seconds, increment one of the three displayed city figures as part of the same gamified presentation.
- Turn the proof strip into one large, high-impact sequence:
  - “Team from” with a rotating Meta / Google / Amazon name ticker.
  - The label then transitions to “Backed by leaders at,” with a rotating Snap / Meta / Google name ticker.
  - Keep the reduced-motion version static and fully readable.
- Remove the repeated company ticker beneath Rish and Satwik; the founder section will contain only their portraits, names, roles, and experience.
- Preserve the mobile layout that is already working while restructuring desktop into stronger, easier-to-scan chapters: wider content rails, consistent section spacing, controlled text widths, balanced two-column pairings, and clearer alignment between headings and content.
- Keep English and Spanish versions aligned.

## Technical details

- Replace the current two-row company ticker with a single staged ticker that rotates both its label and company names as one coordinated sequence.
- Keep these animated promotional figures separate from stored signup totals and confirmation queue positions, so the waitlist form and #305 onward confirmation behavior remain unchanged.
- Implement one shared 10-second browser timer for the spots and city animations, with no timer during server rendering and a stable static presentation when reduced motion is enabled.
- Add desktop-only layout rules at the existing large-screen breakpoint; mobile spacing and ordering remain unchanged.
- Validate desktop at 1280px and the current 1522px width, plus mobile at 390px, with reduced-motion and both languages checked.
