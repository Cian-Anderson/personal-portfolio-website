// Cat Splash project entry.

import type { PortfolioProject } from "../../projectTypes";

import readme from "./README.md?raw";
import catSplashDemo from "./Cat_splash_demo.mp4";

const catSplash = {
  id: "cat-splash",

  title: "Cat Splash",
  subtitle: "STM32 Embedded Game",

  summary:
    "A simple embedded game written in C for an STM32 microcontroller, featuring custom sprites, music, sound effects, collision detection, scoring, and two gameplay modes.",

  technologies: [
    "C",
    "STM32",
    "SPI",
    "GPIO",
    "SysTick",
    "TIM14",
    "Embedded Systems",
  ],

artifact: {
  type: "video",
  src: catSplashDemo,
},

  readme,

  github: "https://github.com/Cian-Anderson/Cat_Splash",
  
  world: {
    slot: "project-01",
    accent: "cyan",
  },
} satisfies PortfolioProject;

export default catSplash;
