import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/asmi/chrome";
import { SUPPORT_EMAIL } from "@/config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms | Asmi for Pros" },
      { name: "description", content: "Terms for joining the Asmi for Pros waitlist, run by Humint Labs, Inc." },
      { property: "og:title", content: "Terms | Asmi for Pros" },
      { property: "og:description", content: "Terms for the Asmi for Pros waitlist." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

// DRAFT: replace with the exact text from the old repo (app/terms/page.tsx) and have counsel review.
function Terms() {
  return (
    <SimplePage>
      <article className="legal">
        <h1 style={{ fontSize: "var(--fs-h2)" }}>Terms</h1>
        <p className="small">Humint Labs, Inc. Last updated 2026.</p>
        <h2>The waitlist</h2>
        <p>Joining the Asmi waitlist is free. It does not create a contract for services and does not guarantee a spot, a start date or any jobs.</p>
        <h2>Texts and calls</h2>
        <p>By joining you agree that Asmi, an AI assistant, can text or call you about the waitlist at the number you gave. Msg and data rates may apply. Reply STOP to opt out at any time.</p>
        <h2>Your information</h2>
        <p>Our Privacy Policy explains how we handle what you share with us.</p>
        <h2>Changes</h2>
        <p>We may update these terms. We will post the new version on this page.</p>
        <h2>Contact</h2>
        <p>{SUPPORT_EMAIL}</p>
      </article>
    </SimplePage>
  );
}
