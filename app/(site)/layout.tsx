import NavShell from "@/components/NavShell";
import { MobileMenuProvider } from "@/components/MobileMenuProvider";
import StatusSidebar from "@/components/StatusSidebar";
import StatusCards from "@/components/StatusCards";
import { lodestoneProfileUrl } from "@/lib/lodestone";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const lodestoneId = process.env.FFXIV_LODESTONE_ID;

  return (
    <div className="flex h-screen overflow-hidden scrollbar-hide">
      <MobileMenuProvider>
        <NavShell lodestoneUrl={lodestoneId ? lodestoneProfileUrl(lodestoneId) : undefined} />

        <main className="flex-1 p-10 overflow-y-auto leading-[1.6] font-jakarta scrollbar-hide max-mobile:pt-20 max-mobile:px-5 max-mobile:pb-[90px] max-mobile:w-full max-mobile:overflow-x-hidden">
          {children}
        </main>

        <StatusSidebar>
          <StatusCards />
        </StatusSidebar>
      </MobileMenuProvider>
    </div>
  );
}
