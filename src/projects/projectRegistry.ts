// Project registry.

import type { PortfolioProject } from "./projectTypes";

const projectModules = import.meta.glob<{
  default: PortfolioProject;
}>("./entries/*/*-project.ts", {
  eager: true,
});

export const PROJECTS: PortfolioProject[] = Object.values(
  projectModules
).map((module) => module.default);