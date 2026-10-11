// Project navigator UI.

import { useEffect, useState, type CSSProperties } from "react";

import { PROJECTS } from "../../../../projects/projectRegistry";
import type { PortfolioProject } from "../../../../projects/projectTypes";

interface ProjectNavigatorProps {
  onWarp?: (project: PortfolioProject) => void;
}

export default function ProjectNavigator({ onWarp }: ProjectNavigatorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const projects = PROJECTS.filter((project) => project.world);
  // =========================
  // SCANLINE ANIMATION
  // =========================

  useEffect(() => {
    const styleId = "project-navigator-scanline-effects";

    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");

    style.id = styleId;

    style.textContent = `
      @keyframes projectNavigatorScanlines {
        from {
          background-position: 0 0, 0 0;
        }

        to {
          background-position: 0 20px, 0 0;
        }
      }
    `;

    document.head.appendChild(style);
  }, []);

  if (projects.length === 0) {
    return null;
  }

  const selected = projects[selectedIndex];

  const selectPrevious = () => {
    setSelectedIndex(
      (current) => (current - 1 + projects.length) % projects.length,
    );
  };

  const selectNext = () => {
    setSelectedIndex((current) => (current + 1) % projects.length);
  };

  const handleWarp = () => {
    onWarp?.(selected);
  };

  // =========================
  // MAIN DASH SCREEN WRAPPER
  // =========================

  const panelWrapperStyle: CSSProperties = {
    position: "relative",

    width: "58.8cqw",
    height: "100%",

    boxSizing: "border-box",

    pointerEvents: "auto",
  };

  // =========================
  // MAIN DASH SCREEN FACE
  // =========================

  const panelStyle: CSSProperties = {
    position: "absolute",
    inset: 0,

    width: "100%",
    height: "100%",

    boxSizing: "border-box",

    // IMPORTANT
    containerType: "size",

    padding: 0,

    clipPath: "polygon(2.12% 0, 97.88% 0, 100% 100%, 0 100%)",

    // ========================================
    // SCANLINES
    // ========================================
    //
    // rgba(... 0.10) = scanline opacity
    //
    // BASE BACKGROUND
    // rgba(99, 11, 91, 0.22)
    // Change ONLY 0.22 to change panel opacity.
    //

    background: `
      repeating-linear-gradient(
        0deg,
        rgba(255, 43, 213, 0.15) 0px,
        rgba(255, 43, 213, 0.2) 1px,
        transparent 1px,
        transparent 8px
      ),
      rgba(99, 11, 91, 0.22)
    `,

    animation: "projectNavigatorScanlines 5s linear infinite",

    color: "#ffffff",

    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
  };

  // =========================
  // SOLID OUTER BORDER
  // =========================
  //
  // Completely independent from the panel
  // background and scanlines.
  //

  const borderSvgStyle: CSSProperties = {
    position: "absolute",
    inset: 0,

    width: "100%",
    height: "100%",

    overflow: "visible",

    pointerEvents: "none",

    zIndex: 10,

    filter: `
      drop-shadow(
        0 0 2px
        rgba(255,43,214,0.95)
      )
      drop-shadow(
        0 0 7px
        rgba(255,43,214,0.35)
      )
    `,
  };

  const magentaEdgeStyle: CSSProperties = {
    position: "absolute",

    right: 0,
    bottom: 0,

    width: "29%",
    height: 3,

    background: "#ff2bd6",

    boxShadow: `
      0 0 4px
      rgba(255,43,214,0.9),

      0 0 8px
      rgba(255,43,214,0.42)
    `,

    pointerEvents: "none",
  };

  // =========================
  // HEADER
  // =========================

  const headerStyle: CSSProperties = {
    position: "absolute",

    left: "4cqw",
    right: "4cqw",
    top: "7cqh",

    height: "14cqh",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottom: "1px solid rgba(32,234,255,0.26)",
  };

  const headerLabelStyle: CSSProperties = {
    fontSize: "7.5cqh",
    fontWeight: 1000,

    letterSpacing: "0.2em",

    color: "#00e5ff",
  };

  const countStyle: CSSProperties = {
    fontSize: "8cqh",
    fontWeight: 900,

    letterSpacing: "0.15em",

    color: "#f800c6",
  };

  // =========================
  // CONTENT
  // =========================

  const bodyStyle: CSSProperties = {
    height: 78,

    display: "grid",

    gridTemplateColumns: "1.35fr 0.9fr",

    gap: 32,

    alignItems: "center",
  };

  const projectStyle: CSSProperties = {
    position: "absolute",

    left: "4cqw",
    top: "28cqh",

    width: "48cqw",
    height: "60cqh",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,

    fontSize: "18cqh",
    fontWeight: 800,

    lineHeight: 1,

    letterSpacing: "0.035em",

    color: "#ffffff",

    textShadow: `
      1px 0 0 rgba(255,43,214,0.4),
      -1px 0 0 rgba(32,234,255,0.4),
      0 0 6px rgba(255,255,255,0.15)
    `,
  };

  const titleAccentStyle: CSSProperties = {
    width: "9cqw",
    height: "2cqh",

    marginTop: "4cqh",
    marginBottom: "4cqh",

    background: "#ff2bd6",

    boxShadow: "0 0 6px rgba(255,43,214,0.55)",
  };

  const destinationStyle: CSSProperties = {
    fontSize: "7cqh",
    fontWeight: 1000,

    letterSpacing: "0.18em",

    color: "#00e5ff",

    textTransform: "uppercase",
  };

  // =========================
  // CONTROLS
  // =========================

  const controlAreaStyle: CSSProperties = {
    position: "absolute",

    right: "6cqw",
    top: "30cqh",

    width: "32cqw",
    height: "52cqh",

    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    justifyContent: "center",

    minWidth: 0,
  };

  const controlLabelStyle: CSSProperties = {
    fontSize: "6cqh",
    fontWeight: 1000,

    letterSpacing: "0.16em",

    color: "#00e5ff",

    marginBottom: "3cqh",
  };

  const controlsStyle: CSSProperties = {
    display: "flex",

    alignItems: "center",
    justifyContent: "center",

    width: "100%",

    gap: "1cqw",
  };

  const arrowButtonStyle: CSSProperties = {
    width: "5cqw",
    height: "30cqh",

    border: "none",

    background: "transparent",

    color: "#ffffff",

    font: "inherit",

    fontSize: "28cqh",
    fontWeight: 1000,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: 0,

    cursor: "pointer",

    textShadow: "0 0 5px rgba(250,243,243,0.38)",
  };

  const warpButtonStyle: CSSProperties = {
    width: "18cqw",
    height: "30cqh",

    flexShrink: 0,

    border: "1px solid rgba(255,43,214,0.72)",

    background: "rgba(255,43,213,0.58)",

    color: "#ffffff",

    font: "inherit",

    fontSize: "8cqh",
    fontWeight: 1000,

    letterSpacing: "0.18em",

    cursor: "pointer",

    clipPath: "polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)",

    textShadow: "0 0 5px rgb(112,22,94)",
  };

  return (
    <div style={panelWrapperStyle}>
      <section style={panelStyle} aria-label="Project navigation">
        <div style={magentaEdgeStyle} />

        {/* HEADER */}

        <div style={headerStyle}>
          <span style={headerLabelStyle}>PROJECT // NAV</span>

          <span style={countStyle}>
            {String(selectedIndex + 1).padStart(2, "0")}

            {" / "}

            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* MAIN CONTENT */}

        <div style={bodyStyle}>
          <div style={projectStyle}>
            <h2 style={titleStyle}>{selected.title}</h2>

            <div style={titleAccentStyle} />

            <div style={destinationStyle}>DESTINATION // {selected.id}</div>
          </div>

          <div style={controlAreaStyle}>
            <div style={controlLabelStyle}>SELECT DESTINATION</div>

            <div style={controlsStyle}>
              <button
                type="button"
                style={arrowButtonStyle}
                onClick={selectPrevious}
                aria-label="Previous project"
              >
                ‹
              </button>

              <button
                type="button"
                style={warpButtonStyle}
                onClick={handleWarp}
              >
                WARP
              </button>

              <button
                type="button"
                style={arrowButtonStyle}
                onClick={selectNext}
                aria-label="Next project"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INDEPENDENT MAGENTA OUTER BORDER. */}

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={borderSvgStyle}
        aria-hidden="true"
      >
        <polygon
          points="2.12,0 97.88,0 100,100 0,100"
          fill="none"
          stroke="#ff2bd6"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}