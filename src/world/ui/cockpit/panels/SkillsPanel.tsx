import type { CSSProperties } from "react";

interface SkillsPanelProps {
  onClose: () => void;
}

const CYAN = "#20eaff";
const MAGENTA = "#ff2bd6";

const skillGroups = [
  {
    id: "01",
    title: "PROGRAMMING LANGUAGES",
    skills: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Java",
      "SQL",
      "HTML",
      "CSS",
      "Kotlin",
      "C",
    ],
  },
  {
    id: "02",
    title: "FRONTEND & APPLICATION FRAMEWORKS",
    skills: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Three.js",
      "React Three Fiber",
      "Drei",
      "Tailwind CSS",
      "Bootstrap",
      "Electron",
      "Zustand",
    ],
  },
  {
    id: "03",
    title: "BACKEND & DATABASES",
    skills: [
      "Node.js",
      "Express.js",
      "Flask",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Firebase",
      "Supabase",
    ],
  },
  {
    id: "04",
    title: "CISCO & NETWORKING",
    skills: [
      "Cisco IOS",
      "Cisco Packet Tracer",
      "TCP/IP",
      "IPv4 / IPv6",
      "Routing & Switching",
      "VLANs",
      "Subnetting",
      "DNS",
      "DHCP",
      "NAT",
    ],
  },
  {
    id: "05",
    title: "CLOUD & SYSTEMS",
    skills: [
      "Amazon Web Services (AWS)",
      "Docker",
      "Linux",
      "Bash",
      "Windows",
      "VirtualBox",
      "Linux System Administration",
    ],
  },
  {
    id: "06",
    title: "CYBERSECURITY & MACHINE LEARNING",
    skills: [
      "Network Security",
      "Linux Security",
      "Cryptography",
      "Access Control",
      "Naive Bayes",
      "Contextual Multi-Armed Bandits",
    ],
  },
  {
    id: "07",
    title: "DESIGN & DEVELOPMENT TOOLS",
    skills: [
      "Figma",
      "Adobe Creative Cloud",
      "Git",
      "GitHub",
      "Jira",
      "Android Studio",
      "VS Code",
      "DBeaver",
      "Jupyter Notebook",
    ],
  },
];

export default function SkillsPanel({ onClose }: SkillsPanelProps) {
  const groupTitle: CSSProperties = {
    margin: "0 0 13px",
    fontSize: 12,
    color: MAGENTA,
    fontWeight: 700,
    letterSpacing: "0.12em",
  };

  return (
    <section
      aria-label="Technical skills"
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
            SYSTEM CAPABILITIES // 002
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(22px, 2.5vw, 32px)",
            }}
          >
            TECHNICAL SKILLS
          </h2>

          <div
            style={{
              color: MAGENTA,
              fontSize: 12,
              letterSpacing: "0.06em",
            }}
          >
            DEVELOPMENT // DESIGN // ENGINEERING
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Skills panel"
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 20,
        }}
      >
        {skillGroups.map((group) => (
          <div
            key={group.id}
            style={{
              border: "1px solid rgba(32,234,255,0.22)",
              background: "rgba(32,234,255,0.035)",
              padding: 16,
            }}
          >
            <h3 style={groupTitle}>
              {group.id} // {group.title}
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "6px 9px",
                    border: "1px solid rgba(32,234,255,0.3)",
                    background: "rgba(32,234,255,0.07)",
                    color: "#d4f6ff",
                    fontSize: 11,
                    letterSpacing: "0.02em",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
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
        CAPABILITIES DATABASE // END OF RECORD
      </footer>
    </section>
  );
}
