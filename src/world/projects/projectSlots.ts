// Billboard slot layout.

export type BillboardFace =
  | "+x"
  | "-x"
  | "+z"
  | "-z";

export type BillboardAccent =
  | "cyan"
  | "magenta"
  | "purple";

export type BillboardMount =
  | "facade"
  | "blade"
  | "rooftop";

export interface ProjectSlotData {
  id: string;

  towerId: string;

  face: BillboardFace;

  mount: BillboardMount;

  heightRatio: number;

  widthScale: number;
}

export const PROJECT_SLOTS: ProjectSlotData[] = [
  {
    id: "project-01",

    towerId: "mid-east-inner-0-0",

    face: "-z",
    mount: "facade",

    heightRatio: 0.48,
    widthScale: 0.88,
  },

  {
    id: "project-02",

    towerId: "south-east-inner-0-1",

    face: "+z",
    mount: "blade",

    heightRatio: 0.57,
    widthScale: 1,
  },

  {
    id: "project-03",

    towerId: "south-east-outer-0-0",

    face: "-z",
    mount: "rooftop",

    heightRatio: 0.5,
    widthScale: 0.95,
  },

  {
    id: "project-04",

    towerId: "mid-west-inner-1-0",

    face: "+x",
    mount: "blade",

    heightRatio: 0.6,
    widthScale: 1,
  },

  {
    id: "project-05",

    towerId: "far-south-east-outer-1-0",

    face: "-x",
    mount: "facade",

    heightRatio: 0.52,
    widthScale: 0.9,
  },
];
