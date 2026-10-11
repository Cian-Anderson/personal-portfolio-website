// Project detail panel.

import type { PortfolioProject } from "../projectTypes";
import MarkdownRenderer from "./MarkdownRenderer";

interface ProjectDetailsProps {
  project: PortfolioProject;
  onBack: () => void;
  onClose: () => void;
}

export default function ProjectDetails({
  project,
  onBack,
  onClose,
}: ProjectDetailsProps) {
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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 32px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                color: "#20eaff",
                letterSpacing: "0.18em",
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              PROJECT // TECHNICAL ARCHIVE
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "48px",
              }}
            >
              {project.title}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              BACK
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              CLOSE
            </button>
          </div>
        </div>

        {project.readme ? (
          <MarkdownRenderer markdown={project.readme} />
        ) : (
          <p>No additional project information available.</p>
        )}
      </div>
    </div>
  );
}