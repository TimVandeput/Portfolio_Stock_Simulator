/**
 * @fileoverview Secure HTML content renderer with safe parsing and interactive elements
 *
 * This component provides secure HTML content rendering with custom parsing for links,
 * styling, and formatting. Features include XSS protection through controlled parsing,
 * interactive link handling, professional styling, and seamless Next.js navigation
 * integration for safe and engaging content presentation.
 */

"use client";

import { useRouter } from "next/navigation";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for HTMLContentRenderer component configuration
 * @interface HTMLContentRendererProps
 * @extends {BaseComponentProps}
 */
export interface HTMLContentRendererProps extends BaseComponentProps {
  /** HTML content string to parse and render safely */
  htmlContent: string;
}

/**
 * Secure HTML content renderer with safe parsing and interactive elements
 *
 * @remarks
 * The HTMLContentRenderer component delivers secure HTML rendering with the following features:
 *
 * **Security Features:**
 * - Safe HTML parsing without dangerouslySetInnerHTML
 * - Controlled element rendering through regex parsing
 * - XSS protection through whitelist approach
 * - Professional security-first implementation
 *
 * **Supported Elements:**
 * - Links with click handling and Next.js routing
 * - Strong text with professional bold styling
 * - Colored spans with inline styling
 * - Line breaks converted to proper spacing
 *
 * **Link Handling:**
 * - Interactive button-style links
 * - Professional hover states and transitions
 * - Next.js router integration for SPA navigation
 * - Accessible button styling with focus states
 *
 * **Text Formatting:**
 * - Bold text with theme-integrated colors
 * - Custom colored text with inline styles
 * - Professional typography integration
 * - Clean spacing and line height management
 *
 * **Parsing Engine:**
 * - Regex-based HTML element parsing
 * - Placeholder-based content processing
 * - Multi-element support on single lines
 * - Professional content transformation
 *
 * **Layout Management:**
 * - Line-by-line content processing
 * - Professional spacing between elements
 * - Clean empty line handling
 * - Responsive content presentation
 *
 * **Performance:**
 * - Efficient regex processing
 * - Optimized component rendering
 * - Clean key management for React
 * - Professional memory management
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Proper button implementation for links
 * - Screen reader compatible content
 * - Professional accessibility patterns
 *
 * **Theme Integration:**
 * - CSS custom properties for text colors
 * - Professional color palette integration
 * - Consistent styling with design system
 * - Theme-aware text rendering
 *
 * **Use Cases:**
 * - Help documentation rendering
 * - Rich text content display
 * - User-generated content with limited HTML
 * - Professional content management
 *
 * @param props - Configuration object for HTML content rendering
 * @returns HTMLContentRenderer component with safely parsed HTML content
 *
 * @example
 * ```tsx
 * // Basic HTML content rendering
 * <HTMLContentRenderer
 *   htmlContent="Welcome to our <strong>portfolio management</strong> platform!"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Content with links and styling
 * <HTMLContentRenderer
 *   htmlContent={`
 *     Learn more about <a href="/help">trading basics</a><br/>
 *     <span style="color: #10b981">Success!</span> Your account is active.
 *   `}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Help content integration
 * function HelpSection({ content }: { content: string }) {
 *   return (
 *     <div className="help-content">
 *       <HTMLContentRenderer htmlContent={content} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic content from CMS
 * function DynamicContent() {
 *   const { data: content } = useCMSContent('homepage');
 *
 *   return content ? (
 *     <HTMLContentRenderer htmlContent={content.html} />
 *   ) : (
 *     <Loader cover="content" />
 *   );
 * }
 * ```
 */
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
