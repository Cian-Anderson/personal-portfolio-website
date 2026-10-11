// Free-flight toggle.

import { useEffect, type CSSProperties } from "react";

import { useViewStore } from "../../../../stores/useViewStore";

interface FreeFlightButtonProps {
  clipPath: string;
  perspectiveAngle: number;
}

export default function FreeFlightButton({
  clipPath,
  perspectiveAngle,
}: FreeFlightButtonProps) {
  useEffect(() => {
    const styleId = "free-flight-button-effects";

    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");

    style.id = styleId;

    style.textContent = `
      @keyframes freeFlightCyanPulse {
        0%,
        100% {
          opacity: 1;
        }

        50% {
          opacity: 0.18;
        }
      }

      @keyframes freeFlightMagentaPulse {
        0%,
        100% {
          opacity: 0.12;
        }

        50% {
          opacity: 1;
        }
      }

      @keyframes freeFlightFacePulse {
        0%,
        100% {
          background-color:
            rgba(9, 22, 31, 0.94);
        }

        50% {
          background-color:
            rgba(22, 13, 31, 0.94);
        }
      }

      .free-flight-root:hover
      .free-flight-cyan-edge {
        filter:
          drop-shadow(
            0 0 4px
            rgba(32, 234, 255, 1)
          )
          drop-shadow(
            0 0 12px
            rgba(32, 234, 255, 0.75)
          )
          drop-shadow(
            0 0 22px
            rgba(32, 234, 255, 0.35)
          );
      }

      .free-flight-root:hover
      .free-flight-magenta-edge {
        filter:
          drop-shadow(
            0 0 4px
            rgba(255, 43, 214, 1)
          )
          drop-shadow(
            0 0 12px
            rgba(255, 43, 214, 0.75)
          )
          drop-shadow(
            0 0 22px
            rgba(255, 43, 214, 0.35)
          );
      }

      .free-flight-root:hover
      .free-flight-text {
        text-shadow:
          0 0 5px rgba(255,255,255,0.8),
          0 0 12px rgba(32,234,255,0.5);
      }

      .free-flight-root:hover
      .free-flight-face {
        filter: brightness(1.18);
      }

      .free-flight-root:active
      .free-flight-content {
        transform:
          translateY(2px)
          rotate(var(--flight-angle));
      }
    `;

    document.head.appendChild(style);
  }, []);

  const handleClick = () => {
    const view = useViewStore.getState();

    view.completeIntro();
    view.setViewMode("chase");
  };

  // =========================
  // ROOT
  // =========================

  const rootStyle = {
    position: "relative",

    width: "100%",
    height: "100%",

    cursor: "pointer",

    overflow: "visible",

    "--flight-angle": `${perspectiveAngle}deg`,
  } as CSSProperties;

  // =========================
  // OUTER CYAN EDGE
  // =========================

  const cyanEdgeStyle: CSSProperties = {
    position: "absolute",

    inset: 0,

    clipPath,

    background: "#20eaff",

    pointerEvents: "none",

    animation: "freeFlightCyanPulse 6s ease-in-out infinite",

    filter: `
      drop-shadow(
        0 0 3px
        rgba(32,234,255,0.95)
      )
      drop-shadow(
        0 0 9px
        rgba(32,234,255,0.5)
      )
      drop-shadow(
        0 0 16px
        rgba(32,234,255,0.22)
      )
    `,

    transition: "filter 180ms ease",
  };

  // =========================
  // MAGENTA EDGE
  // =========================

  const magentaEdgeStyle: CSSProperties = {
    position: "absolute",

    inset: 0,

    clipPath,

    background: "#ff2bd6",

    pointerEvents: "none",

    animation: "freeFlightMagentaPulse 6s ease-in-out infinite",

    filter: `
      drop-shadow(
        0 0 3px
        rgba(255,43,214,0.9)
      )
      drop-shadow(
        0 0 9px
        rgba(255,43,214,0.45)
      )
      drop-shadow(
        0 0 16px
        rgba(255,43,214,0.2)
      )
    `,

    transition: "filter 180ms ease",
  };

  const baseStyle: CSSProperties = {
    position: "absolute",

    left: "2.5%",
    top: "5%",

    width: "100%",
    height: "100%",

    clipPath,

    background: "rgba(0, 5, 10, 0.95)",

    filter: `
    drop-shadow(0 5px 5px rgba(0,0,0,0.7))
    drop-shadow(0 0 5px rgba(32,234,255,0.12))
  `,

    pointerEvents: "none",
  };

  // =========================
  // INNER BUTTON FACE
  // =========================

  /*
   * This sits slightly inside the coloured
   * layers, leaving a visible neon edge
   * around the trapezoid.
   */
  const faceStyle: CSSProperties = {
    position: "absolute",

    inset: "3px",

    clipPath,

    border: "none",

    padding: 0,

    margin: 0,

    boxShadow: `
      inset 0 2px 2px rgba(255,255,255,0.10),
      inset 0 -5px 8px rgba(0,0,0,0.50)
    `,

    backgroundColor: "rgba(9,22,31,0.94)",

    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        rgba(32,234,255,0.035) 0px,
        rgba(32,234,255,0.035) 1px,
        transparent 1px,
        transparent 5px
      )
    `,

    cursor: "pointer",

    animation: "freeFlightFacePulse 6s ease-in-out infinite",

    transition: "filter 180ms ease",
  };

  // =========================
  // CONTENT
  // =========================

  const contentStyle: CSSProperties = {
    position: "absolute",

    inset: 0,

    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    justifyContent: "center",

    gap: "0.45em",

    pointerEvents: "none",

    /*
     * THIS is what makes the text follow
     * the cyan cockpit-panel slope.
     */
    transform: `
      rotate(${perspectiveAngle}deg)
    `,

    transformOrigin: "center center",

    transition: "transform 100ms ease",
  };

  // =========================
  // SMALL TOP LABEL
  // =========================

  const eyebrowStyle: CSSProperties = {
    color: "#20eaff",

    fontSize: "clamp(7px, 0.42vw, 10px)",

    fontWeight: 900,

    letterSpacing: "0.22em",

    lineHeight: 1,

    textTransform: "uppercase",

    opacity: 0.9,

    whiteSpace: "nowrap",
  };

  // =========================
  // MAIN LABEL
  // =========================

  const textStyle: CSSProperties = {
    color: "#ffffff",

    fontSize: "clamp(14px, 1.05vw, 24px)",

    fontWeight: 900,

    letterSpacing: "0.08em",

    lineHeight: 1,

    textTransform: "uppercase",

    whiteSpace: "nowrap",

    textShadow: `
      0 0 4px
      rgba(255,255,255,0.4)
    `,

    transition: "text-shadow 180ms ease",
  };

  // =========================
  // LOWER CTA
  // =========================

  const engageStyle: CSSProperties = {
    color: "#ff2bd6",

    fontSize: "clamp(7px, 0.4vw, 10px)",

    fontWeight: 900,

    letterSpacing: "0.2em",

    lineHeight: 1,

    textTransform: "uppercase",

    whiteSpace: "nowrap",
  };

  return (
    <div className="free-flight-root" style={rootStyle}>
      {/* Neon border/glow */}

      <div className="free-flight-cyan-edge" style={cyanEdgeStyle} />

      <div className="free-flight-magenta-edge" style={magentaEdgeStyle} />

      <div style={baseStyle} />

      <div className="free-flight-cyan-edge" style={cyanEdgeStyle} />

      <div className="free-flight-magenta-edge" style={magentaEdgeStyle} />

      {/* Actual clickable face */}

      <button
        type="button"
        className="free-flight-face"
        style={faceStyle}
        onClick={handleClick}
        aria-label="Enter free flight"
      >
        <div className="free-flight-content" style={contentStyle}>
          <span style={eyebrowStyle}>FLIGHT MODE</span>

          <span className="free-flight-text" style={textStyle}>
            FREE FLIGHT
          </span>

          <span style={engageStyle}>ENGAGE ›</span>
        </div>
      </button>
    </div>
  );
}