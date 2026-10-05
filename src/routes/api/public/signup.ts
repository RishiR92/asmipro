import { createFileRoute } from "@tanstack/react-router";
import { handleSignup } from "@/lib/waitlist.server";

export const Route = createFileRoute("/api/public/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => handleSignup(request),
    },
  },
});
