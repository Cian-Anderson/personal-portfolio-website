
import { create } from "zustand";

export type ViewMode = "cockpit" | "chase";

interface ViewState {
  viewMode: ViewMode;
  transitionProgress: number;
  introComplete: boolean;

  flightTutorialOpen: boolean;
  flightTutorialDismissed: boolean;

  setViewMode: (viewMode: ViewMode) => void;
  toggleView: () => void;
  setTransitionProgress: (progress: number) => void;
  completeIntro: () => void;

  openFlightTutorial: () => void;
  closeFlightTutorial: () => void;

  reset: () => void;
}

const TUTORIAL_STORAGE_KEY =
  "portfolio-flight-tutorial-completed";

function hasCompletedFlightTutorial(): boolean {
  try {
    return (
      localStorage.getItem(TUTORIAL_STORAGE_KEY) ===
      "true"
    );
  } catch {
    return false;
  }
}

export const useViewStore = create<ViewState>((set) => ({
  viewMode: "chase",
  transitionProgress: 1,
  introComplete: false,

  flightTutorialOpen: false,
  flightTutorialDismissed: hasCompletedFlightTutorial(),

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  toggleView: () => {
    set((state) => ({
      viewMode:
        state.viewMode === "cockpit"
          ? "chase"
          : "cockpit",
    }));
  },

  setTransitionProgress: (progress) => {
    set({
      transitionProgress: Math.max(
        0,
        Math.min(1, progress),
      ),
    });
  },

  completeIntro: () => {
    set({ introComplete: true });
  },

  openFlightTutorial: () => {
    set({ flightTutorialOpen: true });
  },

  closeFlightTutorial: () => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    } catch {
      // Storage might be unavailable.
    }

    set({
      flightTutorialOpen: false,
      flightTutorialDismissed: true,
    });
  },

  reset: () => {
    set({
      viewMode: "chase",
      transitionProgress: 1,
      introComplete: false,
      flightTutorialOpen: false,
    });
  },
}));
