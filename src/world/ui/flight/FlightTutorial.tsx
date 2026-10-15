import { useEffect, useState, type CSSProperties } from "react";

import { useViewStore } from "../../../stores/useViewStore";
import { useProjectStore } from "../../../stores/useProjectStore";
import { useShipStore } from "../../../stores/useShipStore";

const cyan = "#28eaff";
const magenta = "#ff2bd5";

const keyStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 34,
  height: 32,
  padding: "0 9px",
  border: `1px solid ${cyan}`,
  borderRadius: 4,
  background: "rgba(20, 85, 105, 0.45)",
  color: "#ffffff",
  fontFamily: "monospace",
  fontSize: 12,
  fontWeight: 700,
  boxShadow: "inset 0 0 10px rgba(40,234,255,0.12)",
};

const controls = [
  {
    keys: ["W", "S"],
    title: "Forward / Reverse",
    description: "Fly forward or move backward",
  },
  {
    keys: ["A", "D"],
    title: "Turn",
    description: "Steer left and right",
  },
  {
    keys: ["SPACE", "CTRL"],
    title: "Pitch",
    description: "Point the nose up or down",
  },
  {
    keys: ["SHIFT"],
    title: "Speed",
    description: "Cycle through flight speeds",
  },
  {
    keys: ["C"],
    title: "Cockpit",
    description: "Switch between cockpit and flight views",
  },
];

export default function FlightTutorial() {
  const viewMode = useViewStore((state) => state.viewMode);
  const introComplete = useViewStore((state) => state.introComplete);
  const transitionProgress = useViewStore((state) => state.transitionProgress);
  const tutorialOpen = useViewStore((state) => state.flightTutorialOpen);
  const dismissed = useViewStore((state) => state.flightTutorialDismissed);

  const viewerOpen = useProjectStore((state) => state.viewerOpen);

  const entryCinematic = useShipStore((state) => state.entryCinematic);
  const exitCinematic = useShipStore((state) => state.exitCinematic);

  const [showReminder, setShowReminder] = useState(false);

  const flightReady =
    introComplete &&
    viewMode === "chase" &&
    transitionProgress >= 0.999 &&
    !viewerOpen &&
    entryCinematic === null &&
    exitCinematic === null;

  // Automatically open once, when flight becomes available.
  useEffect(() => {
    if (flightReady && !dismissed && !tutorialOpen) {
      useViewStore.getState().openFlightTutorial();
    }
  }, [flightReady, dismissed, tutorialOpen]);

  useEffect(() => {
    if (!showReminder) return;

    const timeout = window.setTimeout(() => {
      setShowReminder(false);
    }, 6500);

    return () => window.clearTimeout(timeout);
  }, [showReminder]);

  const closeTutorial = () => {
    useViewStore.getState().closeFlightTutorial();
    setShowReminder(true);
  };

  const openTutorial = () => {
    setShowReminder(false);
    useViewStore.getState().openFlightTutorial();
  };

  if (!flightReady && !tutorialOpen) {
    return null;
  }

  return (
    <>
      {!tutorialOpen && flightReady && (
        <>
          <button
            type="button"
            onClick={openTutorial}
            style={{
              position: "fixed",
              bottom: 24,
              left: 24,
              zIndex: 900,
              padding: "10px 15px",
              border: `1px solid ${cyan}`,
              borderRadius: 5,
              background: "rgba(4, 17, 31, 0.88)",
              color: cyan,
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.08em",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(40,234,255,0.12)",
            }}
          >
            ? CONTROLS
          </button>

          {showReminder && (
            <div
              style={{
                position: "fixed",
                bottom: 82,
                left: 24,
                zIndex: 900,
                padding: "10px 14px",
                border: `1px solid ${cyan}55`,
                borderRadius: 4,
                background: "rgba(4, 17, 31, 0.88)",
                color: "#d6faff",
                fontFamily: "monospace",
                fontSize: 11,
                pointerEvents: "none",
              }}
            >
              WASD — FLY | SPACE/CTRL — PITCH | SHIFT — SPEED
            </div>
          )}
        </>
      )}

      {tutorialOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="flight-tutorial-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(1, 4, 13, 0.78)",
            backdropFilter: "blur(8px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 650,
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              padding: "clamp(20px, 4vw, 36px)",
              border: `2px solid ${cyan}`,
              background:
                "linear-gradient(145deg, rgba(8,30,46,0.98), rgba(5,8,23,0.98))",
              boxShadow: `
                0 0 40px rgba(0,220,255,0.14),
                inset 0 0 35px rgba(0,220,255,0.04)
              `,
              color: "#ffffff",
              fontFamily: "monospace",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: cyan,
                fontSize: 11,
                letterSpacing: "0.18em",
                marginBottom: 18,
              }}
            >
              FLIGHT SYSTEMS // INITIALISATION
            </div>

            <h2
              id="flight-tutorial-title"
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(24px, 4vw, 34px)",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              WELCOME, PILOT.
            </h2>

            <p
              style={{
                color: "#b9d7e4",
                fontSize: 13,
                lineHeight: 1.8,
                margin: "0 0 25px",
              }}
            >
              You're free to explore the digital world. Use your keyboard to
              pilot the ship and fly through glowing project billboards to
              discover what's inside.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {controls.map((control) => (
                <div
                  key={control.title}
                  style={{
                    padding: 14,
                    border: "1px solid rgba(40,234,255,0.22)",
                    background: "rgba(17,49,68,0.45)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginBottom: 11,
                    }}
                  >
                    {control.keys.map((key) => (
                      <span key={key} style={keyStyle}>
                        {key}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 5,
                    }}
                  >
                    {control.title}
                  </div>

                  <div
                    style={{
                      color: "#9dbbc9",
                      fontSize: 11,
                      lineHeight: 1.6,
                    }}
                  >
                    {control.description}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: 16,
                borderLeft: `3px solid ${magenta}`,
                background: "rgba(255,43,213,0.07)",
                color: "#d8eaf3",
                fontSize: 12,
                lineHeight: 1.8,
              }}
            >
              <strong style={{ color: magenta }}>YOUR MISSION</strong>
              <div style={{ marginTop: 5 }}>
                Hold W to move forward. Use A and D to steer toward a
                holographic billboard, then fly through it to open a project.
              </div>
            </div>

            <button
              type="button"
              onClick={closeTutorial}
              style={{
                width: "100%",
                marginTop: 24,
                padding: "15px 20px",
                border: `1px solid ${magenta}`,
                background: "rgba(165,20,140,0.35)",
                color: "#ffffff",
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.12em",
                cursor: "pointer",
                boxShadow: "0 0 18px rgba(255,43,213,0.15)",
              }}
            >
              BEGIN FLIGHT →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
