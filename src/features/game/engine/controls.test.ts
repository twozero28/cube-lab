import { describe, expect, it } from "vitest";

import {
  getCameraNudge,
  getKeyboardTurn,
  getKeyboardTurnCommand,
  nudgeCameraFrame,
} from "./controls";

import type { CameraBasis, Move } from "./types";

const frontCameraBasis: CameraBasis = {
  right: { x: 1, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  front: { x: 0, y: 0, z: 1 },
};

function keyboardEvent(code: string, shiftKey = false) {
  return { code, shiftKey } as KeyboardEvent;
}

describe("keyboard cube controls", () => {
  it.each([
    ["KeyI", { axis: "y", layer: 1, direction: 1 }],
    ["KeyK", { axis: "y", layer: -1, direction: -1 }],
    ["KeyJ", { axis: "x", layer: -1, direction: -1 }],
    ["KeyL", { axis: "x", layer: 1, direction: 1 }],
    ["KeyO", { axis: "z", layer: 1, direction: 1 }],
    ["KeyU", { axis: "z", layer: -1, direction: -1 }],
  ] as const)("maps %s to a camera-relative 3x3 turn", (code, expected) => {
    expect(getKeyboardTurn(keyboardEvent(code), frontCameraBasis, 3)).toEqual(expected);
  });

  it("uses the outer half-layer for 2x2 turns", () => {
    expect(getKeyboardTurn(keyboardEvent("KeyL"), frontCameraBasis, 2)).toEqual({
      axis: "x",
      layer: 0.5,
      direction: 1,
    } satisfies Move);
  });

  it("reverses the same face turn when shift is held", () => {
    expect(getKeyboardTurn(keyboardEvent("KeyO", true), frontCameraBasis, 3)).toEqual({
      axis: "z",
      layer: 1,
      direction: -1,
    } satisfies Move);
  });

  it("tracks the camera basis as the visible face changes", () => {
    const rightSideCameraBasis: CameraBasis = {
      right: { x: 0, y: 0, z: -1 },
      up: { x: 0, y: 1, z: 0 },
      front: { x: 1, y: 0, z: 0 },
    };

    expect(getKeyboardTurn(keyboardEvent("KeyO"), rightSideCameraBasis, 3)).toEqual({
      axis: "x",
      layer: 1,
      direction: 1,
    } satisfies Move);
  });

  it("ignores non-turn keys", () => {
    expect(getKeyboardTurnCommand(keyboardEvent("KeyA"))).toBeNull();
    expect(getKeyboardTurn(keyboardEvent("Space"), frontCameraBasis, 3)).toBeNull();
  });
});

describe("keyboard camera controls", () => {
  it.each([
    ["KeyW", "up"],
    ["ArrowUp", "up"],
    ["KeyS", "down"],
    ["ArrowDown", "down"],
    ["KeyA", "left"],
    ["ArrowLeft", "left"],
    ["KeyD", "right"],
    ["ArrowRight", "right"],
  ] as const)("maps %s to a camera nudge", (code, expected) => {
    expect(getCameraNudge(keyboardEvent(code))).toBe(expected);
  });

  it("ignores cube turn keys for camera nudges", () => {
    expect(getCameraNudge(keyboardEvent("KeyI"))).toBeNull();
  });

  it("keeps camera offset length while rotating horizontally", () => {
    const next = nudgeCameraFrame({
      offset: { x: 0, y: 0, z: 6 },
      up: { x: 0, y: 1, z: 0 },
      nudges: new Set(["right"]),
      delta: 1,
    });

    expect(vectorLength(next.offset)).toBeCloseTo(6);
    expect(next.offset.x).toBeGreaterThan(0);
  });

  it("rotates past the top pole without losing a usable up vector", () => {
    const next = nudgeCameraFrame({
      offset: { x: 0, y: 6, z: 0 },
      up: { x: 0, y: 0, z: -1 },
      nudges: new Set(["up"]),
      delta: 1,
    });

    expect(vectorLength(next.offset)).toBeCloseTo(6);
    expect(Math.abs(dot(normalize(next.offset), normalize(next.up)))).toBeLessThan(0.001);
    expect(Number.isFinite(next.offset.x + next.offset.y + next.offset.z)).toBe(true);
  });
});

function vectorLength(vector: { x: number; y: number; z: number }) {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function normalize(vector: { x: number; y: number; z: number }) {
  const length = vectorLength(vector);

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function dot(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
