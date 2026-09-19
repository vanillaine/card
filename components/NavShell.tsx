"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages, socials, type NavItem } from "@/data/nav";
import { useMobileMenu } from "./MobileMenuProvider";

function NavIcon({ item, soft = false }: { item: NavItem; soft?: boolean }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.label}
        className={`w-5 h-5 object-contain opacity-80 ${item.grayscale ? "grayscale" : ""}`}
      />
    );
  }
  return item.icon ? <i className={`${item.icon} ${soft ? "text-white/80" : ""}`}></i> : null;
}

export default function NavShell({ lodestoneUrl }: { lodestoneUrl?: string }) {
  const pathname = usePathname();
  const { open, setOpen } = useMobileMenu();

  const allSocials = lodestoneUrl
    ? [...socials, { href: lodestoneUrl, label: "Lodestone", image: "/assets/ffxiv.png" }]
    : socials;

  return (
    <>
      {open && <div className="mobile:hidden fixed inset-0 z-[998]" onClick={() => setOpen(false)} aria-hidden />}

      <header className="hidden max-mobile:flex max-mobile:bg-bg-sidebar max-mobile:h-[60px] max-mobile:px-5 max-mobile:items-center max-mobile:fixed max-mobile:top-0 max-mobile:left-0 max-mobile:w-full max-mobile:z-[1000] max-mobile:border-b max-mobile:border-line">
        <button
          className="bg-transparent border-none text-text-main text-xl cursor-pointer mr-[15px]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="font-tingtong text-xl font-semibold text-white">Vanillaine</div>
      </header>

      <nav
        className={`w-[260px] bg-[rgba(15,13,30,0.45)] backdrop-blur-md border-r border-white/[0.06] p-5 flex flex-col overflow-y-auto scrollbar-hide max-mobile:fixed max-mobile:left-0 max-mobile:top-[60px] max-mobile:h-[calc(100vh-60px)] max-mobile:w-[250px] max-mobile:bg-bg-sidebar max-mobile:backdrop-blur-none max-mobile:z-[999] max-mobile:shadow-[5px_0_15px_rgba(0,0,0,0.5)] max-mobile:transition-transform max-mobile:duration-300 max-mobile:ease-in-out max-mobile:border-r-0 ${
          open ? "max-mobile:translate-x-0" : "max-mobile:-translate-x-full"
        }`}
      >
        <div className="text-[11px] text-text-muted uppercase tracking-[1px] mt-5 mb-2.5 ml-2.5">Pages</div>
        {pages.map((page) => {
          const isActive = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              onClick={() => setOpen(false)}
              className={`nav-btn ${
                isActive ? "bg-hover text-white font-medium" : "text-text-muted hover:bg-hover hover:text-white"
              }`}
            >
              <NavIcon item={page} />
              {page.label}
            </Link>
          );
        })}

        <div className="text-[11px] text-text-muted uppercase tracking-[1px] mt-[30px] mb-2.5 ml-2.5">Socials</div>
        {allSocials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="nav-btn no-underline text-text-muted hover:bg-hover hover:text-white"
          >
            <NavIcon item={social} soft />
            {social.label}
          </a>
        ))}
      </nav>
    </>
  );
}
