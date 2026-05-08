import { createFileRoute } from "@tanstack/react-router";

import { GameScreen } from "#/features/game/game-screen";

const SITE_URL = "https://cubetimer.sitos.uk";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      {
        title: "Cube Timer - Play",
      },
      {
        name: "description",
        content:
          "A focused cube puzzle timer with touch controls, scramble actions, and solve review.",
      },
      {
        property: "og:title",
        content: "Cube Timer - Play",
      },
      {
        property: "og:description",
        content:
          "A focused cube puzzle timer with touch controls, scramble actions, and solve review.",
      },
      {
        property: "og:url",
        content: `${SITE_URL}/play`,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${SITE_URL}/play`,
      },
    ],
  }),
  component: GameRoute,
});

function GameRoute() {
  return <GameScreen />;
}
