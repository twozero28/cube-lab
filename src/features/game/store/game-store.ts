import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  applyMove,
  createSolvedCube,
  getScrambleMoves,
  invertMove,
  isSolved,
} from "../engine/cube";

import type { CubeRecord, CubeSize, CubeState, GamePhase, Move } from "../engine/types";

type ActiveMoveSource = "player" | "scramble" | "undo";

interface ActiveMove {
  move: Move;
  source: ActiveMoveSource;
}

interface SettingsState {
  dragThreshold: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

interface GameStoreState {
  size: CubeSize;
  cube: CubeState;
  phase: GamePhase;
  moveCount: number;
  elapsedMs: number;
  runStartedAt: number | null;
  history: Move[];
  activeMove: ActiveMove | null;
  moveQueue: ActiveMove[];
  settings: SettingsState;
  records: Record<CubeSize, CubeRecord>;
  settingsOpen: boolean;
  resultOpen: boolean;
  previewMove: Move | null;
  hoveredFace: { cubieId: string; face: string } | null;
  setSize: (size: CubeSize) => void;
  queueMove: (move: Move, source?: ActiveMoveSource) => void;
  startScramble: () => void;
  resetCube: () => void;
  undoMove: () => void;
  completeActiveMove: () => void;
  tickTimer: () => void;
  setSettingsOpen: (open: boolean) => void;
  setResultOpen: (open: boolean) => void;
  updateSettings: (patch: Partial<SettingsState>) => void;
  setPreviewMove: (move: Move | null) => void;
  setHoveredFace: (hover: { cubieId: string; face: string } | null) => void;
}

const defaultSettings: SettingsState = {
  dragThreshold: 14,
  soundEnabled: false,
  hapticsEnabled: true,
};

const defaultRecords: Record<CubeSize, CubeRecord> = {
  2: { bestTimeMs: null, bestMoves: null },
  3: { bestTimeMs: null, bestMoves: null },
};

function createInitialState(size: CubeSize) {
  return {
    size,
    cube: createSolvedCube(size),
    phase: "idle" as GamePhase,
    moveCount: 0,
    elapsedMs: 0,
    runStartedAt: null,
    history: [] as Move[],
    activeMove: null as ActiveMove | null,
    moveQueue: [] as ActiveMove[],
    settings: defaultSettings,
    records: defaultRecords,
    settingsOpen: false,
    resultOpen: false,
    previewMove: null as Move | null,
    hoveredFace: null as { cubieId: string; face: string } | null,
  };
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      ...createInitialState(3),
      setSize: (size) =>
        set(() => ({
          size,
          cube: createSolvedCube(size),
          phase: "idle",
          moveCount: 0,
          elapsedMs: 0,
          runStartedAt: null,
          history: [],
          activeMove: null,
          moveQueue: [],
          previewMove: null,
          resultOpen: false,
        })),
      queueMove: (move, source = "player") => {
        const state = get();

        if (state.phase === "scrambling" && source === "player") {
          return;
        }

        if (state.activeMove) {
          set((current) => ({
            moveQueue: [...current.moveQueue, { move, source }],
          }));
          return;
        }

        set({
          activeMove: { move, source },
          phase: source === "scramble" ? "scrambling" : "animating",
          previewMove: null,
        });
      },
      startScramble: () => {
        const state = get();
        const scramble = getScrambleMoves(state.size).map((move) => ({
          move,
          source: "scramble" as const,
        }));
        const [first, ...rest] = scramble;

        if (!first) return;

        set({
          cube: createSolvedCube(state.size),
          phase: "scrambling",
          moveCount: 0,
          elapsedMs: 0,
          runStartedAt: null,
          history: [],
          activeMove: first,
          moveQueue: rest,
          resultOpen: false,
          previewMove: null,
        });
      },
      resetCube: () =>
        set((state) => ({
          cube: createSolvedCube(state.size),
          phase: "idle",
          moveCount: 0,
          elapsedMs: 0,
          runStartedAt: null,
          history: [],
          activeMove: null,
          moveQueue: [],
          previewMove: null,
          resultOpen: false,
        })),
      undoMove: () => {
        const state = get();
        if (state.activeMove || state.history.length === 0) return;

        const lastMove = state.history[state.history.length - 1];
        set({
          activeMove: { move: invertMove(lastMove), source: "undo" },
          phase: "animating",
          previewMove: null,
        });
      },
      completeActiveMove: () => {
        const state = get();
        const active = state.activeMove;

        if (!active) return;

        const cube = applyMove(state.cube, active.move);
        const nextQueue = [...state.moveQueue];
        const nextActive = nextQueue.shift() ?? null;
        const history =
          active.source === "player"
            ? [...state.history, active.move]
            : active.source === "undo"
              ? state.history.slice(0, -1)
              : state.history;
        const moveCount =
          active.source === "player"
            ? state.moveCount + 1
            : active.source === "undo"
              ? Math.max(0, state.moveCount - 1)
              : state.moveCount;

        if (nextActive) {
          set({
            cube,
            history,
            moveCount,
            activeMove: nextActive,
            moveQueue: nextQueue,
            phase: nextActive.source === "scramble" ? "scrambling" : "animating",
          });
          return;
        }

        const solved = active.source !== "scramble" && isSolved(cube);

        if (solved) {
          const currentRecord = state.records[state.size];
          const nextRecord: CubeRecord = {
            bestTimeMs:
              currentRecord.bestTimeMs === null
                ? state.elapsedMs
                : Math.min(currentRecord.bestTimeMs, state.elapsedMs),
            bestMoves:
              currentRecord.bestMoves === null
                ? moveCount
                : Math.min(currentRecord.bestMoves, moveCount),
          };

          set({
            cube,
            history,
            moveCount,
            activeMove: null,
            moveQueue: [],
            phase: "solved",
            runStartedAt: null,
            resultOpen: true,
            records: {
              ...state.records,
              [state.size]: nextRecord,
            },
          });
          return;
        }

        set({
          cube,
          history,
          moveCount,
          activeMove: null,
          moveQueue: [],
          phase: "interactive",
          runStartedAt:
            active.source === "scramble" ? Date.now() : (state.runStartedAt ?? Date.now()),
        });
      },
      tickTimer: () =>
        set((state) => {
          if (state.phase !== "interactive" || state.runStartedAt === null) {
            return state;
          }

          return { elapsedMs: Date.now() - state.runStartedAt };
        }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
      setResultOpen: (resultOpen) => set({ resultOpen }),
      updateSettings: (patch) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...patch,
          },
        })),
      setPreviewMove: (previewMove) => set({ previewMove }),
      setHoveredFace: (hoveredFace) => set({ hoveredFace }),
    }),
    {
      name: "cube-game-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        size: state.size,
        settings: state.settings,
        records: state.records,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<GameStoreState>),
        cube: createSolvedCube(
          (persistedState as Partial<GameStoreState>)?.size ?? currentState.size,
        ),
        phase: "idle",
        moveCount: 0,
        elapsedMs: 0,
        runStartedAt: null,
        history: [],
        activeMove: null,
        moveQueue: [],
        settingsOpen: false,
        resultOpen: false,
        previewMove: null,
        hoveredFace: null,
      }),
    },
  ),
);
