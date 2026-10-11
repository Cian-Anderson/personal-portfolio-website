// City layout data.

export interface CityBlockSpec {
  id: string;

  // Centre of the city block.
  center: [number, number];

  // Width along X and depth along Z.
  size: [number, number];

  // Number of possible tower positions.
  columns: number;
  rows: number;

  // Chance that each position actually
  // contains a tower.
  occupancy: number;

  minHeight: number;
  maxHeight: number;

  minFootprint: number;
  maxFootprint: number;

  seed: number;
}

/*
 * IMPORTANT:
 *
 * Roads are NOT objects.
 *
 * Roads are the empty space between these blocks.
 *
 * Every block is axis-aligned, which means every
 * resulting road runs perfectly along X or Z.
 *
 * Because blocks have different lengths and do not
 * all line up, we get:
 *
 * - long boulevards
 * - shorter roads
 * - T-junctions
 * - dead ends
 * - uneven districts
 * - different road widths
 */

export const CITY_BLOCKS: CityBlockSpec[] = [
  // =====================================================
  // NORTH-WEST
  // =====================================================

  {
    id: "north-west-outer",
    center: [-108, 101],
    size: [66, 70],
    columns: 2,
    rows: 2,
    occupancy: 1,
    minHeight: 30,
    maxHeight: 118,
    minFootprint: 8,
    maxFootprint: 24,
    seed: 101,
  },

  {
    id: "north-west-inner",
    center: [-44, 108],
    size: [38, 56],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 42,
    maxHeight: 138,
    minFootprint: 8,
    maxFootprint: 26,
    seed: 102,
  },

  // =====================================================
  // NORTH-EAST
  // =====================================================

  {
    id: "north-east-inner",
    center: [44, 104],
    size: [44, 64],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 28,
    maxHeight: 112,
    minFootprint: 7,
    maxFootprint: 28,
    seed: 201,
  },

  {
    id: "north-east-outer",
    center: [105, 95],
    size: [70, 82],
    columns: 2,
    rows: 3,
    occupancy: 0.9,
    minHeight: 35,
    maxHeight: 126,
    minFootprint: 7,
    maxFootprint: 25,
    seed: 202,
  },

  // =====================================================
  // MID-WEST
  // =====================================================

  {
    id: "mid-west-outer",
    center: [-108, 36],
    size: [66, 40],
    columns: 2,
    rows: 1,
    occupancy: 1,
    minHeight: 24,
    maxHeight: 96,
    minFootprint: 8,
    maxFootprint: 25,
    seed: 301,
  },

  {
    id: "mid-west-inner",
    center: [-46, 40],
    size: [42, 48],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 38,
    maxHeight: 132,
    minFootprint: 7,
    maxFootprint: 28,
    seed: 302,
  },

  // =====================================================
  // MID-EAST
  // =====================================================

  {
    id: "mid-east-inner",
    center: [41, 39],
    size: [38, 42],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 26,
    maxHeight: 108,
    minFootprint: 6,
    maxFootprint: 28,
    seed: 401,
  },

  {
    id: "mid-east-outer",
    center: [103, 35],
    size: [74, 30],
    columns: 3,
    rows: 1,
    occupancy: 0.9,
    minHeight: 32,
    maxHeight: 120,
    minFootprint: 6,
    maxFootprint: 17,
    seed: 402,
  },

  // =====================================================
  // SOUTH-WEST
  // =====================================================

  {
    id: "south-west-large",
    center: [-98, -40],
    size: [86, 48],
    columns: 3,
    rows: 2,
    occupancy: 0.82,
    minHeight: 22,
    maxHeight: 102,
    minFootprint: 6,
    maxFootprint: 20,
    seed: 501,
  },

  {
    id: "south-west-inner",
    center: [-35, -40],
    size: [24, 48],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 34,
    maxHeight: 124,
    minFootprint: 7,
    maxFootprint: 16,
    seed: 502,
  },

  // =====================================================
  // SOUTH-EAST
  // =====================================================

  {
    id: "south-east-inner",
    center: [47, -45],
    size: [50, 58],
    columns: 2,
    rows: 2,
    occupancy: 0.9,
    minHeight: 26,
    maxHeight: 116,
    minFootprint: 6,
    maxFootprint: 20,
    seed: 601,
  },

  {
    id: "south-east-outer",
    center: [111, -34],
    size: [58, 54],
    columns: 2,
    rows: 2,
    occupancy: 1,
    minHeight: 24,
    maxHeight: 100,
    minFootprint: 7,
    maxFootprint: 21,
    seed: 602,
  },

  // =====================================================
  // FAR SOUTH-WEST
  // =====================================================

  {
    id: "far-south-west-outer",
    center: [-108, -108],
    size: [66, 52],
    columns: 2,
    rows: 2,
    occupancy: 0.9,
    minHeight: 30,
    maxHeight: 120,
    minFootprint: 7,
    maxFootprint: 24,
    seed: 701,
  },

  {
    id: "far-south-west-inner",
    center: [-52, -113],
    size: [42, 42],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 44,
    maxHeight: 145,
    minFootprint: 6,
    maxFootprint: 28,
    seed: 702,
  },

  // =====================================================
  // FAR SOUTH-EAST
  // =====================================================

  {
    id: "far-south-east-inner",
    center: [39, -112],
    size: [34, 44],
    columns: 1,
    rows: 2,
    occupancy: 1,
    minHeight: 34,
    maxHeight: 130,
    minFootprint: 6,
    maxFootprint: 24,
    seed: 801,
  },

  {
    id: "far-south-east-outer",
    center: [102, -106],
    size: [76, 56],
    columns: 3,
    rows: 2,
    occupancy: 0.86,
    minHeight: 24,
    maxHeight: 112,
    minFootprint: 6,
    maxFootprint: 20,
    seed: 802,
  },
];
