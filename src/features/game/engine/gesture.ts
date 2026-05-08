import { rotateVector } from "./cube";

import type { Axis, Face, Move, TurnDirection, Vec3 } from "./types";

const FACE_BASIS: Record<
  Face,
  {
    horizontal: Vec3;
    vertical: Vec3;
  }
> = {
  F: {
    horizontal: { x: 1, y: 0, z: 0 },
    vertical: { x: 0, y: 1, z: 0 },
  },
  B: {
    horizontal: { x: -1, y: 0, z: 0 },
    vertical: { x: 0, y: 1, z: 0 },
  },
  U: {
    horizontal: { x: 1, y: 0, z: 0 },
    vertical: { x: 0, y: 0, z: -1 },
  },
  D: {
    horizontal: { x: 1, y: 0, z: 0 },
    vertical: { x: 0, y: 0, z: 1 },
  },
  R: {
    horizontal: { x: 0, y: 0, z: -1 },
    vertical: { x: 0, y: 1, z: 0 },
  },
  L: {
    horizontal: { x: 0, y: 0, z: 1 },
    vertical: { x: 0, y: 1, z: 0 },
  },
};

export function deriveMoveIntent({
  face,
  cubiePosition,
  deltaX,
  deltaY,
}: {
  face: Face;
  cubiePosition: Vec3;
  deltaX: number;
  deltaY: number;
}): Move {
  const basis = FACE_BASIS[face];
  const horizontalDrag = Math.abs(deltaX) >= Math.abs(deltaY);
  const dragVector = horizontalDrag
    ? scaleVector(basis.horizontal, Math.sign(deltaX) || 1)
    : scaleVector(basis.vertical, -Math.sign(deltaY || 1));
  const axisVector = horizontalDrag ? basis.vertical : basis.horizontal;
  const axis = vectorToAxis(axisVector);
  const layer = cubiePosition[axis];

  const positiveProjection = getDragProjection({
    cubiePosition,
    axis,
    direction: 1,
    dragVector,
  });
  const negativeProjection = getDragProjection({
    cubiePosition,
    axis,
    direction: -1,
    dragVector,
  });
  const direction: TurnDirection = positiveProjection >= negativeProjection ? 1 : -1;

  return { axis, layer, direction };
}

function getDragProjection({
  cubiePosition,
  axis,
  direction,
  dragVector,
}: {
  cubiePosition: Vec3;
  axis: Axis;
  direction: TurnDirection;
  dragVector: Vec3;
}) {
  const nextPosition = rotateVector(cubiePosition, axis, direction);
  const movement = subtractVector(nextPosition, cubiePosition);
  return dot(movement, dragVector);
}

function vectorToAxis(vector: Vec3): Axis {
  if (vector.x !== 0) return "x";
  if (vector.y !== 0) return "y";
  return "z";
}

function scaleVector(vector: Vec3, scale: number): Vec3 {
  return { x: vector.x * scale, y: vector.y * scale, z: vector.z * scale };
}

function subtractVector(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
