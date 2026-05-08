import { Trophy } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { useGameStore } from "../store/game-store";
import { formatElapsed } from "./format";

export function ResultDialog() {
  const resultOpen = useGameStore((state) => state.resultOpen);
  const setResultOpen = useGameStore((state) => state.setResultOpen);
  const startScramble = useGameStore((state) => state.startScramble);
  const elapsedMs = useGameStore((state) => state.elapsedMs);
  const moveCount = useGameStore((state) => state.moveCount);
  const size = useGameStore((state) => state.size);

  return (
    <Dialog open={resultOpen} onOpenChange={setResultOpen}>
      <DialogContent className="result-dialog">
        <DialogHeader>
          <Badge className="w-fit">Solved</Badge>
          <div className="result-dialog-icon">
            <Trophy className="size-7" />
          </div>
          <DialogTitle>
            {size}x{size} cube alignment complete
          </DialogTitle>
          <DialogDescription>
            The chamber stayed clear, the telemetry stayed live, and this session closed with a
            clean solve.
          </DialogDescription>
        </DialogHeader>
        <div className="result-grid">
          <StatTile label="Elapsed time" value={formatElapsed(elapsedMs)} />
          <StatTile label="Move count" value={`${moveCount}`} />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setResultOpen(false)}>
            Review cube
          </Button>
          <Button
            onClick={() => {
              setResultOpen(false);
              startScramble();
            }}
          >
            Run again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="result-stat-tile">
      <span className="result-stat-label">{label}</span>
      <strong className="result-stat-value">{value}</strong>
    </div>
  );
}
