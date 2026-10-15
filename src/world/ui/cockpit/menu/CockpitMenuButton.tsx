import { useState, type CSSProperties, type ReactNode } from "react";

type MenuButtonKind = "about" | "skills" | "contact";

interface CockpitMenuButtonProps {
  children: string;
  kind: MenuButtonKind;
  active?: boolean;
  onClick: () => void;
  style?: CSSProperties;
  arrowRight?: string;
}

function AboutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 19c.5-4.2 2.7-6.2 6.5-6.2s6 2 6.5 6.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SkillsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 20 7 12 11 4 7 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m4 11 8 4 8-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m4 15 8 4 8-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4 7 8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ kind }: { kind: MenuButtonKind }) {
  const icons: Record<MenuButtonKind, ReactNode> = {
    about: <AboutIcon />,
    skills: <SkillsIcon />,
    contact: <ContactIcon />,
  };

  return icons[kind];
}

export default function CockpitMenuButton({
  children,
  kind,
  active = false,
  onClick,
  style,
  arrowRight = "10%",
}: CockpitMenuButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // OUTER BORDER / SHELL
  const buttonStyle: CSSProperties = {
    ...style,
    margin: 0,
    boxSizing: "border-box",
    containerType: "inline-size",
    border: "none",
    padding: 0,

    background: active
      ? "rgba(255,43,214,0.82)"
      : hovered
        ? "rgba(32,234,255,0.72)"
        : "rgba(110,135,150,0.52)",

    color: "#ffffff",
    font: "inherit",
    cursor: "pointer",
    overflow: "hidden",

    filter: active
      ? "drop-shadow(0 0 5px rgba(255,43,214,0.30))"
      : hovered
        ? "drop-shadow(0 0 4px rgba(32,234,255,0.38))"
        : "drop-shadow(0 0 2px rgba(32,234,255,0.12))",

    transform: pressed ? "translateY(1px)" : "translateY(0)",

    transition: `
      background 160ms ease,
      filter 160ms ease,
      transform 100ms ease
    `,
  };

  // INNER FACE
  const faceStyle: CSSProperties = {
    position: "absolute",
    inset: "1px",
    clipPath: "inherit",

    background: active
      ? `linear-gradient(
          90deg,
          rgba(255,43,214,0.16),
          rgba(22,27,39,0.72)
        )`
      : hovered
        ? `linear-gradient(
            90deg,
            rgba(25,39,49,0.76),
            rgba(12,25,36,0.68)
          )`
        : `linear-gradient(
            90deg,
            rgba(25,29,42,0.68),
            rgba(17,23,34,0.58)
          )`,

    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    pointerEvents: "none",
  };

  // ICON / TEXT / ARROW CONTENT
  const contentStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    padding: "0 7%",
    display: "grid",
    gridTemplateColumns: "clamp(9px, 10cqw, 27px) minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "clamp(3px, 4cqw, 11px)",
    minWidth: 0,
    pointerEvents: "none",
  };

  const iconStyle: CSSProperties = {
    width: "clamp(9px, 10cqw, 27px)",
    height: "clamp(9px, 10cqw, 27px)",
    color: "#ff2bd6",
    filter: "drop-shadow(0 0 4px rgba(255,43,214,0.44))",
  };

  const labelStyle: CSSProperties = {
    fontSize: "clamp(7px, 13cqw, 18px)",
    fontWeight: 650,
    letterSpacing: "clamp(0em, 0.12cqw, 0.025em)",
    textAlign: "left",
    whiteSpace: "nowrap",
    minWidth: 0,
    color: "#ffffff",
    textShadow: "0 0 4px rgba(255,255,255,0.12)",
  };

  const arrowStyle: CSSProperties = {
    position: "absolute",
    right: arrowRight,
    top: "50%",
    transform: "translateY(-50%)",
    color: active ? "#ff2bd6" : hovered ? "#ffffff" : "#20eaff",
    fontSize: "clamp(9px, 10cqw, 25px)",
    fontWeight: 800,
    lineHeight: 1,
    textAlign: "center",

    textShadow: hovered
      ? "0 0 4px currentColor, 0 0 9px currentColor"
      : "0 0 5px currentColor",

    transition: "color 160ms ease, text-shadow 160ms ease",
  };

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
    >
      <div style={faceStyle} />

      <div style={contentStyle}>
        <div style={iconStyle}>
          <MenuIcon kind={kind} />
        </div>

        <span style={labelStyle}>{children}</span>
        <span style={arrowStyle}>›</span>
      </div>
    </button>
  );
}
