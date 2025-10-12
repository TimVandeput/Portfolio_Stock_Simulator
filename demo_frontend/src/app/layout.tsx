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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Prevent system theme from being applied
                document.documentElement.classList.remove('dark');
                
                // Get cookie function
                function getCookie(name) {
                  const value = "; " + document.cookie;
                  const parts = value.split("; " + name + "=");
                  if (parts.length === 2) return parts.pop().split(";").shift();
                  return null;
                }
                
                // Apply saved theme immediately
                const savedTheme = getCookie("theme") || "light";
                if (savedTheme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
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
