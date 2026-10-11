// Markdown project reader.

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  markdown: string;
}

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <div
      style={{
        lineHeight: 1.7,
        fontSize: "16px",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                color: "#20eaff",
                marginTop: "36px",
                marginBottom: "16px",
                fontSize: "32px",
              }}
            >
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2
              style={{
                color: "#20eaff",
                marginTop: "32px",
                marginBottom: "14px",
                fontSize: "24px",
              }}
            >
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3
              style={{
                color: "#ff2bd6",
                marginTop: "24px",
                marginBottom: "10px",
                fontSize: "19px",
              }}
            >
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p
              style={{
                margin: "0 0 16px",
                maxWidth: "900px",
              }}
            >
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul
              style={{
                paddingLeft: "24px",
                marginBottom: "18px",
              }}
            >
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol
              style={{
                paddingLeft: "24px",
                marginBottom: "18px",
              }}
            >
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li
              style={{
                marginBottom: "6px",
              }}
            >
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote
              style={{
                margin: "20px 0",
                padding: "12px 18px",
                borderLeft: "3px solid #20eaff",
                background: "rgba(32,234,255,0.05)",
              }}
            >
              {children}
            </blockquote>
          ),

          pre: ({ children }) => (
            <pre
              style={{
                margin: "0 0 24px",
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                lineHeight: 1.6,
              }}
            >
              {children}
            </pre>
          ),

          code: ({ className, children }) => {
            const isBlockCode = className?.startsWith("language-");

            return (
              <code
                className={className}
                style={
                  isBlockCode
                    ? {
                        background: "transparent",
                        padding: 0,
                        borderRadius: 0,
                        fontFamily: "inherit",
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        padding: "2px 5px",
                        borderRadius: "3px",
                        fontFamily: "inherit",
                      }
                }
              >
                {children}
              </code>
            );
          },

          table: ({ children }) => (
            <div
              style={{
                overflowX: "auto",
                margin: "20px 0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th
              style={{
                textAlign: "left",
                padding: "10px",
                borderBottom: "1px solid #20eaff",
                color: "#20eaff",
              }}
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td
              style={{
                padding: "10px",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {children}
            </td>
          ),

          img: ({ src, alt }) => (
            <img
              src={src ?? ""}
              alt={alt ?? ""}
              style={{
                display: "block",
                maxWidth: "100%",
                height: "auto",
                margin: "20px 0",
                border: "1px solid rgba(32,234,255,0.35)",
                background: "rgba(255,255,255,0.02)",
                padding: "8px",
              }}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}