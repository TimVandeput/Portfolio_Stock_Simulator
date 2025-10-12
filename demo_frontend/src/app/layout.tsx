import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import CookieBanner from "@/components/ui/CookieBanner";
import type { Metadata } from "next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio Demo",
    template: "%s",
  },
  description: "Demo app with auth, themed loader, and smooth navigation.",
  openGraph: {
    siteName: "Portfolio Demo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "color-scheme": "none",
    "theme-color": "#e0e5ec",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="none" />
        <meta name="theme-color" content="#e0e5ec" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // NUCLEAR APPROACH - Completely disable browser theme detection
                document.documentElement.style.colorScheme = 'none';
                document.body && (document.body.style.colorScheme = 'none');
                
                // Force light theme colors immediately
                document.documentElement.style.backgroundColor = '#e0e5ec';
                document.documentElement.style.color = '#60a5fa';
                
                // Remove any existing theme classes aggressively
                document.documentElement.classList.remove('dark');
                document.documentElement.className = document.documentElement.className.replace(/dark/g, '').trim();
                
                // Inject aggressive override styles
                const style = document.createElement('style');
                style.innerHTML = \`
                  *, *::before, *::after {
                    color-scheme: none !important;
                  }
                  html {
                    color-scheme: none !important;
                    background: #e0e5ec !important;
                    color: #60a5fa !important;
                  }
                  body {
                    color-scheme: none !important;
                    background: #e0e5ec !important;
                    color: #60a5fa !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    html, body, * {
                      color-scheme: none !important;
                      background-color: #e0e5ec !important;
                      color: #60a5fa !important;
                    }
                  }
                \`;
                document.head.appendChild(style);
                
                // Get cookie function
                function getCookie(name) {
                  const value = "; " + document.cookie;
                  const parts = value.split("; " + name + "=");
                  if (parts.length === 2) return parts.pop().split(";").shift();
                  return null;
                }
                
                // Apply saved theme with nuclear approach
                const savedTheme = getCookie("theme") || "light";
                if (savedTheme === "dark") {
                  document.documentElement.classList.add("dark");
                  document.documentElement.style.backgroundColor = '#2a2d3a';
                  document.documentElement.style.color = '#c4b5fd';
                  if (document.body) {
                    document.body.style.backgroundColor = '#2a2d3a';
                    document.body.style.color = '#c4b5fd';
                  }
                  const metaTheme = document.querySelector('meta[name="theme-color"]');
                  if (metaTheme) metaTheme.content = '#2a2d3a';
                } else {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.style.backgroundColor = '#e0e5ec';
                  document.documentElement.style.color = '#60a5fa';
                  if (document.body) {
                    document.body.style.backgroundColor = '#e0e5ec';
                    document.body.style.color = '#60a5fa';
                  }
                  const metaTheme = document.querySelector('meta[name="theme-color"]');
                  if (metaTheme) metaTheme.content = '#e0e5ec';
                }
                
                // Prevent any system theme detection
                document.documentElement.style.colorScheme = 'none';
                document.documentElement.setAttribute('data-theme', savedTheme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClientLayout>{children}</ClientLayout>
        <CookieBanner />
      </body>
    </html>
  );
}
