import type { ReactNode } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw, Settings, Shuffle, Undo2 } from "lucide-react";
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
  const setResultOpen = useGameStore((state) => state.setResultOpen);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const activeMove = useGameStore((state) => state.activeMove);

  const isBusy = phase === "scrambling" || phase === "animating" || !!activeMove;

  return (
    <>
      <header className="relative z-20 flex items-center justify-between">
        <Link to="/" className="soft-button grid size-12 place-items-center" aria-label="Back home">
          <ArrowLeft className="size-5 text-[var(--text-secondary)]" />
        </Link>

        <div className="soft-button flex items-center px-4 py-2">
          <select
            aria-label="Cube size"
            value={size}
            onChange={(event) => setSize(Number(event.target.value) as 2 | 3)}
            disabled={isBusy}
            className="bg-transparent text-base font-black text-[var(--text-primary)] outline-none"
          >
            <option value={3}>3x3</option>
            <option value={2}>2x2</option>
          </select>
        </div>

        <button
          type="button"
          aria-label="Open settings"
          onClick={() => setSettingsOpen(true)}
          className="soft-button grid size-12 place-items-center"
        >
          <Settings className="size-5 text-[var(--text-secondary)]" />
        </button>
      </header>

      <nav className="safe-bottom absolute inset-x-0 bottom-0 z-30 flex gap-3 px-6 pt-3">
        <BottomAction
          label="Undo"
          icon={<Undo2 className="size-6" />}
          onClick={undoMove}
          disabled={isBusy || moveCount === 0}
        />
        <BottomAction
          label={phase === "idle" ? "Scramble" : "Reset"}
          icon={
            phase === "idle" ? <Shuffle className="size-6" /> : <RotateCcw className="size-6" />
          }
          onClick={phase === "idle" ? startScramble : resetCube}
          disabled={isBusy}
        />
        <BottomAction
          label="Done"
          icon={<CheckCircle2 className="size-6" />}
          onClick={() => setResultOpen(true)}
          disabled={phase !== "solved"}
          primary
        />
      </nav>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Keep touch feedback comfortable for short practice sessions.
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
                  className="w-full accent-[var(--sage)]"
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
              className="soft-button mt-2 inline-flex items-center justify-center px-4 py-3 text-sm font-extrabold text-[var(--text-secondary)]"
            >
              Back to home
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
  primary = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bottom-control ${primary ? "is-primary" : ""}`}
    >
      {icon}
      <span className="text-base font-extrabold">{label}</span>
    </button>
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
    <div className="paper-card p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-[var(--text-primary)]">{label}</p>
          <p className="text-xs font-semibold text-[var(--text-muted)]">{value}</p>
        </div>
      </div>
      {control}
    </div>
  );
}
