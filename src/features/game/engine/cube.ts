import type {
  Axis,
  CubeSize,
  CubeState,
  CubieState,
  Face,
  Move,
  StickerMap,
  TurnDirection,
  Vec3,
} from "./types";

const FACE_VECTORS: Record<Face, Vec3> = {
  U: { x: 0, y: 1, z: 0 },
  D: { x: 0, y: -1, z: 0 },
  L: { x: -1, y: 0, z: 0 },
  R: { x: 1, y: 0, z: 0 },
  F: { x: 0, y: 0, z: 1 },
  B: { x: 0, y: 0, z: -1 },
};

const VECTOR_TO_FACE = new Map<string, Face>(
  Object.entries(FACE_VECTORS).map(([face, value]) => [serializeVector(value), face as Face]),
);

export const FACE_COLORS: Record<Face, string> = {
  U: "#f5f7fb",
  D: "#f6d365",
  L: "#3f8cff",
  R: "#ff6d38",
  F: "#32c98f",
  B: "#ff5d8f",
};

export function createSolvedCube(size: CubeSize): CubeState {
  const cubies: CubieState[] = [];
  const coordinates = getCoordinates(size);
  const max = coordinates[coordinates.length - 1];
  const min = coordinates[0];

  coordinates.forEach((x) => {
    coordinates.forEach((y) => {
      coordinates.forEach((z) => {
        if (isInternalCubie(x, y, z, min, max)) {
          return;
        }

        const stickers: StickerMap = {};

        if (y === max) stickers.U = FACE_COLORS.U;
        if (y === min) stickers.D = FACE_COLORS.D;
        if (x === min) stickers.L = FACE_COLORS.L;
        if (x === max) stickers.R = FACE_COLORS.R;
        if (z === max) stickers.F = FACE_COLORS.F;
        if (z === min) stickers.B = FACE_COLORS.B;

        cubies.push({
          id: `${x}:${y}:${z}`,
          position: { x, y, z },
          stickers,
        });
      });
    });
  });

  return {
    size,
    cubies,
  };
}

export function cloneCube(state: CubeState): CubeState {
  return {
    size: state.size,
    cubies: state.cubies.map((cubie) => ({
      ...cubie,
      position: { ...cubie.position },
      stickers: { ...cubie.stickers },
    })),
  };
}

export function applyMove(state: CubeState, move: Move): CubeState {
  const next = cloneCube(state);

  next.cubies = next.cubies.map((cubie) => {
    if (cubie.position[move.axis] !== move.layer) {
      return cubie;
    }

    const nextPosition = rotateVector(cubie.position, move.axis, move.direction);
    const nextStickers: StickerMap = {};

    Object.entries(cubie.stickers).forEach(([face, color]) => {
      if (!color) return;

      const nextFaceVector = rotateVector(FACE_VECTORS[face as Face], move.axis, move.direction);
      const nextFace = VECTOR_TO_FACE.get(serializeVector(nextFaceVector));

      if (nextFace) {
        nextStickers[nextFace] = color;
      }
    });

    return {
      ...cubie,
      position: nextPosition,
      stickers: nextStickers,
    };
  });

  return next;
}

export function invertMove(move: Move): Move {
  return {
    ...move,
    direction: move.direction === 1 ? -1 : 1,
  };
}

export function isSolved(state: CubeState): boolean {
  const colorsByFace = new Map<Face, Set<string>>();

  state.cubies.forEach((cubie) => {
    Object.entries(cubie.stickers).forEach(([face, color]) => {
      if (!color) return;

      const current = colorsByFace.get(face as Face) ?? new Set<string>();
      current.add(color);
      colorsByFace.set(face as Face, current);
    });
  });

  return Array.from(colorsByFace.values()).every((set) => set.size === 1);
}

export function getScrambleMoves(size: CubeSize, length = size === 2 ? 12 : 20) {
  const coordinates = getCoordinates(size);
  const outerLayers = [coordinates[0], coordinates[coordinates.length - 1]];
  const axes: Axis[] = ["x", "y", "z"];
  const scramble: Move[] = [];

  while (scramble.length < length) {
    const axis = axes[Math.floor(Math.random() * axes.length)];
    const layer = outerLayers[Math.floor(Math.random() * outerLayers.length)] ?? outerLayers[0];
    const direction: TurnDirection = Math.random() > 0.5 ? 1 : -1;
    const previous = scramble.at(-1);

    if (
      previous &&
      previous.axis === axis &&
      previous.layer === layer &&
      previous.direction === direction
    ) {
      continue;
    }

    scramble.push({ axis, layer, direction });
  }

  return scramble;
}

export function moveToLabel(move: Move): string {
  const layerLabel =
    move.axis === "x"
      ? move.layer > 0
        ? "R"
        : move.layer < 0
          ? "L"
          : "M"
      : move.axis === "y"
        ? move.layer > 0
          ? "U"
          : move.layer < 0
            ? "D"
            : "E"
        : move.layer > 0
          ? "F"
          : move.layer < 0
            ? "B"
            : "S";

  return `${layerLabel}${move.direction === -1 ? "'" : ""}`;
}

export function getCoordinates(size: CubeSize): number[] {
  return size === 2 ? [-0.5, 0.5] : [-1, 0, 1];
}

export function getWorldPosition(position: Vec3, size: CubeSize) {
  const spacing = size === 2 ? 0.86 : 0.8;
  return [position.x * spacing, position.y * spacing, position.z * spacing] as const;
}

export function getCubieDimension(size: CubeSize) {
  return size === 2 ? 0.78 : 0.68;
}

export function rotateVector<T extends Vec3>(vector: T, axis: Axis, direction: TurnDirection): T {
  const { x, y, z } = vector;

  if (axis === "x") {
    return direction === 1 ? ({ x, y: -z, z: y } as T) : ({ x, y: z, z: -y } as T);
  }

  if (axis === "y") {
    return direction === 1 ? ({ x: z, y, z: -x } as T) : ({ x: -z, y, z: x } as T);
  }

  return direction === 1 ? ({ x: -y, y: x, z } as T) : ({ x: y, y: -x, z } as T);
}

function isInternalCubie(x: number, y: number, z: number, min: number, max: number) {
  return x > min && x < max && y > min && y < max && z > min && z < max;
}

function serializeVector(vector: Vec3) {
  return `${vector.x}:${vector.y}:${vector.z}`;
}
