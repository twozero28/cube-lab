import type { ReactNode } from "react";
import { ArrowLeft, Play, RotateCcw, Settings, Undo2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
          label={phase === "idle" ? "Start" : "Reset"}
          icon={phase === "idle" ? <Play className="size-6" /> : <RotateCcw className="size-6" />}
          onClick={phase === "idle" ? startScramble : resetCube}
          disabled={isBusy}
          primary={phase === "idle"}
        />
      </nav>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Tune the controls for quick practice.</SheetDescription>
          </SheetHeader>
          <div className="settings-panel mt-5">
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
                <button
                  type="button"
                  aria-pressed={settings.hapticsEnabled}
                  onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                  className={`setting-toggle ${settings.hapticsEnabled ? "is-active" : ""}`}
                >
                  {settings.hapticsEnabled ? "Enabled" : "Disabled"}
                </button>
              }
            />
            <SettingRow
              label="Sound"
              value={settings.soundEnabled ? "Enabled" : "Disabled"}
              control={
                <button
                  type="button"
                  aria-pressed={settings.soundEnabled}
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`setting-toggle ${settings.soundEnabled ? "is-active" : ""}`}
                >
                  {settings.soundEnabled ? "Enabled" : "Disabled"}
                </button>
              }
            />
            <details className="keyboard-help-panel" open>
              <summary>
                <span>Desktop keyboard controls</span>
                <small>Current view faces</small>
              </summary>
              <div className="keyboard-help mt-3">
                <KeyboardHelpRow label="Camera" keys="W/A/S/D" detail="rotate view" />
                <KeyboardHelpRow label="Top / Bottom" keys="I / K" detail="visible faces" />
                <KeyboardHelpRow label="Left / Right" keys="J / L" detail="visible faces" />
                <KeyboardHelpRow label="Back / Front" keys="U / O" detail="visible faces" />
                <KeyboardHelpRow label="Reverse" keys="Shift" detail="opposite turn" />
              </div>
            </details>
            <Link to="/" className="settings-home-link">
              Back to home
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function KeyboardHelpRow({ label, keys, detail }: { label: string; keys: string; detail: string }) {
  return (
    <div className="keyboard-help-row">
      <span className="keyboard-help-label">{label}</span>
      <kbd>{keys}</kbd>
      <span className="keyboard-help-detail">{detail}</span>
    </div>
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
    <div className="setting-row">
      <div className="setting-row-copy">
        <div>
          <p>{label}</p>
          <span>{value}</span>
        </div>
      </div>
      <div className="setting-row-control">{control}</div>
    </div>
  );
}
