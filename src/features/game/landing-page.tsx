import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Box, Github, Settings, Target } from "lucide-react";

import { Button } from "#/components/ui/button";
import { useGameStore } from "./store/game-store";
import { formatElapsed } from "./ui/format";

const LandingCubePreview = lazy(async () => {
  const module = await import("./scene/landing-cube-preview");
  return { default: module.LandingCubePreview };
});

const cubeTiles = [
  "var(--cube-blue)",
  "var(--cube-red)",
  "var(--cube-yellow)",
  "var(--cube-green)",
  "var(--cube-orange)",
  "#fffaf1",
  "var(--cube-blue)",
  "var(--cube-yellow)",
  "var(--cube-red)",
];

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const size = useGameStore((state) => state.size);
  const records = useGameStore((state) => state.records);
  const setSize = useGameStore((state) => state.setSize);

  const bestTime = records[size].bestTimeMs;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="app-canvas">
      <section className="phone-shell safe-top safe-bottom px-6 md:px-10 lg:px-12">
        <header className="relative z-10 flex items-center justify-between">
          <div className="soft-button grid size-12 place-items-center">
            <Box className="size-5 text-[var(--sage-dark)]" />
          </div>

          <a
            href="https://github.com/twozero28/cube-lab"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
            className="soft-button grid size-12 place-items-center text-[var(--text-secondary)]"
          >
            <Github className="size-5" />
          </a>
        </header>

        <div className="home-layout">
          <section className="home-copy text-center md:text-left">
            <h1 className="text-[2.75rem] font-black leading-none tracking-[-0.055em] text-[var(--text-primary)] md:text-6xl lg:text-7xl">
              Cube Desk
            </h1>
            <p className="mt-2 text-lg font-semibold text-[var(--sage-dark)] md:text-2xl">
              Your desk. Your cube.
            </p>
            <p className="mx-auto mt-4 hidden max-w-[32rem] text-base leading-7 text-[var(--text-secondary)] md:mx-0 md:block">
              A quiet cube puzzle timer for short practice sessions, warm desk breaks, and one more
              solve before you close the browser.
            </p>
          </section>

          <section className="home-visual">
            <div className="desk-plant" aria-hidden="true" />
            <div className="desk-cup" aria-hidden="true" />
            <div className="home-cube-frame">
              {mounted ? (
                <Suspense fallback={<StaticCubeFallback />}>
                  <LandingCubePreview />
                </Suspense>
              ) : (
                <StaticCubeFallback />
              )}
            </div>
          </section>

          <div className="home-actions">
            <Button
              asChild
              size="lg"
              className="relative z-10 min-h-16 w-full text-xl md:w-auto md:px-8"
            >
              <Link to="/play">
                <Box className="size-6" />
                Start solving
              </Link>
            </Button>

            <div className="relative z-10 mt-5 grid grid-cols-3 gap-4 md:max-w-[30rem]">
              <ModeTile
                label="3x3"
                active={size === 3}
                onClick={() => setSize(3)}
                colors={cubeTiles}
              />
              <ModeTile
                label="2x2"
                active={size === 2}
                onClick={() => setSize(2)}
                colors={cubeTiles.slice().reverse()}
              />
              <ModeTile
                label="Practice"
                active={false}
                onClick={() => setSize(size)}
                icon={<Target className="size-8 text-[var(--gold)]" />}
              />
            </div>

            <section className="paper-card relative z-10 mt-5 p-5 md:max-w-[30rem]">
              <div className="flex items-end justify-between gap-4">
                <div className="text-left">
                  <p className="text-sm font-bold text-[var(--sage-dark)]">
                    Best time ({size}x{size})
                  </p>
                  <p
                    className={
                      bestTime === null
                        ? "mt-2 text-3xl font-black leading-none tracking-[-0.03em]"
                        : "timer-number mt-2 text-4xl font-black leading-none"
                    }
                  >
                    {bestTime === null ? "No record" : formatElapsed(bestTime)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {bestTime === null
                      ? "Start a solve to set your first record."
                      : "Personal best"}
                  </p>
                </div>
                <div className="flex h-16 items-end gap-1 border-l border-[var(--border)] pl-5">
                  {[0.38, 0.56, 0.74, 0.92].map((height) => (
                    <span
                      key={height}
                      className="w-2.5 rounded-t-sm bg-[var(--sage)] opacity-70"
                      style={{ height: `${height * 3.2}rem` }}
                      aria-hidden="true"
                    />
                  ))}
                  <Settings
                    className="ml-2 size-5 self-center text-[var(--gold)]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function ModeTile({
  label,
  active,
  onClick,
  colors,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  colors?: string[];
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mode-tile ${active ? "is-active" : ""}`}
      aria-pressed={active}
    >
      {colors ? (
        <span className="cube-glyph" aria-hidden="true">
          {colors.map((color, index) => (
            <span key={`${color}-${index}`} style={{ background: color }} />
          ))}
        </span>
      ) : (
        icon
      )}
      <span className="text-lg font-black">{label}</span>
    </button>
  );
}

function StaticCubeFallback() {
  return (
    <div className="landing-cube-fallback" aria-hidden="true">
      <div className="landing-cube-fallback-grid">
        {cubeTiles.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className="landing-cube-fallback-tile"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
