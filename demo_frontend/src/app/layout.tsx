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
    "color-scheme": "light dark",
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
        <meta name="color-scheme" content="light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force override color-scheme to prevent browser defaults
                document.documentElement.style.colorScheme = 'light';
                
                // Remove any existing theme classes
                document.documentElement.classList.remove('dark');
                document.documentElement.className = document.documentElement.className.replace(/dark/g, '');
                
                // Override any media query preferences
                const style = document.createElement('style');
                style.innerHTML = \`
                  html { color-scheme: light !important; }
                  @media (prefers-color-scheme: dark) {
                    html { color-scheme: light !important; }
                  }
                  * { color-scheme: inherit !important; }
                \`;
                document.head.appendChild(style);
                
                // Get cookie function
                function getCookie(name) {
                  const value = "; " + document.cookie;
                  const parts = value.split("; " + name + "=");
                  if (parts.length === 2) return parts.pop().split(";").shift();
                  return null;
                }
                
                // Apply saved theme immediately and aggressively
                const savedTheme = getCookie("theme") || "light";
                if (savedTheme === "dark") {
                  document.documentElement.classList.add("dark");
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.style.colorScheme = 'light';
                }
                
                // Lock in the theme to prevent system override
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
