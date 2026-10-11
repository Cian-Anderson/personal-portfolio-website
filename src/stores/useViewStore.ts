// View and camera state.

import { create } from "zustand";

export type ViewMode =
  | "cockpit"
  | "chase";

interface ViewState {
  /*
   * The view the camera is currently
   * trying to reach.
   */
  viewMode: ViewMode;

  /*
   * 0 = cockpit
   * 1 = normal chase camera
   *
   * Values between the two are used
   * while transitioning.
   */
  transitionProgress: number;

  /*
   * False while the automatic opening
   * chase -> cockpit sequence is running.
   */
  introComplete: boolean;

  setViewMode: (
    viewMode: ViewMode,
  ) => void;

  toggleView: () => void;

  setTransitionProgress: (
    progress: number,
  ) => void;

  completeIntro: () => void;

  reset: () => void;
}

export const useViewStore =
  create<ViewState>((set) => ({
    /*
     * Start OUTSIDE the ship.
     */
    viewMode: "chase",

    /*
     * 1 = fully in chase position.
     */
    transitionProgress: 1,

    introComplete: false,

    setViewMode: (
      viewMode,
    ) => {
      set({
        viewMode,
      });
    },

    toggleView: () => {
      set((state) => ({
        viewMode:
          state.viewMode ===
          "cockpit"
            ? "chase"
            : "cockpit",
      }));
    },

    setTransitionProgress: (
      progress,
    ) => {
      set({
        transitionProgress:
          Math.max(
            0,
            Math.min(
              1,
              progress,
            ),
          ),
      });
    },

    completeIntro: () => {
      set({
        introComplete: true,
      });
    },

    reset: () => {
      set({
        /*
         * Reset back to the outside
         * starting position.
         */
        viewMode: "chase",

        transitionProgress: 1,

        introComplete: false,
      });
    },
  }));
