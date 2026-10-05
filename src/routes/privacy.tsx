import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/asmi/chrome";
import { SUPPORT_EMAIL } from "@/config";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Asmi for Pros" },
      { name: "description", content: "How Humint Labs, Inc. collects, uses and protects information from the Asmi for Pros waitlist." },
      { property: "og:title", content: "Privacy Policy | Asmi for Pros" },
      { property: "og:description", content: "How Asmi handles your waitlist information." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

// DRAFT: replace with the exact text from the old repo (app/privacy/page.tsx) and have counsel review.
function Privacy() {
  return (
    <SimplePage>
      <article className="legal">
        <h1 style={{ fontSize: "var(--fs-h2)" }}>Privacy Policy</h1>
        <p className="small">Humint Labs, Inc. Last updated 2026.</p>
        <h2>What we collect</h2>
        <p>When you join the waitlist we collect your name, mobile number, where you work and, if you choose, your trades, crew size, zip code, business name and email. We also record basic visit details such as the page you came from and your browser type.</p>
        <h2>How we use it</h2>
        <ul>
          <li>To text or call you about the waitlist and setting up Asmi.</li>
          <li>To understand which cities and trades to open first.</li>
          <li>To improve this site.</li>
        </ul>
        <h2>What we never do</h2>
        <p>We never sell your number or your information.</p>
        <h2>Texts</h2>
        <p>Msg and data rates may apply. Reply STOP to any message to opt out. Reply HELP for help.</p>
        <h2>Your choices</h2>
        <p>Email {SUPPORT_EMAIL} to see, change or delete your information.</p>
        <h2>Contact</h2>
        <p>Humint Labs, Inc. 710 Lakeway Drive, Suite 200, Sunnyvale, CA 94085. {SUPPORT_EMAIL}</p>
      </article>
    </SimplePage>
  );
}
