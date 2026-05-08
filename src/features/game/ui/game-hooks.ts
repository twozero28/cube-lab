import { useEffect } from "react";

import { useGameStore } from "../store/game-store";

export function useGameTimer() {
  const phase = useGameStore((state) => state.phase);
  const tickTimer = useGameStore((state) => state.tickTimer);

  useEffect(() => {
    if (phase !== "interactive") return;

    tickTimer();

    const id = window.setInterval(() => {
      tickTimer();
    }, 100);

    return () => window.clearInterval(id);
  }, [phase, tickTimer]);
}
