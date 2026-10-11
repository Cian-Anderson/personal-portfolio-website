// Project viewer shell.

import { useState } from "react";

import type { PortfolioProject } from "../projectTypes";
import ArtifactRenderer from "./ArtifactRenderer";
import ProjectDetails from "./ProjectDetails";

interface ProjectViewerProps {
  project: PortfolioProject;
  onClose: () => void;
}

export default function ProjectViewer({
  project,
  onClose,
}: ProjectViewerProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <ProjectDetails
        project={project}
        onBack={() => setShowDetails(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        overflowY: "auto",
        background: "#05080d",
        color: "#ffffff",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 32px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                color: "#20eaff",
                fontSize: "14px",
                letterSpacing: "0.18em",
                marginBottom: "12px",
              }}
            >
              PROJECT // {project.id.toUpperCase()}
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "56px",
                lineHeight: 1,
              }}
            >
              {project.title}
            </h1>

            {project.subtitle && (
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "20px",
                  opacity: 0.75,
                }}
              >
                {project.subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.7,
            maxWidth: "800px",
          }}
        >
          {project.summary}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            margin: "24px 0 40px",
          }}
        >
          {project.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                border: "1px solid #20eaff",
                padding: "6px 10px",
                color: "#20eaff",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          {project.readme && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              style={{
                minHeight: "42px",
                padding: "12px 20px",
                cursor: "pointer",
                background: "transparent",
                color: "#20eaff",
                border: "1px solid #20eaff",
                fontFamily: "inherit",
                letterSpacing: "0.08em",
                boxSizing: "border-box",
              }}
            >
              MORE INFO
            </button>
          )}

          {project.reportUrl && (
            <a
              href={project.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: "42px",
                padding: "12px 20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b86cff",
                border: "1px solid #b86cff",
                textDecoration: "none",
                fontFamily: "inherit",
                letterSpacing: "0.08em",
                boxSizing: "border-box",
              }}
            >
              FULL PROJECT REPORT
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: "42px",
                padding: "12px 20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ff2bd6",
                border: "1px solid #ff2bd6",
                textDecoration: "none",
                fontFamily: "inherit",
                letterSpacing: "0.08em",
                boxSizing: "border-box",
              }}
            >
              GITHUB Repository
            </a>
          )}

          {project.downloadUrl && (
            <a
              href={project.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: "42px",
                padding: "12px 20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#20eaff",
                border: "1px solid #20eaff",
                background: "rgba(32, 234, 255, 0.08)",
                textDecoration: "none",
                fontFamily: "inherit",
                letterSpacing: "0.08em",
                boxSizing: "border-box",
              }}
            >
              {project.downloadLabel ?? "DOWNLOAD"}
            </a>
          )}
        </div>

        <section style={{ marginBottom: "56px" }}>
          <h2>
            {project.demoDisclaimer ? "PROJECT DEMO" : "FINISHED PROJECT"}
          </h2>

          <div
            style={{
              border: "1px solid rgba(32,234,255,0.45)",
              minHeight: "320px",
              marginTop: "16px",
            }}
          >
            <ArtifactRenderer
              artifact={project.artifact}
              demoDisclaimer={project.demoDisclaimer}
            />
          </div>
        </section>
      </div>
    </div>
  );
}