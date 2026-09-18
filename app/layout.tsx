import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import MediaGuard from "@/components/MediaGuard";
import NavShell from "@/components/NavShell";
import { MobileMenuProvider } from "@/components/MobileMenuProvider";
import StatusSidebar from "@/components/StatusSidebar";
import StatusCards from "@/components/StatusCards";
import { lodestoneProfileUrl } from "@/lib/lodestone";
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
  const lodestoneId = process.env.FFXIV_LODESTONE_ID;

  return (
    <html lang="id" className={`scrollbar-hide ${jakarta.variable}`}>
      <body>
        <Script
          src="https://kit.fontawesome.com/def28874ea.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <MediaGuard />

        <MobileMenuProvider>
          <NavShell lodestoneUrl={lodestoneId ? lodestoneProfileUrl(lodestoneId) : undefined} />

          <main className="flex-1 p-10 overflow-y-auto leading-[1.6] font-jakarta scrollbar-hide max-mobile:pt-20 max-mobile:px-5 max-mobile:pb-[90px] max-mobile:w-full max-mobile:overflow-x-hidden">
            {children}
          </main>

          <StatusSidebar>
            <StatusCards />
          </StatusSidebar>
        </MobileMenuProvider>
      </body>
    </html>
  );
}
