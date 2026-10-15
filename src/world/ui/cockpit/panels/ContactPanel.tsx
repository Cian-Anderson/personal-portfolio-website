// Contact panel.

import type { CSSProperties } from "react";

interface ContactPanelProps {
  onClose: () => void;
}

const CYAN = "#20eaff";
const MAGENTA = "#ff2bd6";

const contactLinks = [
  {
    id: "01",
    label: "EMAIL",
    value: "ciananderson2001@gmail.com",
    href: "mailto:ciananderson2001@gmail.com",
    external: false,
  },
  {
    id: "02",
    label: "LINKEDIN",
    value: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/cian-anderson-b0414a32a/",
    external: true,
  },
  {
    id: "03",
    label: "GITHUB",
    value: "Explore my repositories",
    href: "https://github.com/cian-collage",
    external: true,
  },
];

export default function ContactPanel({ onClose }: ContactPanelProps) {
  const description: CSSProperties = {
    margin: "0 0 24px",
    color: "#c7dce8",
    fontSize: 13,
    lineHeight: 1.8,
  };

  return (
    <section
      aria-label="Contact information"
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflowY: "auto",
        padding: "clamp(16px, 2.5vw, 30px)",
        border: `2px solid ${CYAN}`,
        background:
          "linear-gradient(145deg, rgba(7,28,43,0.96), rgba(5,9,25,0.96))",
        boxShadow:
          "0 0 24px rgba(32,234,255,0.18), inset 0 0 25px rgba(32,234,255,0.04)",
        backdropFilter: "blur(8px)",
        color: "#ffffff",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              color: CYAN,
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              marginBottom: 10,
            }}
          >
            COMMUNICATIONS // 003
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(22px, 2.5vw, 32px)",
            }}
          >
            ESTABLISH CONTACT
          </h2>

          <div
            style={{
              color: MAGENTA,
              fontSize: 12,
              letterSpacing: "0.06em",
            }}
          >
            AVAILABLE COMMUNICATION CHANNELS
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Contact panel"
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            border: `1px solid ${CYAN}`,
            background: "rgba(32,234,255,0.08)",
            color: CYAN,
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </header>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, #20eaff, #ff2bd6, transparent)",
          marginBottom: 24,
        }}
      />

      <p style={description}>
        I'm interested in graduate software development and IT opportunities,
        collaborative projects, and new technical challenges. If you'd like to
        get in touch, you can reach me through any of the channels below.
      </p>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        {contactLinks.map((contact) => (
          <a
            key={contact.id}
            href={contact.href}
            target={contact.external ? "_blank" : undefined}
            rel={contact.external ? "noopener noreferrer" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "16px",
              border: "1px solid rgba(32,234,255,0.35)",
              background: "rgba(32,234,255,0.055)",
              color: "#ffffff",
              textDecoration: "none",
              transition: "background 160ms ease, border-color 160ms ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(32,234,255,0.12)";
              event.currentTarget.style.borderColor = CYAN;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(32,234,255,0.055)";
              event.currentTarget.style.borderColor = "rgba(32,234,255,0.35)";
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: MAGENTA,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  marginBottom: 7,
                }}
              >
                {contact.id} // {contact.label}
              </div>

              <div
                style={{
                  color: "#d4f6ff",
                  fontSize: 13,
                  overflowWrap: "anywhere",
                }}
              >
                {contact.value}
              </div>
            </div>

            <span
              aria-hidden="true"
              style={{
                color: CYAN,
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              ↗
            </span>
          </a>
        ))}
      </div>

      <footer
        style={{
          marginTop: 26,
          paddingTop: 12,
          borderTop: "1px solid rgba(32,234,255,0.2)",
          color: "#7295a8",
          fontFamily: "monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
        }}
      >
        COMMUNICATIONS SYSTEM // ONLINE
      </footer>
    </section>
  );
}
