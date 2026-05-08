import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Github, Grid2x2, Sparkles } from "lucide-react";

import { Button } from "#/components/ui/button";

const LandingCubePreview = lazy(async () => {
  const module = await import("./scene/landing-cube-preview");
  return { default: module.LandingCubePreview };
});

export function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-cyan-400/20 bg-slate-950/80 px-6 py-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <Grid2x2 className="size-5 text-cyan-400" />
          <span className="font-[var(--font-display)] text-xl font-bold uppercase tracking-[0.2em] text-cyan-400 [text-shadow:0_0_8px_rgba(0,240,255,0.6)]">
            Neon_Cube_Lab
          </span>
        </div>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.18)]"
        >
          <a
            href="https://github.com/twozero28/cube-lab"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
          >
            <Github className="size-5" />
          </a>
        </Button>
      </header>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-fuchsia-500/10 blur-[100px]" />
        <div className="scanline-overlay absolute inset-0" />
      </div>

      <section className="relative z-10 flex min-h-[calc(100dvh-9rem)] flex-col items-center justify-center px-6 pb-36 pt-10 text-center">
        <div className="relative mb-10 h-64 w-64 md:h-80 md:w-80">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 via-transparent to-fuchsia-500/10 blur-[80px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            {mounted ? (
              <Suspense fallback={<StaticCubeFallback />}>
                <LandingCubePreview />
              </Suspense>
            ) : (
              <StaticCubeFallback />
            )}
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-slate-900/60 px-3 py-1.5 backdrop-blur-md">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-[var(--font-display)] text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              System_Ready
            </span>
          </div>

          <h1 className="font-[var(--font-display)] text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            NEON_
            <span className="text-cyan-400 [text-shadow:0_0_12px_rgba(0,240,255,0.6)]">CUBE</span>
            _LAB
          </h1>

          <p className="mx-auto max-w-md font-[var(--font-display)] text-xs uppercase tracking-[0.15em] text-slate-400 md:text-sm">
            Decipher the <span className="text-cyan-400">Kinetic Chronosphere</span>.
            <br />
            Solve the cube. Save the sequence.
          </p>

          <div className="pt-8">
            <Button
              asChild
              variant="outline"
              className="group relative min-h-14 rounded-md border-cyan-400/40 bg-cyan-500/10 px-10 py-4 font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            >
              <Link to="/play">
                Initiate protocol
                <Sparkles className="size-4 transition-transform group-hover:scale-110" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function StaticCubeFallback() {
  const tiles = [
    "#3f8cff",
    "#f5f7fb",
    "#7de7c2",
    "#f6d365",
    "#ff5d8f",
    "#ff8a38",
    "#32c98f",
    "#3f8cff",
    "#f6d365",
  ];

  return (
    <div className="landing-cube-fallback" aria-hidden="true">
      <div className="landing-cube-fallback-grid">
        {tiles.map((color, index) => (
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
