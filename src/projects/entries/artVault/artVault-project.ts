// ArtVault project entry.

import type { PortfolioProject } from "../../projectTypes";

import readme from "./README.md?raw";

const ArtVault = {
  id: "ArtVault",

  title: "ArtVault — Full-Stack Art Gallery",
  subtitle: "React / Node.js / Express / MongoDB",

  summary:
    "A full-stack art gallery application built to explore client-server communication, REST APIs, authentication, CRUD operations, and MongoDB-backed data through a React interface.",

  technologies: [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "REST API",
    "JWT",
    "Mongoose",
    "Full-Stack",
  ],

  github:
    "https://github.com/Cian-Anderson/ArtVault",

  artifact: {
    type: "html",
    src: `${import.meta.env.BASE_URL}projects/art-index/index.html`,
  },

  readme,

  world: {
    slot: "project-04",
    accent: "cyan",
  },
} satisfies PortfolioProject;

export default ArtVault;
