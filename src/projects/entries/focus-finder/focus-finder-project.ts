// FocusFinder project entry.

import type { PortfolioProject } from "../../projectTypes";
import readme from "./README.md?raw";

const focusFinder = {
  id: "focus-finder",

  title: "FocusFinder",
  subtitle: "Adaptive Desktop Productivity Support System",

  summary:
    "A local-first Windows desktop productivity system that monitors behavioural patterns, classifies activity, and uses a contextual Multi-Armed Bandit to adapt focus interventions based on user responses and subsequent behaviour.",

  technologies: [
    "Electron",
    "React",
    "TypeScript",
    "Python",
    "Flask",
    "SQLite",
    "SQLAlchemy",
    "Machine Learning",
    "Reinforcement Learning",
  ],

  github: "https://github.com/Cian-Anderson/FocusFinder",

  reportUrl: `${import.meta.env.BASE_URL}projects/focus-finder/FocusFinder%20Report.pdf`,

  downloadUrl:
    "https://github.com/Cian-Anderson/FocusFinder/releases/tag/v1.0.0",

  downloadLabel: "DOWNLOAD WINDOWS APP",

  artifact: {
    type: "html",
    src: `${import.meta.env.BASE_URL}projects/focus-finder/index.html`,
  },

  demoDisclaimer: {
  title: "Interactive Demo",

  summary:
    "This browser version uses synthetic activity data and does not monitor your computer.",

  details: [
    "The full Windows application performs live application, window, and idle monitoring locally.",
    "The browser demo uses a fixed synthetic dataset instead of reading activity from your device.",
    "Reminder responses and adaptive-system interactions are simulated in browser memory.",
    "The Data Model view contains representative synthetic records matching FocusFinder's real data structure; it is not connected to SQLite.",
    "Desktop notifications, live monitoring, PDF export, Python processing, and Electron-specific functionality are available only in the full Windows application.",
  ],

    continueLabel: "CONTINUE TO DEMO",
  },

  readme,

  world: {
    slot: "project-05",
    accent: "magenta",
  },
} satisfies PortfolioProject;

export default focusFinder;
