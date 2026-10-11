import { useShipStore } from "../../../stores/useShipStore";

export default function ProjectEntryOverlay() {
  const entry = useShipStore((state) => state.entryCinematic);

  if (!entry) return null;

  const progress = Math.min(entry.elapsed / entry.duration, 1);

  // Interference builds as the ship enters.
  const interference = Math.min(Math.max((progress - 0.15) / 0.45, 0), 1);

  // The digital surface takes over the screen.
  const coverage = Math.min(Math.max((progress - 0.45) / 0.45, 0), 1);

  const tunnelScale = 1 + progress * 4;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
        background: `rgba(2, 3, 12, ${coverage})`,
      }}
    >
      {/* Cyan/magenta data interference */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interference * (1 - coverage),
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 5px,
              rgba(0, 235, 255, 0.25) 6px,
              transparent 8px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 48px,
              rgba(255, 30, 210, 0.15) 49px,
              transparent 51px
            )
          `,
          transform: `scale(${tunnelScale})`,
          transformOrigin: "center",
        }}
      />

      {/* Bright central data aperture */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "min(65vw, 800px)",
          height: "min(45vh, 450px)",
          transform: `
            translate(-50%, -50%)
            scale(${0.3 + progress * 5})
          `,
          opacity: Math.max(0, interference * (1 - coverage)),
          border: "2px solid rgba(0,235,255,0.8)",
          boxShadow: `
            0 0 35px rgba(0,235,255,0.4),
            inset 0 0 35px rgba(255,30,210,0.2)
          `,
          background:
            "radial-gradient(ellipse, rgba(0,235,255,0.08), transparent 70%)",
        }}
      />

      {/* Brief bright transition near the end */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#a8faff",
          opacity:
            progress > 0.88
              ? Math.sin(((progress - 0.88) / 0.12) * Math.PI) * 0.65
              : 0,
        }}
      />

      {/* Minimal system status */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "12%",
          transform: "translateX(-50%)",
          color: "#9cfaff",
          fontFamily: "monospace",
          fontSize: "12px",
          letterSpacing: "0.28em",
          textAlign: "center",
          whiteSpace: "nowrap",
          opacity: Math.min(interference * 1.5, 1),
          textShadow: "0 0 12px #00eaff",
        }}
      >
        ACCESSING ARCHIVE // {Math.floor(progress * 100)}%
      </div>
    </div>
  );
}
