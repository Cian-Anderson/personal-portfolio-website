// Project viewer overlay.

import { PROJECTS } from "../../../projects/projectRegistry";
import ProjectViewer from "../../../projects/viewer/ProjectViewer";
import { useProjectStore } from "../../../stores/useProjectStore";

export default function ProjectViewerOverlay() {
  const activeProjectId = useProjectStore((state) => state.activeProjectId);

  const viewerOpen = useProjectStore((state) => state.viewerOpen);

  const closeProject = useProjectStore((state) => state.closeProject);

  if (!viewerOpen || !activeProjectId) {
    return null;
  }

  const project = PROJECTS.find((project) => project.id === activeProjectId);

  if (!project) {
    console.warn(
      `[PROJECT VIEWER] No project found for id: ${activeProjectId}`,
    );

    return null;
  }

  return <ProjectViewer project={project} onClose={closeProject} />;
}