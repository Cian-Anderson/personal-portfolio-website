import type { CSSProperties } from "react";

interface AboutPanelProps {
  onClose: () => void;
}

const CYAN = "#20eaff";
const MAGENTA = "#ff2bd6";

const sectionTitle: CSSProperties = {
  margin: "0 0 12px",
  color: MAGENTA,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.14em",
};

const paragraph: CSSProperties = {
  margin: "0 0 14px",
  color: "#c7dce8",
  fontSize: 13,
  lineHeight: 1.8,
};

const section: CSSProperties = {
  marginBottom: 28,
};

export default function AboutPanel({ onClose }: AboutPanelProps) {
  return (
    <section
      aria-label="About Cian Anderson"
      style={{
        position: "relative",
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
      {/* HEADER */}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
            PERSONNEL FILE // 001
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 700,
            }}
          >
            CIAN ANDERSON
          </h2>

          <div
            style={{
              color: MAGENTA,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            COMPUTER SCIENCE (INFRASTRUCTURE) GRADUATE
            {" // "}
            FULL-STACK DEVELOPER
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close About panel"
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

      {/* 01 — MY BACKGROUND */}

      <div style={section}>
        <h3 style={sectionTitle}>01 // MY BACKGROUND</h3>

        <p style={paragraph}>
          I'm a Computer Science (Infrastructure) graduate from Technological
          University Dublin, with a broad technical background spanning software
          development, user-focused applications, IT infrastructure, networking,
          cybersecurity, databases, and systems design.
        </p>

        <p style={paragraph}>
          Through my degree, professional experience, and personal projects,
          I've gained experience across multiple areas of computing, from
          designing and developing full-stack web and desktop applications to
          working with machine learning, software architecture, and the
          infrastructure that supports them.
        </p>

        <p style={paragraph}>
          During my time on the Global Innovation Programme, I worked as part of
          a multidisciplinary development team to deliver a
          Software-as-a-Service (SaaS) application for a real-world client. This
          gave me valuable experience translating client requirements into
          practical solutions, collaborating across different disciplines, and
          contributing throughout the software development lifecycle.
        </p>

        <p style={paragraph}>
          Before pursuing computer science, I spent three years studying
          architecture, which gave me a strong appreciation for the design
          process. Working on projects shaped by client briefs and specific
          requirements taught me how to research a problem, understand a
          client's needs, and tailor designs to meet their specifications. It
          also reinforced the importance of careful planning, iterative design,
          and understanding how early decisions influence the finished product.
          These principles have continued to shape how I approach software
          development.
        </p>

        <p style={{ ...paragraph, marginBottom: 0 }}>
          My approach to development is{" "}
          <strong style={{ color: "#ffffff" }}>user-first</strong>. I believe
          good software should be built around the people using it, balancing
          technical functionality with accessibility, usability, and thoughtful
          design. I particularly enjoy bringing creative ideas together with
          technical best practices, experimenting with unfamiliar technologies,
          and finding practical solutions to complex problems.
        </p>
      </div>

      {/* 02 — OUTSIDE OF COMPUTER SCIENCE */}

      <div style={section}>
        <h3 style={sectionTitle}>02 // OUTSIDE OF COMPUTER SCIENCE</h3>

        <p style={paragraph}>
          Outside of software development, I've been heavily involved in student
          leadership, community building, and event organisation.
        </p>

        <p style={paragraph}>
          My involvement began with TU Dublin's Games Society, where I held
          several leadership positions, helping organise events, develop
          committee structures, and rebuild an active and welcoming community.
          During my time with the society, we achieved recognition at both
          university and national level, including{" "}
          <strong style={{ color: "#ffffff" }}>two national awards</strong>.
        </p>

        <p style={paragraph}>
          I later became President of TU Dublin's Societies Executive,
          representing and supporting{" "}
          <strong style={{ color: "#ffffff" }}>
            over 50 student societies and more than 3,600 members
          </strong>
          . Working alongside student committees, I helped improve engagement,
          develop student leadership, and strengthen the wider societies
          community across TU Dublin. During my presidency, TU Dublin societies
          collectively received{" "}
          <strong style={{ color: "#ffffff" }}>six national awards</strong>.
        </p>

        <p style={paragraph}>
          One of the most rewarding aspects of this role was working with people
          from all walks of life, representing an incredibly diverse range of
          interests, cultures, beliefs, and backgrounds. From cultural and
          religious societies to sports, gaming, and LGBTQ+ communities, the
          experience taught me the importance of listening to different
          perspectives, building inclusive environments, and bringing people
          together around shared goals.
        </p>

        <p style={{ ...paragraph, marginBottom: 0 }}>
          These experiences have been just as valuable to my development as my
          technical work, strengthening my communication, teamwork,
          organisation, and ability to lead and collaborate with people from a
          wide variety of backgrounds.
        </p>
      </div>

      {/* 03 — ABOUT THIS WEBSITE */}

      <div>
        <h3 style={sectionTitle}>03 // ABOUT THIS WEBSITE</h3>

        <p style={paragraph}>
          I wanted to build a portfolio that{" "}
          <strong style={{ color: "#ffffff" }}>
            demonstrates my work rather than simply displaying it as a
            collection of GitHub repositories
          </strong>
          .
        </p>

        <p style={paragraph}>
          Built using React, TypeScript, and Three.js, this website transforms a
          traditional portfolio into an interactive digital world. Visitors can
          pilot a spaceship, explore holographic project billboards, and fly
          directly into them to discover the projects behind them.
        </p>

        <p style={paragraph}>
          Rather than relying solely on descriptions and screenshots, I wanted
          visitors to be able to explore my projects through interactive
          demonstrations wherever practical, giving them a better understanding
          of what I've built and how it works.
        </p>

        <p style={paragraph}>
          The website itself is also a demonstration of my approach to
          development: combining technical problem-solving, experimentation, and
          creative design to build something distinctive without losing sight of
          the user experience.
        </p>

        <p style={{ ...paragraph, marginBottom: 0 }}>
          Ultimately, the goal is simple:{" "}
          <strong style={{ color: CYAN }}>
            make exploring my work an experience in itself.
          </strong>
        </p>
      </div>

      {/* FOOTER */}

      <footer
        style={{
          marginTop: 26,
          paddingTop: 12,
          borderTop: "1px solid rgba(32,234,255,0.2)",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          color: "#7295a8",
          fontFamily: "monospace",
          fontSize: 9,
          letterSpacing: "0.1em",
        }}
      >
        <span>FILE STATUS // ACTIVE</span>
        <span>END OF RECORD</span>
      </footer>
    </section>
  );
}
