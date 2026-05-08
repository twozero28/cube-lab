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
  const size = useGameStore((state) => state.size);

  useGameTimer();

  const gestureLabel = activeMove
    ? "Turning a layer"
    : previewMove
      ? "Release to turn"
      : phase === "idle"
        ? "Scramble to begin"
        : "Tap and hold to inspect";
  return (
    <main className="app-canvas">
      <section className="phone-shell play-shell safe-top safe-bottom flex flex-col px-6 md:px-10 lg:px-12">
        <GameHud />

        <section className="play-layout">
          <div className="play-panel relative z-10 flex flex-col items-center md:items-start">
            <div className="flex w-full items-end justify-between gap-4 md:block">
              <div>
                <h1 className="timer-number text-[clamp(2.65rem,12vw,4.1rem)] font-black leading-none tracking-[-0.08em] text-[var(--text-primary)] md:text-[5.8rem] lg:text-[6.75rem]">
                  {formatElapsed(elapsedMs)}
                </h1>
                <p className="mt-1.5 text-base font-semibold text-[var(--sage-dark)] md:mt-2 md:text-lg">
                  {gestureLabel}
                </p>
              </div>
              <div className="pb-1 text-right md:hidden">
                <p className="text-xs font-bold text-[var(--sage-dark)]">Moves</p>
                <p className="timer-number text-3xl font-black leading-none">{moveCount}</p>
              </div>
            </div>

            <div className="mt-4 hidden w-full grid-cols-2 gap-4 md:grid">
              <div className="paper-card p-4">
                <p className="text-sm font-bold text-[var(--sage-dark)]">Moves</p>
                <p className="timer-number mt-2 text-5xl font-black leading-none">{moveCount}</p>
              </div>
              <div className="paper-card p-4">
                <p className="text-sm font-bold text-[var(--sage-dark)]">Mode</p>
                <p className="mt-2 text-3xl font-black leading-none">
                  {size}x{size}
                </p>
              </div>
            </div>
          </div>

          <div className="play-stage-panel relative z-10">
            <CubeScene />
          </div>
        </section>
        <ResultDialog />
      </section>
    </main>
  );
}
