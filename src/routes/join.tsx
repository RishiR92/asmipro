import { createFileRoute } from "@tanstack/react-router";
import { Footer, TopBar } from "@/components/asmi/chrome";
import { SignupFlow } from "@/components/asmi/signup";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the Asmi for Pros waitlist" },
      { name: "description", content: "Join the Asmi waitlist in 20 seconds. Paid jobs and an AI crew for home service pros. No card, no contract." },
      { property: "og:title", content: "Join the Asmi for Pros waitlist" },
      { property: "og:description", content: "Paid jobs and an AI crew for home service pros. No card, no contract." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  return (
    <>
      <TopBar />
      <main className="wrap" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <div className="obj mx-auto" style={{ maxWidth: 520, padding: "16px 20px 24px" }}>
          <SignupFlow />
        </div>
      </main>
      <Footer />
    </>
  );
}
