import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import MediaGuard from "@/components/MediaGuard";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Vanillaine",
  icons: { icon: "/assets/loonaColors.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`scrollbar-hide ${jakarta.variable}`}>
      <body>
        <Script
          src="https://kit.fontawesome.com/def28874ea.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <MediaGuard />
        {children}
      </body>
    </html>
  );
}
