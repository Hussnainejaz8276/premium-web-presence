import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import CleanRoomApp from "@/components/CleanRoomApp";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "CleanRoom — Data Cleaning Workspace" },
      { name: "description", content: "Clean, profile, analyze, and prepare datasets for machine learning." },
      { property: "og:title", content: "CleanRoom — Data Cleaning Workspace" },
      { property: "og:description", content: "Clean, profile, analyze, and prepare datasets for machine learning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppRoute,
});

function AppRoute() {
  useEffect(() => {
    if (document.getElementById("cleanroom-vanilla-bridge")) return;
    const script = document.createElement("script");
    script.id = "cleanroom-vanilla-bridge";
    script.src = "/cleanroom-bridge.js";
    script.async = false;
    document.body.appendChild(script);
  }, []);

  return <CleanRoomApp />;
}
