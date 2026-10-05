import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/asmi/landing";
import heroBase from "@/assets/scene-hero3-base.webp.asset.json";

const OG = "https://project--18a8ffe1-7ce9-441e-8d49-a929cfa2d0f2.lovable.app/og-image.png";
const TITLE = "Asmi for Pros: same hours, more paid jobs";
const DESC =
  "Paid jobs with no lead fees, plus help with office work by text or voice in 30+ languages for home service pros.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG },
    ],
    links: [{ rel: "preload", as: "image", href: heroBase.url, fetchPriority: "high" }],
  }),
  component: Landing,
});
