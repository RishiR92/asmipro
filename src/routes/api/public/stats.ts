import { createFileRoute } from "@tanstack/react-router";
import { handleStats } from "@/lib/waitlist.server";

export const Route = createFileRoute("/api/public/stats")({
  server: {
    handlers: {
      GET: async () => handleStats(),
    },
  },
});
