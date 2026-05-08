import { Box } from "lucide-react";

import { CubeScene } from "./scene/cube-scene";
import { useGameStore } from "./store/game-store";
import { formatElapsed } from "./ui/format";
import { GameHud } from "./ui/hud";
import { useGameTimer } from "./ui/game-hooks";
import { ResultDialog } from "./ui/result-dialog";

export function GameScreen() {
  const phase = useGameStore((state) => state.phase);
  const elapsedMs = useGameStore((state) => state.elapsedMs);
  const moveCount = useGameStore((state) => state.moveCount);
  const activeMove = useGameStore((state) => state.activeMove);
  const previewMove = useGameStore((state) => state.previewMove);

  useGameTimer();

  const gestureLabel = activeMove
    ? "Rotating layer"
    : previewMove
      ? "Release to rotate"
      : "Drag a face to rotate";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--surface)] text-[var(--text-primary)]">
      <GameHud />

      <section className="relative flex w-full flex-1 flex-col items-center justify-center px-6 pb-32 pt-24">
        <div className="absolute left-6 top-24 z-20 flex flex-col gap-4">
          <MetricReadout
            label="Session Time"
            value={formatElapsed(elapsedMs)}
            accent="text-cyan-400"
          />
          <MetricReadout
            label="Operations"
            value={String(moveCount).padStart(2, "0")}
            accent="text-fuchsia-400"
          />
        </div>

        <div className="absolute right-6 top-24 z-20">
          <div className="flex items-center gap-2 rounded-full border border-[var(--tertiary)]/20 bg-[var(--tertiary)]/10 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--tertiary)] shadow-[0_0_8px_#bcff5f]" />
            <span className="font-[var(--font-display)] text-[10px] font-extrabold uppercase tracking-tight text-[var(--tertiary)]">
              Calibrated
            </span>
          </div>
        </div>

        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(143,245,255,0.05),transparent_55%)]" />

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--primary)]/5 blur-[100px]" />
          <CubeScene />
        </div>

        <div className="relative z-10 mt-5 flex items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[rgba(35,35,65,0.5)] px-4 py-2 backdrop-blur-xl">
          <Box className="size-4 text-[var(--primary)]" />
          <span className="font-[var(--font-display)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            {gestureLabel}
          </span>
        </div>
      </section>

      {phase === "idle" ? (
        <div className="pointer-events-none absolute bottom-32 z-20">
          <p className="rounded-full bg-[rgba(17,17,40,0.76)] px-4 py-2 text-center text-xs text-[var(--text-secondary)] backdrop-blur-xl shadow-[inset_0_0_0_1px_var(--outline-variant)]">
            Start a scramble to begin a live timed run.
          </p>
        </div>
      ) : null}

      <ResultDialog />
    </main>
  );
}

function MetricReadout({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </span>
      <span className={`font-[var(--font-display)] text-2xl font-bold leading-none ${accent}`}>
        {value}
      </span>
    </div>
  );
}
