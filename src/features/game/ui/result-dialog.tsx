import { Crown, RotateCcw, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { useGameStore } from "../store/game-store";
import { formatElapsed } from "./format";

const resultTiles = [
  { color: "var(--cube-red)", left: "18%", top: "-3%", rotate: "-10deg" },
  { color: "var(--cube-green)", left: "34%", top: "5%", rotate: "5deg" },
  { color: "var(--cube-yellow)", left: "8%", top: "11%", rotate: "26deg" },
  { color: "var(--cube-blue)", right: "18%", top: "5%", rotate: "-8deg" },
  { color: "var(--cube-orange)", right: "6%", top: "14%", rotate: "20deg" },
];

export function ResultDialog() {
  const resultOpen = useGameStore((state) => state.resultOpen);
  const setResultOpen = useGameStore((state) => state.setResultOpen);
  const startScramble = useGameStore((state) => state.startScramble);
  const elapsedMs = useGameStore((state) => state.elapsedMs);
  const moveCount = useGameStore((state) => state.moveCount);
  const size = useGameStore((state) => state.size);
  const records = useGameStore((state) => state.records);
  const sessionResults = useGameStore((state) => state.sessionResults);

  const bestTime = records[size].bestTimeMs;
  const delta = bestTime === null ? 0 : elapsedMs - bestTime;
  const average =
    sessionResults.length > 0
      ? sessionResults.reduce((total, result) => total + (result.bestTimeMs ?? 0), 0) /
        sessionResults.length
      : elapsedMs;

  return (
    <Dialog open={resultOpen} onOpenChange={setResultOpen}>
      <DialogContent className="result-dialog">
        <div className="relative h-14" aria-hidden="true">
          {resultTiles.map((tile) => (
            <span
              key={`${tile.color}-${tile.left ?? tile.right}`}
              className="confetti-tile"
              style={
                {
                  background: tile.color,
                  left: tile.left,
                  right: tile.right,
                  top: tile.top,
                  "--rotate": tile.rotate,
                } as CSSProperties
              }
            />
          ))}
          <div className="absolute left-1/2 top-4 grid size-12 -translate-x-1/2 place-items-center rounded-[0.7rem] bg-[#24211d] shadow-[0_10px_18px_rgba(36,33,29,0.2)]">
            <Crown className="size-6 text-[var(--cube-yellow)]" />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-[2rem] text-[var(--sage-dark)]">Solved</DialogTitle>
        </DialogHeader>

        <div className="result-card mt-4 p-5">
          <p className="timer-number text-[4rem] font-black leading-none tracking-[-0.08em]">
            {formatElapsed(elapsedMs)}
          </p>
          <p className="mt-3 text-base font-extrabold">{moveCount} moves</p>

          <div className="my-5 h-px bg-[var(--border)]" />

          <div className="flex items-center justify-between gap-4 text-left">
            <span className="text-base font-bold text-[var(--text-primary)]">Best time</span>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <strong className="timer-number text-xl font-black">
                  {bestTime === null ? formatElapsed(elapsedMs) : formatElapsed(bestTime)}
                </strong>
                <Crown className="size-5 text-[var(--gold)]" />
              </div>
              <p
                className={`text-sm font-extrabold ${
                  delta > 0 ? "text-[var(--destructive)]" : "text-[var(--sage-dark)]"
                }`}
              >
                {delta > 0 ? `+${formatElapsed(delta)}` : "Best run"}
              </p>
            </div>
          </div>
        </div>

        <div className="result-card mt-4 p-4 text-left">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-extrabold">Session average ({sessionResults.length || 1})</span>
            <strong className="timer-number">{formatElapsed(average)}</strong>
          </div>
          <div className="grid gap-2">
            {(sessionResults.length
              ? sessionResults
              : [{ bestTimeMs: elapsedMs, bestMoves: moveCount }]
            )
              .slice(0, 5)
              .map((result, index) => (
                <div key={`${result.bestTimeMs}-${index}`} className="result-stat-tile">
                  <span>{index + 1}</span>
                  <strong className="timer-number">
                    {formatElapsed(result.bestTimeMs ?? elapsedMs)}
                  </strong>
                  {index === 0 ? (
                    <Star className="size-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ) : null}
                </div>
              ))}
          </div>
        </div>

        <DialogFooter className="sm:flex-col sm:justify-start">
          <Button
            className="w-full text-lg"
            onClick={() => {
              setResultOpen(false);
              startScramble();
            }}
          >
            <RotateCcw className="size-5" />
            Try again
          </Button>
          <Button asChild variant="ghost" className="w-full text-[var(--sage-dark)]">
            <Link to="/" onClick={() => setResultOpen(false)}>
              Back to home
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
