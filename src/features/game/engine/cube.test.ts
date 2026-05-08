import { describe, expect, it } from "vitest";

import { applyMove, createSolvedCube, getScrambleMoves, invertMove, isSolved } from "./cube";

describe("cube engine", () => {
  it.each([2, 3] as const)("%ix%i inverse moves restore solved state", (size) => {
    const cube = createSolvedCube(size);
    const move =
      size === 2
        ? { axis: "x" as const, layer: 0.5, direction: 1 as const }
        : { axis: "y" as const, layer: 0, direction: -1 as const };

    const next = applyMove(cube, move);
    const restored = applyMove(next, invertMove(move));

    expect(isSolved(next)).toBe(false);
    expect(isSolved(restored)).toBe(true);
  });

  it.each([2, 3] as const)("%ix%i scramble can be reversed", (size) => {
    const cube = createSolvedCube(size);
    const scramble = getScrambleMoves(size, 8);
    const scrambled = scramble.reduce((state, move) => applyMove(state, move), cube);
    const restored = [...scramble]
      .reverse()
      .reduce((state, move) => applyMove(state, invertMove(move)), scrambled);

    expect(isSolved(scrambled)).toBe(false);
    expect(isSolved(restored)).toBe(true);
  });
});
