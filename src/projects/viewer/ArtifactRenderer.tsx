// Project artifact renderer.

import { useEffect, useRef, useState } from "react";

import type { ProjectArtifact, ProjectDemoDisclaimer } from "../projectTypes";

interface ArtifactRendererProps {
  artifact: ProjectArtifact;
  demoDisclaimer?: ProjectDemoDisclaimer;
}

export default function ArtifactRenderer({
  artifact,
  demoDisclaimer,
}: ArtifactRendererProps) {
  switch (artifact.type) {
    case "html":
      return <HtmlPreview src={artifact.src} demoDisclaimer={demoDisclaimer} />;

    case "web":
      return (
        <iframe
          src={artifact.url}
          title="Project"
          style={{
            width: "100%",
            height: "700px",
            border: 0,
          }}
        />
      );

    case "video":
      return <VideoPreview src={artifact.src} poster={artifact.poster} />;

    case "gallery":
      return (
        <div>
          {artifact.images.map((image) => (
            <img
              key={image}
              src={image}
              alt=""
              style={{
                width: "100%",
                display: "block",
                marginBottom: "16px",
              }}
            />
          ))}
        </div>
      );

    case "none":
      return (
        <div
          style={{
            minHeight: "320px",
            display: "grid",
            placeItems: "center",
            opacity: 0.6,
          }}
        >
          {artifact.message ?? "No preview available."}
        </div>
      );
  }
}

interface HtmlPreviewProps {
  src: string;
  demoDisclaimer?: ProjectDemoDisclaimer;
}

function HtmlPreview({ src, demoDisclaimer }: HtmlPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  const hasDemoDisclaimer = Boolean(demoDisclaimer);

  const [demoEntered, setDemoEntered] = useState(!hasDemoDisclaimer);

  /*
   * Existing fullscreen behaviour.
   */
  useEffect(() => {
    if (!expanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  return (
    <div
      style={
        expanded
          ? {
              position: "fixed",
              inset: 0,
              zIndex: 100000,

              display: "flex",
              flexDirection: "column",

              padding: "16px",

              background: "#02050a",
            }
          : {
              position: "relative",
              width: "100%",
            }
      }
    >
      {/* Fullscreen / minimise control */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",

          marginBottom: "10px",
        }}
      >
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-label={
            expanded ? "Minimise project preview" : "Fullscreen project preview"
          }
          style={{
            padding: "10px 18px",

            border: "1px solid #20eaff",
            background: "rgba(2, 5, 10, 0.96)",

            color: "#20eaff",

            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",

            cursor: "pointer",

            boxShadow: "0 0 14px rgba(32, 234, 255, 0.12)",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "rgba(32, 234, 255, 0.12)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "rgba(2, 5, 10, 0.96)";
          }}
        >
          {expanded ? "MINIMISE" : "FULLSCREEN"}
        </button>
      </div>

      {/*
       * Relative wrapper allows the disclaimer to sit directly
       * over the project iframe.
       */}
      <div
        style={{
          position: "relative",

          width: "100%",

          height: expanded ? undefined : "700px",

          flex: expanded ? 1 : undefined,
          minHeight: 0,

          overflow: "hidden",

          background: "#02050a",

          border: expanded ? "1px solid rgba(32, 234, 255, 0.55)" : undefined,
        }}
      >
        <iframe
          src={src}
          title="Project"
          style={{
            width: "100%",
            height: "100%",

            display: "block",

            border: 0,

            background: "#ffffff",

            /*
             * If this project requires a demo disclaimer,
             * show it blurred and prevent interaction until
             * the user clicks Continue.
             */
            filter: demoEntered ? "none" : "blur(7px)",

            transform: demoEntered ? "scale(1)" : "scale(1.015)",

            pointerEvents: demoEntered ? "auto" : "none",

            transition: "filter 300ms ease, transform 300ms ease",
          }}
        />

        {!demoEntered && demoDisclaimer && (
          <DemoDisclaimerOverlay
            disclaimer={demoDisclaimer}
            onContinue={() => setDemoEntered(true)}
          />
        )}
      </div>
    </div>
  );
}

interface DemoDisclaimerOverlayProps {
  disclaimer: ProjectDemoDisclaimer;
  onContinue: () => void;
}

function DemoDisclaimerOverlay({
  disclaimer,
  onContinue,
}: DemoDisclaimerOverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: "28px",

        background: "rgba(2, 5, 10, 0.58)",

        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div
        role="dialog"
        aria-labelledby="demo-disclaimer-title"
        aria-describedby="demo-disclaimer-summary"
        style={{
          width: "min(620px, 100%)",

          maxHeight: "calc(100% - 20px)",
          overflowY: "auto",

          padding: "28px 30px",

          background: "rgba(3, 10, 16, 0.96)",

          border: "1px solid #20eaff",

          color: "#ffffff",

          boxShadow: "0 0 36px rgba(32, 234, 255, 0.1)",
        }}
      >
        <div
          style={{
            marginBottom: "8px",

            color: "#20eaff",

            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          PROJECT DEMO // NOTICE
        </div>

        <h3
          id="demo-disclaimer-title"
          style={{
            margin: "0 0 16px",

            color: "#ffffff",

            fontSize: "26px",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {disclaimer.title}
        </h3>

        <p
          id="demo-disclaimer-summary"
          style={{
            margin: "0 0 20px",

            color: "rgba(255, 255, 255, 0.84)",

            fontSize: "15px",
            lineHeight: 1.65,
          }}
        >
          {disclaimer.summary}
        </p>

        {disclaimer.details && disclaimer.details.length > 0 && (
          <ul
            style={{
              margin: "0 0 24px",
              paddingLeft: "20px",

              color: "rgba(255, 255, 255, 0.68)",

              fontSize: "13px",
              lineHeight: 1.65,
            }}
          >
            {disclaimer.details.map((detail) => (
              <li
                key={detail}
                style={{
                  marginBottom: "8px",
                }}
              >
                {detail}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={onContinue}
          style={{
            minHeight: "44px",

            padding: "12px 22px",

            border: "1px solid #20eaff",

            background: "rgba(32, 234, 255, 0.1)",

            color: "#20eaff",

            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",

            cursor: "pointer",

            boxShadow: "0 0 14px rgba(32, 234, 255, 0.1)",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "rgba(32, 234, 255, 0.18)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "rgba(32, 234, 255, 0.1)";
          }}
        >
          {disclaimer.continueLabel ?? "CONTINUE"}
        </button>
      </div>
    </div>
  );
}

interface VideoPreviewProps {
  src: string;
  poster?: string;
}

function VideoPreview({ src, poster }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [started, setStarted] = useState(false);

  const handlePlay = async () => {
    setStarted(true);

    requestAnimationFrame(() => {
      videoRef.current?.play();
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",

        background: "#02050a",

        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started}
        style={{
          width: "100%",
          maxHeight: "700px",

          display: "block",

          objectFit: "contain",
        }}
      />

      {!started && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play demo video"
          style={{
            position: "absolute",
            inset: 0,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            gap: "18px",

            width: "100%",
            height: "100%",

            padding: 0,

            cursor: "pointer",

            background: "rgba(2, 5, 10, 0.68)",

            border: 0,
            color: "#ffffff",

            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              color: "#20eaff",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "0.18em",
            }}
          >
            DEMO VIDEO
          </div>

          <div
            style={{
              width: "70px",
              height: "70px",

              display: "grid",
              placeItems: "center",

              border: "2px solid #ff2bd6",

              color: "#ff2bd6",

              fontSize: "34px",
              lineHeight: 1,

              boxShadow: "0 0 18px rgba(255, 43, 214, 0.25)",
            }}
          >
            ▶
          </div>

          <div
            style={{
              color: "#20eaff",

              fontSize: "12px",
              letterSpacing: "0.16em",
            }}
          >
            CLICK TO PLAY
          </div>
        </button>
      )}
    </div>
  );
}