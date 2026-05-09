import type {
  Axis,
  CameraBasis,
  CameraNudgeCommand,
  CubeSize,
  KeyboardTurnCommand,
  Move,
  TurnDirection,
  Vec3,
  ViewFaceCommand,
} from "./types";

const TURN_KEYS: Record<string, ViewFaceCommand> = {
  KeyI: "top",
  KeyK: "bottom",
  KeyJ: "left",
  KeyL: "right",
  KeyO: "front",
  KeyU: "back",
};

const CAMERA_KEYS: Record<string, CameraNudgeCommand> = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

const CAMERA_KEY_ROTATE_SPEED = 1.8;

export function getKeyboardTurn(
  event: Pick<KeyboardEvent, "code" | "shiftKey">,
  cameraBasis: CameraBasis,
  size: CubeSize,
): Move | null {
  const command = getKeyboardTurnCommand(event);

  if (!command) {
    return null;
  }

  return viewFaceCommandToMove(command, cameraBasis, size);
}

export function getKeyboardTurnCommand(
  event: Pick<KeyboardEvent, "code" | "shiftKey">,
): KeyboardTurnCommand | null {
  const face = TURN_KEYS[event.code];

  if (!face) {
    return null;
  }

  return {
    face,
    clockwise: !event.shiftKey,
  };
}

export function getCameraNudge(event: Pick<KeyboardEvent, "code">): CameraNudgeCommand | null {
  return CAMERA_KEYS[event.code] ?? null;
}

export function nudgeCameraFrame({
  offset,
  up,
  nudges,
  delta,
}: {
  offset: Vec3;
  up: Vec3;
  nudges: ReadonlySet<CameraNudgeCommand>;
  delta: number;
}) {
  const angularStep = delta * CAMERA_KEY_ROTATE_SPEED;
  let nextOffset = offset;
  let nextUp = normalizeVector(up);

  if (nudges.has("left")) {
    nextOffset = rotateAroundAxis(nextOffset, { x: 0, y: 1, z: 0 }, -angularStep);
    nextUp = rotateAroundAxis(nextUp, { x: 0, y: 1, z: 0 }, -angularStep);
  }

  if (nudges.has("right")) {
    nextOffset = rotateAroundAxis(nextOffset, { x: 0, y: 1, z: 0 }, angularStep);
    nextUp = rotateAroundAxis(nextUp, { x: 0, y: 1, z: 0 }, angularStep);
  }

  const viewDirection = normalizeVector(scaleVector(nextOffset, -1));
  const cameraRight = normalizeVector(crossVector(viewDirection, nextUp));

  if (nudges.has("up")) {
    nextOffset = rotateAroundAxis(nextOffset, cameraRight, angularStep);
    nextUp = rotateAroundAxis(nextUp, cameraRight, angularStep);
  }

  if (nudges.has("down")) {
    nextOffset = rotateAroundAxis(nextOffset, cameraRight, -angularStep);
    nextUp = rotateAroundAxis(nextUp, cameraRight, -angularStep);
  }

  return {
    offset: nextOffset,
    up: normalizeVector(nextUp),
  };
}

export function viewFaceCommandToMove(
  command: KeyboardTurnCommand,
  cameraBasis: CameraBasis,
  size: CubeSize,
): Move {
  const normal = getViewFaceNormal(command.face, cameraBasis);
  const { axis, sign } = getDominantAxis(normal);
  const layer = sign * (size === 2 ? 0.5 : 1);
  const direction = (sign * (command.clockwise ? 1 : -1)) as TurnDirection;

  return {
    axis,
    layer,
    direction,
  };
}

function getViewFaceNormal(face: ViewFaceCommand, cameraBasis: CameraBasis): Vec3 {
  if (face === "top") return cameraBasis.up;
  if (face === "bottom") return scaleVector(cameraBasis.up, -1);
  if (face === "right") return cameraBasis.right;
  if (face === "left") return scaleVector(cameraBasis.right, -1);
  if (face === "front") return cameraBasis.front;

  return scaleVector(cameraBasis.front, -1);
}

function getDominantAxis(vector: Vec3): { axis: Axis; sign: TurnDirection } {
  const entries = [
    ["x", vector.x],
    ["y", vector.y],
    ["z", vector.z],
  ] as const;
  const [axis, value] = entries.reduce((best, entry) =>
    Math.abs(entry[1]) > Math.abs(best[1]) ? entry : best,
  );

  return {
    axis,
    sign: value < 0 ? -1 : 1,
  };
}

function scaleVector(vector: Vec3, scale: number): Vec3 {
  return {
    x: vector.x * scale,
    y: vector.y * scale,
    z: vector.z * scale,
  };
}

function rotateAroundAxis(vector: Vec3, axis: Vec3, angle: number): Vec3 {
  const normalizedAxis = normalizeVector(axis);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const projection = dotVector(vector, normalizedAxis);
  const cross = crossVector(normalizedAxis, vector);

  return {
    x: vector.x * cos + cross.x * sin + normalizedAxis.x * projection * (1 - cos),
    y: vector.y * cos + cross.y * sin + normalizedAxis.y * projection * (1 - cos),
    z: vector.z * cos + cross.z * sin + normalizedAxis.z * projection * (1 - cos),
  };
}

function normalizeVector(vector: Vec3): Vec3 {
  const length = Math.hypot(vector.x, vector.y, vector.z);

  if (length === 0) {
    return { x: 0, y: 1, z: 0 };
  }

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function crossVector(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dotVector(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
