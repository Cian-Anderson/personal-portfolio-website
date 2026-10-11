// Recommendation system project entry.

import type { PortfolioProject } from "../../projectTypes";

import readme from "./README.md?raw";

const machineLearningGameRecommendation = {
  id: "machine-learning-game-recommendation",

  title: "Machine Learning Game Recommendation System",
  subtitle: "Java / Gaussian Naive Bayes Classifier",

  summary:
    "A Java machine learning project that implements a Gaussian Naive Bayes classifier from scratch to predict whether a Steam player is likely to recommend a game based on playtime, price, and platform information.",

  technologies: [
    "Java",
    "Machine Learning",
    "Gaussian Naive Bayes",
    "Java Swing",
    "CSV",
    "OOP",
  ],

  github:
    "https://github.com/Cian-Anderson/Machine-learning",

  artifact: {
    type: "html",
    src: `${import.meta.env.BASE_URL}projects/machine-learning-game-recommendation/index.html`,
  },

  readme,

  world: {
    slot: "project-03",
    accent: "purple",
  },
} satisfies PortfolioProject;

export default machineLearningGameRecommendation;
