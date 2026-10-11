// Project viewer state.

import { create } from "zustand";

interface ProjectState {
  activeProjectId: string | null;
  viewerOpen: boolean;

  openProject: (projectId: string) => void;
  closeProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: null,
  viewerOpen: false,

  openProject: (projectId) =>
    set({
      activeProjectId: projectId,
      viewerOpen: true,
    }),

  closeProject: () =>
    set({
      activeProjectId: null,
      viewerOpen: false,
    }),
}));
