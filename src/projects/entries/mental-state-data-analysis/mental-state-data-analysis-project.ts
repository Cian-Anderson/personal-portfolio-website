// Mental-state analysis project entry.

import type { PortfolioProject } from "../../projectTypes";
import readme from "./README.md?raw";

const mentalStateDataAnalysis = {
  id: "mental-state-data-analysis",

  title: "Mental State Data Analysis & Visualisation",
  subtitle: "R / Quarto Data Story",

  summary:
    "A data analysis and visualisation project exploring the relationship between player mental state and match outcomes across 3,299 competitive Overwatch matches.",

  technologies: [
    "R",
    "RStudio",
    "Quarto",
    "tidyverse",
    "ggplot2",
    "Plotly",
  ],

  github:
    "https://github.com/Cian-Anderson/Overwatch-Mental-State-Analysis-Data-Visualization-in-R",

  artifact: {
    type: "html",
    src: `${import.meta.env.BASE_URL}projects/mental-state-data-analysis/index.html`,
  },

  readme,

  world: {
    slot: "project-02",
    accent: "magenta",
  },
} satisfies PortfolioProject;

export default mentalStateDataAnalysis;
