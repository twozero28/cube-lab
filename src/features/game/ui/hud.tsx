import type { ReactNode } from "react";
import { Grid2x2, RotateCcw, Settings, Shuffle, Undo2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet";
import { useGameStore } from "../store/game-store";

export function GameHud() {
  const size = useGameStore((state) => state.size);
  const phase = useGameStore((state) => state.phase);
  const moveCount = useGameStore((state) => state.moveCount);
  const settings = useGameStore((state) => state.settings);
  const settingsOpen = useGameStore((state) => state.settingsOpen);
  const setSize = useGameStore((state) => state.setSize);
  const startScramble = useGameStore((state) => state.startScramble);
  const undoMove = useGameStore((state) => state.undoMove);
  const resetCube = useGameStore((state) => state.resetCube);
  const setSettingsOpen = useGameStore((state) => state.setSettingsOpen);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const activeMove = useGameStore((state) => state.activeMove);

  const isBusy = phase === "scrambling" || phase === "animating" || !!activeMove;

  return (
    <>
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between rounded-b-2xl border-b border-cyan-500/15 bg-cyan-950/60 px-6 py-4 shadow-[0_10px_30px_-10px_rgba(0,240,255,0.2)] backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <Grid2x2 className="size-5 text-cyan-400" />
          <span className="font-[var(--font-display)] text-xl font-bold uppercase tracking-tight text-cyan-400 [text-shadow:0_0_8px_rgba(0,240,255,0.8)]">
            Neon_Cube_Lab
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[var(--surface-container-low)] p-1">
            {[2, 3].map((value) => (
              <button
                key={value}
                type="button"
                className={
                  value === size
                    ? "rounded-lg bg-cyan-900/50 px-3 py-1 font-[var(--font-display)] text-[10px] font-bold uppercase text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                    : "px-3 py-1 font-[var(--font-display)] text-[10px] font-bold uppercase text-slate-400 transition-all hover:text-cyan-300"
                }
                onClick={() => setSize(value as 2 | 3)}
                disabled={isBusy}
              >
                {value}x{value}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Open settings"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full p-1 text-cyan-400 transition-all active:scale-95"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t border-fuchsia-500/20 bg-slate-900/60 px-4 pb-8 pt-4 shadow-[0_-10px_40px_rgba(255,0,255,0.1)] backdrop-blur-xl">
        <BottomAction
          label="Scramble"
          icon={<Shuffle className="size-5" />}
          onClick={startScramble}
          disabled={phase === "scrambling" || phase === "animating"}
        />
        <BottomAction
          label="Undo"
          icon={<Undo2 className="size-5" />}
          onClick={undoMove}
          disabled={phase === "scrambling" || phase === "animating" || moveCount === 0}
        />
        <BottomAction
          label="Reset"
          icon={<RotateCcw className="size-5" />}
          onClick={resetCube}
          disabled={phase === "scrambling" || phase === "animating"}
        />
        <BottomAction
          label="Settings"
          icon={<Settings className="size-5 text-[var(--primary-foreground)]" />}
          active
          onClick={() => setSettingsOpen(true)}
        />
      </nav>

      <div className="fixed bottom-0 left-1/2 z-[60] h-1 w-32 -translate-x-1/2 bg-[var(--primary)]/20 blur-xl" />

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Laboratory settings</SheetTitle>
            <SheetDescription>
              Tune touch precision and feedback so the stage behaves like the Stitch control deck.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 grid gap-4">
            <SettingRow
              label="Drag threshold"
              value={`${settings.dragThreshold}px`}
              control={
                <input
                  type="range"
                  min={12}
                  max={18}
                  value={settings.dragThreshold}
                  onChange={(event) =>
                    updateSettings({ dragThreshold: Number(event.target.value) })
                  }
                  className="w-full accent-[var(--primary)]"
                />
              }
            />
            <SettingRow
              label="Haptics"
              value={settings.hapticsEnabled ? "Enabled" : "Disabled"}
              control={
                <Button
                  variant={settings.hapticsEnabled ? "default" : "secondary"}
                  size="sm"
                  onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                >
                  {settings.hapticsEnabled ? "Enabled" : "Disabled"}
                </Button>
              }
            />
            <SettingRow
              label="Sound"
              value={settings.soundEnabled ? "Enabled" : "Disabled"}
              control={
                <Button
                  variant={settings.soundEnabled ? "default" : "secondary"}
                  size="sm"
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                >
                  {settings.soundEnabled ? "Enabled" : "Disabled"}
                </Button>
              }
            />
            <Link
              to="/"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[rgba(35,35,65,0.72)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--outline-variant)] transition hover:text-[var(--text-primary)]"
            >
              Return to landing
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function BottomAction({
  label,
  icon,
  onClick,
  disabled,
  active = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <div className="group flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={
          active
            ? "flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 p-3 shadow-[0_0_15px_#00F0FF] transition-transform duration-200 active:scale-90 disabled:opacity-40"
            : "flex items-center justify-center p-3 text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-fuchsia-400 active:scale-90 disabled:opacity-40"
        }
      >
        {icon}
      </button>
      <span
        className={
          active
            ? "font-[var(--font-display)] text-[8px] font-bold uppercase text-cyan-400"
            : "font-[var(--font-display)] text-[8px] font-bold uppercase text-slate-500 transition-colors group-hover:text-fuchsia-400"
        }
      >
        {label}
      </span>
    </div>
  );
}

function SettingRow({
  label,
  value,
  control,
}: {
  label: string;
  value: string;
  control: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[rgba(35,35,65,0.58)] p-4 shadow-[inset_0_0_0_1px_var(--outline-variant)]">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
          <p className="text-xs text-[var(--text-muted)]">{value}</p>
        </div>
      </div>
      {control}
    </div>
  );
}
