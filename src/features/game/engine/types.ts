export type CubeSize = 2 | 3;
export type Face = "U" | "D" | "L" | "R" | "F" | "B";
export type Axis = "x" | "y" | "z";
export type LayerIndex = number;
export type TurnDirection = 1 | -1;
export type GamePhase = "idle" | "scrambling" | "interactive" | "animating" | "paused" | "solved";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type StickerMap = Partial<Record<Face, string>>;

export interface CubieState {
  id: string;
  position: Vec3;
  stickers: StickerMap;
}

export interface CubeState {
  size: CubeSize;
  cubies: CubieState[];
}

export interface Move {
  axis: Axis;
  layer: LayerIndex;
  direction: TurnDirection;
}

export interface CubeRecord {
  bestTimeMs: number | null;
  bestMoves: number | null;
}
