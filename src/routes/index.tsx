import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/features/game/landing-page";

const SITE_URL = "https://cubetimer.sitos.uk";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Cube Timer",
      },
      {
        name: "description",
        content: "A warm cube puzzle timer for practicing solves in the browser.",
      },
      {
        property: "og:title",
        content: "Cube Timer",
      },
      {
        property: "og:description",
        content: "A warm cube puzzle timer for practicing solves in the browser.",
      },
      {
        property: "og:url",
        content: SITE_URL,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: SITE_URL,
      },
    ],
  }),
  component: App,
});

function App() {
  return <LandingPage />;
}
