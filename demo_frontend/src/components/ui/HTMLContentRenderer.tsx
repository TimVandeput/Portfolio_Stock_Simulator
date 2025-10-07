"use client";

import { useRouter } from "next/navigation";

interface HTMLContentRendererProps {
  htmlContent: string;
}

export default function HTMLContentRenderer({
  htmlContent,
}: HTMLContentRendererProps) {
  const router = useRouter();

  const processedContent = htmlContent
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<strong>(.*?)<\/strong>/gi, (match, text) => {
      return `STRONG_PLACEHOLDER_${text}_ENDSTRONG`;
    })
    .replace(
      /<span\s+style=['"]color:\s*([^'"]*?)['"][^>]*>(.*?)<\/span>/gi,
      (match, color, text) => {
        return `SPAN_PLACEHOLDER_${color.trim()}_TEXT_${text}_ENDSPAN`;
      }
    )
    .replace(
      /<a\s+href=['"]([^'"]*?)['"][^>]*>(.*?)<\/a>/gi,
      (match, href, text) => {
        return `LINK_PLACEHOLDER_${href}_TEXT_${text}_ENDLINK`;
      }
    );

  const lines = processedContent.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => {
        const linkPattern = /LINK_PLACEHOLDER_([^_]+)_TEXT_([^_]+)_ENDLINK/g;
        const strongPattern = /STRONG_PLACEHOLDER_([^_]+)_ENDSTRONG/g;
        const spanPattern = /SPAN_PLACEHOLDER_([^_]+)_TEXT_([^_]+)_ENDSPAN/g;

        const hasLinks = linkPattern.test(line);
        const hasStrong = strongPattern.test(line);
        const hasSpan = spanPattern.test(line);
        linkPattern.lastIndex = 0;
        strongPattern.lastIndex = 0;
        spanPattern.lastIndex = 0;

        if (hasLinks || hasStrong || hasSpan) {
          const parts = [];
          const placeholders: Array<{
            type: "link" | "strong" | "span";
            start: number;
            end: number;
            href?: string;
            color?: string;
            text: string;
            fullMatch: string;
          }> = [];

          let linkMatch;
          while ((linkMatch = linkPattern.exec(line)) !== null) {
            placeholders.push({
              type: "link",
              start: linkMatch.index,
              end: linkMatch.index + linkMatch[0].length,
              href: linkMatch[1],
              text: linkMatch[2],
              fullMatch: linkMatch[0],
            });
          }

          let strongMatch;
          while ((strongMatch = strongPattern.exec(line)) !== null) {
            placeholders.push({
              type: "strong",
              start: strongMatch.index,
              end: strongMatch.index + strongMatch[0].length,
              text: strongMatch[1],
              fullMatch: strongMatch[0],
            });
          }

          let spanMatch;
          while ((spanMatch = spanPattern.exec(line)) !== null) {
            placeholders.push({
              type: "span",
              start: spanMatch.index,
              end: spanMatch.index + spanMatch[0].length,
              color: spanMatch[1],
              text: spanMatch[2],
              fullMatch: spanMatch[0],
            });
          }

          placeholders.sort((a, b) => a.start - b.start);

          let lastIndex = 0;
          placeholders.forEach((placeholder, index) => {
            if (placeholder.start > lastIndex) {
              parts.push(line.substring(lastIndex, placeholder.start));
            }

            if (placeholder.type === "link" && placeholder.href) {
              parts.push(
                <button
                  key={`${lineIndex}-link-${index}`}
                  onClick={() => router.push(placeholder.href!)}
                  className="inline-block text-blue-600 hover:text-blue-800 underline font-bold cursor-pointer transition-all duration-200 bg-blue-100 hover:bg-blue-200 px-2 py-1 mx-1 rounded-md border border-blue-300 hover:border-blue-400"
                >
                  {placeholder.text}
                </button>
              );
            } else if (placeholder.type === "strong") {
              parts.push(
                <strong
                  key={`${lineIndex}-strong-${index}`}
                  className="font-bold text-[var(--text-primary)]"
                >
                  {placeholder.text}
                </strong>
              );
            } else if (placeholder.type === "span" && placeholder.color) {
              parts.push(
                <span
                  key={`${lineIndex}-span-${index}`}
                  style={{ color: placeholder.color }}
                  className="font-medium"
                >
                  {placeholder.text}
                </span>
              );
            }

            lastIndex = placeholder.end;
          });

          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }

          return (
            <div key={lineIndex} className="mb-1">
              {parts}
            </div>
          );
        } else {
          return line.trim() ? (
            <div key={lineIndex} className="mb-1">
              {line}
            </div>
          ) : (
            <div key={lineIndex} className="mb-2" />
          );
        }
      })}
    </>
  );
}
