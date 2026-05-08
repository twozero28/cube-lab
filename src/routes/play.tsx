import { createFileRoute } from "@tanstack/react-router";

import { GameScreen } from "#/features/game/game-screen";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      {
        title: "Cube Lab - Play",
      },
      {
        name: "description",
        content:
          "3D Cube Puzzle Stage with a fixed neon HUD, live telemetry, and a bottom command shell built from the Stitch design.",
      },
    ],
  }),
  component: GameRoute,
});

function GameRoute() {
  return <GameScreen />;
}
