// Shared project types.

export type ProjectAccent =
  | "cyan"
  | "magenta"
  | "purple";

export interface ProjectWorldConfig {
  /**
   * Refers to a predefined physical billboard/location
   * inside the 3D world.
   *
   * Example:
   * "project-01"
   */
  slot: string;

  accent?: ProjectAccent;
}

export type HtmlArtifact = {
  type: "html";
  src: string;
};

export type WebArtifact = {
  type: "web";
  url: string;
};

export type VideoArtifact = {
  type: "video";
  src: string;
  poster?: string;
  rotation?: 0 | 90 | -90 | 180;
};

export type GalleryArtifact = {
  type: "gallery";
  images: string[];
};

export type EmptyArtifact = {
  type: "none";
  message?: string;
};

export type ProjectArtifact =
  | HtmlArtifact
  | WebArtifact
  | VideoArtifact
  | GalleryArtifact
  | EmptyArtifact;

export interface PortfolioProject {
  id: string;

  title: string;
  subtitle?: string;

  summary: string;

  technologies: string[];

  artifact: ProjectArtifact;

  /**
   * Raw Markdown content.
   *
   * This will normally be imported from:
   *
   * import readme from "./README.md?raw";
   */
  readme?: string;

  github?: string;
  liveUrl?: string;

  /**
   * Optional link to a full project report,
   * dissertation, thesis, or other long-form document.
   */
  reportUrl?: string;

  /**
   * Optional link to a downloadable application,
   * installer, release, or other project file.
   */
  downloadUrl?: string;

  /**
   * Optional custom text for the download button.
   *
   * Example:
   * "DOWNLOAD WINDOWS APP"
   */
  downloadLabel?: string;

  demoDisclaimer?: ProjectDemoDisclaimer;

  /**
   * Optional 3D-world representation.
   *
   * A project without this can still exist in
   * the portfolio without having a billboard.
   */
  world?: ProjectWorldConfig;
}
export interface ProjectDemoDisclaimer {
  title: string;
  summary: string;
  details?: string[];
  continueLabel?: string;
}
