// Tower definitions.

import * as THREE from "three";

import {
  CITY_BLOCKS,
  type CityBlockSpec,
} from "./cityLayout";

export interface GeneratedTower {
  id: string;

  position: [
    number,
    number,
    number,
  ];

  width: number;
  depth: number;
  height: number;

  accent: string;
}

const ACCENTS = [
  "#00eaff",
  "#ff2bd6",
  "#8b5cff",
];

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;

    let t = value;

    t = Math.imul(
      t ^ (t >>> 15),
      t | 1,
    );

    t ^=
      t +
      Math.imul(
        t ^ (t >>> 7),
        t | 61,
      );

    return (
      ((t ^ (t >>> 14)) >>> 0) /
      4294967296
    );
  };
}

function randomBetween(
  random: () => number,
  min: number,
  max: number,
) {
  return min + random() * (max - min);
}

function generateBlockTowers(
  block: CityBlockSpec,
): GeneratedTower[] {
  const random = seededRandom(block.seed);

  const towers: GeneratedTower[] = [];

  const [blockWidth, blockDepth] =
    block.size;

  const [centerX, centerZ] =
    block.center;

  const cellWidth =
    blockWidth / block.columns;

  const cellDepth =
    blockDepth / block.rows;

  for (
    let row = 0;
    row < block.rows;
    row++
  ) {
    for (
      let column = 0;
      column < block.columns;
      column++
    ) {
      if (random() > block.occupancy) {
        continue;
      }

      const availableWidth =
        Math.max(
          8,
          cellWidth - 8,
        );

      const availableDepth =
        Math.max(
          8,
          cellDepth - 8,
        );

      const minWidth = Math.min(
        block.minFootprint,
        availableWidth,
      );

      const maxWidth = Math.max(
        minWidth,
        Math.min(
          block.maxFootprint,
          availableWidth,
        ),
      );

      const minDepth = Math.min(
        block.minFootprint * 0.75,
        availableDepth,
      );

      const maxDepth = Math.max(
        minDepth,
        Math.min(
          block.maxFootprint * 1.2,
          availableDepth,
        ),
      );

      const width = randomBetween(
        random,
        minWidth,
        maxWidth,
      );

      const depth = randomBetween(
        random,
        minDepth,
        maxDepth,
      );

      const footprintSize =
        Math.sqrt(width * depth);

      const footprintFactor =
        THREE.MathUtils.clamp(
          (footprintSize - 7) / 14,
          0,
          1,
        );

      let height = randomBetween(
        random,
        block.minHeight,
        block.maxHeight,
      );

      const heightRoll = random();

      if (heightRoll < 0.18) {
        height *= randomBetween(
          random,
          0.5,
          0.72,
        );
      } else if (
        heightRoll > 0.94 &&
        footprintFactor > 0.65
      ) {
        height *= randomBetween(
          random,
          1.35,
          1.65,
        );
      } else if (
        heightRoll > 0.78 &&
        footprintFactor > 0.35
      ) {
        height *= randomBetween(
          random,
          1.1,
          1.3,
        );
      }

      const footprintHeightCap =
        48 +
        footprintFactor * 82;

      height = Math.min(
        height,
        footprintHeightCap,
      );

      const baseX =
        centerX -
        blockWidth / 2 +
        cellWidth *
          (column + 0.5);

      const baseZ =
        centerZ -
        blockDepth / 2 +
        cellDepth *
          (row + 0.5);

      const jitterX = randomBetween(
        random,
        -cellWidth * 0.14,
        cellWidth * 0.14,
      );

      const jitterZ = randomBetween(
        random,
        -cellDepth * 0.14,
        cellDepth * 0.14,
      );

      const accent =
        ACCENTS[
          Math.floor(
            random() *
              ACCENTS.length,
          )
        ];

      towers.push({
        id:
          `${block.id}-${row}-${column}`,

        position: [
          baseX + jitterX,
          0,
          baseZ + jitterZ,
        ],

        width,
        depth,
        height,
        accent,
      });
    }
  }

  return towers;
}

export const CITY_TOWERS =
  CITY_BLOCKS.flatMap(
    generateBlockTowers,
  );
