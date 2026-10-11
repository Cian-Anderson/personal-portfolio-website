
import { create } from "zustand";

type Position = [number, number, number];

interface ExitCinematic {
  elapsed: number;
  duration: number;
}

interface ShipState {
  position: Position;
  yaw: number;
  pitch: number;

  teleportRequest: {
    position: Position;
    yaw: number;
  } | null;

  exitCinematic: ExitCinematic | null;

  setTransform: (
    position: Position,
    yaw: number,
    pitch: number,
  ) => void;

  requestTeleport: (
    position: Position,
    yaw: number,
  ) => void;

  clearTeleportRequest: () => void;

  startExitCinematic: () => void;

  setExitCinematicElapsed: (elapsed: number) => void;

  finishExitCinematic: () => void;

  
  entryCinematic: {
    projectId: string;
    elapsed: number;
    duration: number;
    startPosition: Position;
    direction: Position;
  } | null;

  startEntryCinematic: (
    projectId: string,
    startPosition: Position,
    direction: Position,
  ) => void;

  setEntryCinematicElapsed: (elapsed: number) => void;
  finishEntryCinematic: () => void;

}

export const useShipStore = create<ShipState>((set) => ({
  position: [0, 1.5, 8],
  yaw: 0,
  pitch: 0,

  teleportRequest: null,
  exitCinematic: null,

  setTransform: (position, yaw, pitch) =>
    set({ position, yaw, pitch }),

  requestTeleport: (position, yaw) =>
    set({
      teleportRequest: { position, yaw },
    }),

  clearTeleportRequest: () =>
    set({ teleportRequest: null }),

  startExitCinematic: () =>
    set({
      exitCinematic: {
        elapsed: 0,
        duration: 3.2,
      },
    }),

  setExitCinematicElapsed: (elapsed) =>
    set((state) => ({
      exitCinematic: state.exitCinematic
        ? {
            ...state.exitCinematic,
            elapsed: Math.min(
              elapsed,
              state.exitCinematic.duration,
            ),
          }
        : null,
    })),

  finishExitCinematic: () =>
    set({ exitCinematic: null }),

  
  entryCinematic: null,

  startEntryCinematic: (
    projectId,
    startPosition,
    direction,
  ) =>
    set({
      entryCinematic: {
        projectId,
        elapsed: 0,
        duration: 1.5,
        startPosition,
        direction,
      },
    }),

  setEntryCinematicElapsed: (elapsed) =>
    set((state) => ({
      entryCinematic: state.entryCinematic
        ? {
            ...state.entryCinematic,
            elapsed: Math.min(
              elapsed,
              state.entryCinematic.duration,
            ),
          }
        : null,
    })),

  finishEntryCinematic: () =>
    set({ entryCinematic: null }),

}));
