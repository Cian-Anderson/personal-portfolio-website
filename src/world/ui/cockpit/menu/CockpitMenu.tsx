// Cockpit menu.

import { useEffect, useState, type CSSProperties } from "react";

import { useViewStore } from "../../../../stores/useViewStore";
import { useProjectStore } from "../../../../stores/useProjectStore";
import type { PortfolioProject } from "../../../../projects/projectTypes";
import CockpitMenuButton from "./CockpitMenuButton";
import FreeFlightButton from "./FreeFlightButton";
import ProjectNavigator from "./ProjectNavigator";

type CockpitPanel = "about" | "experience" | "contact" | null;
type ScreenPoint = [number, number];

const DESIGN_WIDTH = 1755;
const DESIGN_HEIGHT = 877;

// Must match TOP_BAR_BOTTOM in CockpitHUD.tsx.
const TOP_BAR_BOTTOM = 8;

// Screen geometry helpers.
function polygonToScreenStyle(points: ScreenPoint[]): CSSProperties {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  const width = right - left;
  const height = bottom - top;

  const polygon = points
    .map(([x, y]) => {
      const localX = ((x - left) / width) * 100;
      const localY = ((y - top) / height) * 100;

      return `${localX}% ${localY}%`;
    })
    .join(", ");

  return {
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
    clipPath: `polygon(${polygon})`,
  };
}

function polygonToLocalShape(points: ScreenPoint[]) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  const width = right - left;
  const height = bottom - top;

  const localPoints = points.map(([x, y]) => {
    const localX = ((x - left) / width) * 100;
    const localY = ((y - top) / height) * 100;

    return [localX, localY] as ScreenPoint;
  });

  return {
    left,
    right,
    top,
    bottom,
    width,
    height,

    localPoints,

    clipPath: `polygon(${localPoints
      .map(([x, y]) => `${x}% ${y}%`)
      .join(", ")})`,
  };
}

// LEFT GLASS SUPPORT.//
// Actual magenta support in CockpitHUD:
//
// [7, 8] -> [30, 38]
//
// The nav's upper-right cyan edge is sampled from this exact
// equation, so it stays parallel to the cockpit support at
// every viewport aspect ratio.
//

function leftGlassSupportX(y: number) {
  return 7 + ((y - TOP_BAR_BOTTOM) / (38 - TOP_BAR_BOTTOM)) * (30 - 7);
}

// LEFT NAV TUNING.//
// EDIT THESE VALUES BY HAND.
//
// LEFT_NAV_LEFT
//   lower  = move the whole nav left
//   higher = move the whole nav right
//
// LEFT_NAV_TOP / BOTTOM
//   move / resize the whole nav vertically
//
// LEFT_NAV_SUPPORT_GAP
//   distance between nav slope and magenta support
//
// LEFT_NAV_NOSE_Y
//   where the upper support-parallel slope ends
//
// LEFT_NAV_LOWER_RIGHT_PULLBACK
//   controls the lower-right taper
//

const LEFT_NAV_LEFT = 0.9;

const LEFT_NAV_TOP = 12.0;
const LEFT_NAV_BOTTOM = 36.0;

const LEFT_NAV_SUPPORT_GAP = 1.35;

const LEFT_NAV_NOSE_Y = 23.2;
const LEFT_NAV_LOWER_RIGHT_PULLBACK = 2.3;

// Exact support-parallel outer edge.
const LEFT_NAV_TOP_RIGHT_X =
  leftGlassSupportX(LEFT_NAV_TOP) - LEFT_NAV_SUPPORT_GAP;

const LEFT_NAV_NOSE_X =
  leftGlassSupportX(LEFT_NAV_NOSE_Y) - LEFT_NAV_SUPPORT_GAP;

const LEFT_NAV_BOTTOM_RIGHT_X = LEFT_NAV_NOSE_X - LEFT_NAV_LOWER_RIGHT_PULLBACK;

// Left nav outer shape.
const LEFT_NAV_FRAME_POINTS: ScreenPoint[] = [
  [LEFT_NAV_LEFT, LEFT_NAV_TOP],
  [LEFT_NAV_TOP_RIGHT_X, LEFT_NAV_TOP],
  [LEFT_NAV_NOSE_X, LEFT_NAV_NOSE_Y],
  [LEFT_NAV_BOTTOM_RIGHT_X, LEFT_NAV_BOTTOM],
  [LEFT_NAV_LEFT, LEFT_NAV_BOTTOM],
];

const LEFT_NAV_SHAPE = polygonToLocalShape(LEFT_NAV_FRAME_POINTS);

// INNER NAV CONTOUR HELPERS.//
// The three inner buttons now FOLLOW the outer housing instead
// of being generic triangle-arrow shapes.
//
// That means:
// - ABOUT follows the upper slope
// - EXPERIENCE crosses the outer nose and gets the same kink
// - CONTACT follows the lower slope
//
// This gives you the consistent "padding inside a larger shape"
// look from the reference image.
//

function leftNavRightEdgeX(y: number) {
  if (y <= LEFT_NAV_NOSE_Y) {
    const progress = (y - LEFT_NAV_TOP) / (LEFT_NAV_NOSE_Y - LEFT_NAV_TOP);

    return (
      LEFT_NAV_TOP_RIGHT_X + progress * (LEFT_NAV_NOSE_X - LEFT_NAV_TOP_RIGHT_X)
    );
  }

  const progress = (y - LEFT_NAV_NOSE_Y) / (LEFT_NAV_BOTTOM - LEFT_NAV_NOSE_Y);

  return (
    LEFT_NAV_NOSE_X + progress * (LEFT_NAV_BOTTOM_RIGHT_X - LEFT_NAV_NOSE_X)
  );
}

function makeInsetNavRow(
  top: number,
  bottom: number,
  leftInset: number,
  rightInset: number,
): ScreenPoint[] {
  const leftX = LEFT_NAV_LEFT + leftInset;

  const topRightX = leftNavRightEdgeX(top) - rightInset;

  const bottomRightX = leftNavRightEdgeX(bottom) - rightInset;

  // If the row crosses the outer frame nose, include
  // an inset nose point so it follows the same contour.
  if (top < LEFT_NAV_NOSE_Y && bottom > LEFT_NAV_NOSE_Y) {
    return [
      [leftX, top],
      [topRightX, top],
      [LEFT_NAV_NOSE_X - rightInset, LEFT_NAV_NOSE_Y],
      [bottomRightX, bottom],
      [leftX, bottom],
    ];
  }

  return [
    [leftX, top],
    [topRightX, top],
    [bottomRightX, bottom],
    [leftX, bottom],
  ];
}

function polygonToNavChildStyle(points: ScreenPoint[]): CSSProperties {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  const width = right - left;
  const height = bottom - top;

  const localLeft = ((left - LEFT_NAV_SHAPE.left) / LEFT_NAV_SHAPE.width) * 100;

  const localTop = ((top - LEFT_NAV_SHAPE.top) / LEFT_NAV_SHAPE.height) * 100;

  const localWidth = (width / LEFT_NAV_SHAPE.width) * 100;

  const localHeight = (height / LEFT_NAV_SHAPE.height) * 100;

  const clipPath = points
    .map(([x, y]) => {
      const px = ((x - left) / width) * 100;
      const py = ((y - top) / height) * 100;

      return `${px}% ${py}%`;
    })
    .join(", ");

  return {
    position: "absolute",
    left: `${localLeft}%`,
    top: `${localTop}%`,
    width: `${localWidth}%`,
    height: `${localHeight}%`,
    clipPath: `polygon(${clipPath})`,
    pointerEvents: "auto",
  };
}

// INNER NAV PADDING / ROW POSITIONS.//
// These are the main values to tweak now.
//
// Increase NAV_LEFT_PADDING  = inner buttons move right
// Increase NAV_RIGHT_PADDING = inner buttons pull away from
//                              the outer sloped edge
//
// The row top/bottom pairs control vertical spacing.
//

const NAV_LEFT_PADDING = 1.25;
const NAV_RIGHT_PADDING = 1.15;

const ABOUT_ROW_POINTS = makeInsetNavRow(
  13.5,
  19.3,
  NAV_LEFT_PADDING,
  NAV_RIGHT_PADDING,
);

const EXPERIENCE_ROW_POINTS = makeInsetNavRow(
  20.6,
  26.7,
  NAV_LEFT_PADDING,
  NAV_RIGHT_PADDING,
);

const CONTACT_ROW_POINTS = makeInsetNavRow(
  28.0,
  34.2,
  NAV_LEFT_PADDING,
  NAV_RIGHT_PADDING,
);

// Right cockpit panel.
function rightPanelTopY(x: number) {
  return 70 + ((x - 82) / 18) * 2;
}

function rightPanelBottomY(x: number) {
  return 91 + ((x - 84) / 16) * 3;
}

// Free flight geometry.
const FREE_FLIGHT_TOP_LEFT_X = 87.5;
const FREE_FLIGHT_TOP_RIGHT_X = 98.5;

const FREE_FLIGHT_BOTTOM_LEFT_X = 87;
const FREE_FLIGHT_BOTTOM_RIGHT_X = 98;

const FREE_FLIGHT_TOP_INSET = 3;
const FREE_FLIGHT_BOTTOM_INSET = 3;

const FREE_FLIGHT_POINTS: ScreenPoint[] = [
  [
    FREE_FLIGHT_TOP_LEFT_X,
    rightPanelTopY(FREE_FLIGHT_TOP_LEFT_X) + FREE_FLIGHT_TOP_INSET,
  ],
  [
    FREE_FLIGHT_TOP_RIGHT_X,
    rightPanelTopY(FREE_FLIGHT_TOP_RIGHT_X) + FREE_FLIGHT_TOP_INSET,
  ],
  [
    FREE_FLIGHT_BOTTOM_RIGHT_X,
    rightPanelBottomY(FREE_FLIGHT_BOTTOM_RIGHT_X) - FREE_FLIGHT_BOTTOM_INSET,
  ],
  [
    FREE_FLIGHT_BOTTOM_LEFT_X,
    rightPanelBottomY(FREE_FLIGHT_BOTTOM_LEFT_X) - FREE_FLIGHT_BOTTOM_INSET,
  ],
];

const FREE_FLIGHT_SHAPE = polygonToLocalShape(FREE_FLIGHT_POINTS);

export default function CockpitMenu() {
  const [activePanel, setActivePanel] = useState<CockpitPanel>(null);

  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  useEffect(() => {
    const styleId = "cockpit-menu-scanline-effects";

    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");

    style.id = styleId;

    style.textContent = `
      @keyframes cockpitLeftScanlines {
        from {
          background-position: 0 0, 0 0;
        }

        to {
          background-position: 20px 20px, 0 0;
        }
      }
    `;

    document.head.appendChild(style);
  }, []);

  const menuScale = Math.min(
    viewportSize.width / DESIGN_WIDTH,
    viewportSize.height / DESIGN_HEIGHT,
  );

  const viewMode = useViewStore((state) => state.viewMode);

  const transitionProgress = useViewStore((state) => state.transitionProgress);

  const openProject = useProjectStore((state) => state.openProject);

  const menuVisible = viewMode === "cockpit" && transitionProgress <= 0.001;

  if (!menuVisible) {
    return null;
  }

  const handleWarp = (project: PortfolioProject) => {
    console.info(`[COCKPIT] Warp selected: ${project.id}`, project);

    openProject(project.id);

    console.log("[PROJECT STORE AFTER WARP]", useProjectStore.getState());
  };

  // ====================================================
  // OVERLAY
  // ====================================================

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    pointerEvents: "none",
    color: "#fff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    userSelect: "none",
    overflow: "hidden",
  };

  // ====================================================
  // LEFT GLASS NAVIGATION
  // ====================================================
  //
  // Important:
  // no transform: scale() on this wrapper.
  //
  // It uses viewport percentages directly so its cyan sloped
  // edge stays parallel to CockpitHUD's magenta support.
  //

  const leftNavLayerStyle: CSSProperties = {
    position: "absolute",

    left: `${LEFT_NAV_SHAPE.left}%`,
    top: `${LEFT_NAV_SHAPE.top}%`,

    width: `${LEFT_NAV_SHAPE.width}%`,
    height: `${LEFT_NAV_SHAPE.height}%`,

    pointerEvents: "none",

    containerType: "size",

    overflow: "visible",
  };

  // Transparent glassy face.
  const leftNavFrameFaceStyle: CSSProperties = {
    position: "absolute",
    inset: "2px",

    clipPath: LEFT_NAV_SHAPE.clipPath,

    background: `
    repeating-linear-gradient(
      -45deg,
      rgba(32, 233, 255, 0.1) 0px,
      rgba(32, 233, 255, 0.1) 1px,
      transparent 1px,
      transparent 5px
    ),
    rgba(11, 90, 99, 0.22)
  `,

    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",

    animation: "cockpitLeftScanlines 4s linear infinite",

    pointerEvents: "none",
  };

  const leftNavBorderStyle: CSSProperties = {
    position: "absolute",
    inset: 0,

    width: "100%",
    height: "100%",

    overflow: "visible",

    pointerEvents: "none",

    filter: `
    drop-shadow(
      0 0 2px
      rgba(32,234,255,0.9)
    )
    drop-shadow(
      0 0 6px
      rgba(32,234,255,0.30)
    )
  `,
  };

  // ====================================================
  // NAV BUTTON POSITIONS
  // ====================================================
  //
  // These now come from the SAME outer shape.
  //
  // This is the important addition:
  // the rows are no longer generic arrow polygons.
  //

  const aboutButtonStyle: CSSProperties = {
    ...polygonToNavChildStyle(ABOUT_ROW_POINTS),
  };

  const experienceButtonStyle: CSSProperties = {
    ...polygonToNavChildStyle(EXPERIENCE_ROW_POINTS),
  };

  const contactButtonStyle: CSSProperties = {
    ...polygonToNavChildStyle(CONTACT_ROW_POINTS),
  };

  // ====================================================
  // PROJECT NAVIGATOR
  // ====================================================

  const dashboardScreenStyle: CSSProperties = {
    position: "absolute",

    left: "20.6%",
    top: "74%",

    width: "58.75%",
    height: "13.2%",

    pointerEvents: "auto",
  };

  // ====================================================
  // FREE FLIGHT
  // ====================================================

  const freeFlightStyle: CSSProperties = {
    ...polygonToScreenStyle(FREE_FLIGHT_POINTS),

    clipPath: "none",

    pointerEvents: "auto",
  };

  const freeFlightTextAngle =
    Math.atan2(
      (rightPanelTopY(FREE_FLIGHT_TOP_RIGHT_X) -
        rightPanelTopY(FREE_FLIGHT_TOP_LEFT_X)) *
        (viewportSize.height / 100),

      (FREE_FLIGHT_TOP_RIGHT_X - FREE_FLIGHT_TOP_LEFT_X) *
        (viewportSize.width / 100),
    ) *
    (230 / Math.PI);

  // ====================================================
  // TITLE
  // ====================================================

  const titleContainerStyle: CSSProperties = {
    position: "absolute",

    // Matches the physical top bar:
    // x = 7 -> 93
    left: "7%",
    top: 0,

    width: "86%",
    height: `${TOP_BAR_BOTTOM}%`,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    pointerEvents: "none",
  };

  const titleStyle: CSSProperties = {
    margin: 0,

    fontSize: Math.min(53 * menuScale, 45),

    fontWeight: 500,

    // Keep the text box tight around the font.
    lineHeight: 1,

    letterSpacing: "0.045em",

    color: "rgba(255,255,255,0.95)",

    textShadow: "0 2px 18px rgba(0,0,0,0.35)",

    whiteSpace: "nowrap",

    /*
     * OPTICAL VERTICAL CENTRE
     *
     * The flexbox puts the FONT BOX in the exact centre,
     * but capital letters visually sit high inside that box.
     *
     * 0.22em is ~12px at the maximum 53px title size.
     */
    transform: "translateY(-0.23em)",
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div style={overlayStyle}>
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>CIAN ANDERSON</h1>
      </div>

      {/* LEFT NAV. */}

      <nav style={leftNavLayerStyle} aria-label="Portfolio navigation">
        <div style={leftNavFrameFaceStyle} />

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={leftNavBorderStyle}
          aria-hidden="true"
        >
          <polygon
            points={LEFT_NAV_SHAPE.localPoints
              .map(([x, y]) => `${x},${y}`)
              .join(" ")}
            fill="none"
            stroke="#20eaff"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <CockpitMenuButton
          kind="about"
          active={activePanel === "about"}
          style={aboutButtonStyle}
          arrowRight="25%"
          onClick={() => setActivePanel("about")}
        >
          About
        </CockpitMenuButton>

        <CockpitMenuButton
          kind="experience"
          active={activePanel === "experience"}
          style={experienceButtonStyle}
          arrowRight="11%"
          onClick={() => setActivePanel("experience")}
        >
          Experience
        </CockpitMenuButton>

        <CockpitMenuButton
          kind="contact"
          active={activePanel === "contact"}
          style={contactButtonStyle}
          arrowRight="15%"
          onClick={() => setActivePanel("contact")}
        >
          Contact
        </CockpitMenuButton>
      </nav>

      {/* PROJECT NAVIGATOR. */}

      <div style={dashboardScreenStyle}>
        <ProjectNavigator onWarp={handleWarp} />
      </div>

      {/* FREE FLIGHT. */}

      <div style={freeFlightStyle}>
        <FreeFlightButton
          clipPath={FREE_FLIGHT_SHAPE.clipPath}
          perspectiveAngle={freeFlightTextAngle}
        />
      </div>
    </div>
  );
}