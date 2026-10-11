// Ship transform state.

import { create } from "zustand";

type Position = [
  number,
  number,
  number,
];

interface ShipState {
  position: Position;

  yaw: number;

  pitch: number;

  setTransform: (
    position: Position,
    yaw: number,
    pitch: number,
  ) => void;
}

export const useShipStore =
  create<ShipState>((set) => ({
    position: [0, 1.5, 8],

    yaw: 0,

    pitch: 0,

    setTransform: (
      position,
      yaw,
      pitch,
    ) => {
      set({
        position,
        yaw,
        pitch,
      });
    },
  }));
