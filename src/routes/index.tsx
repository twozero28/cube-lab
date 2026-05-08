import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/features/game/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Cube Lab",
      },
      {
        name: "description",
        content:
          "Unified neon landing for Cube Lab with a floating central hero, protocol footer, and holographic navigation shell.",
      },
    ],
  }),
  component: App,
});

function App() {
  return <LandingPage />;
}
