import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/features/game/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Cube Desk",
      },
      {
        name: "description",
        content: "A warm desk toy companion for practicing cube puzzle solves in the browser.",
      },
    ],
  }),
  component: App,
});

function App() {
  return <LandingPage />;
}
