import { createFileRoute } from "@tanstack/react-router";

import { GameScreen } from "#/features/game/game-screen";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      {
        title: "Cube Desk - Play",
      },
      {
        name: "description",
        content:
          "A focused cube puzzle timer with touch controls, scramble actions, and solve review.",
      },
    ],
  }),
  component: GameRoute,
});

function GameRoute() {
  return <GameScreen />;
}
