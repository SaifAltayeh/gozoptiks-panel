"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackButton, adminFallback } from "@/frontend/back-button";

const links = [
  { href: "/admin", label: "Dashboard", icon: GridIcon },
  { href: "/admin/homepage", label: "Homepage", icon: HomeIcon },
  { href: "/admin/content", label: "Content", icon: TextIcon },
  { href: "/admin/about", label: "About Us", icon: AboutIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/brands", label: "Brands", icon: TagIcon },
  { href: "/admin/categories", label: "Categories", icon: LayersIcon },
  { href: "/admin/orders", label: "Orders", icon: BagIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("admin-mode", "intro-done");
    return () => document.documentElement.classList.remove("admin-mode");
  }, []);

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className={`admin-root admin${open ? " is-nav-open" : ""}`}>
      {open ? <button className="admin-overlay" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">g</span>
          <div>
            <small>Admin</small>
            <strong>gözoptik</strong>
          </div>
        </div>
        <nav className="admin-nav">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? "is-active" : undefined} onClick={() => setOpen(false)}>
                <link.icon />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-foot">
          <button className="admin-logout" onClick={logout}>
            <LeaveIcon />
            Sign out
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <BackButton className="admin-back" fallback={adminFallback(pathname)} />
          <form className="admin-search" action="/admin/products">
            <SearchIcon />
            <input name="q" placeholder="Search products, colors, models" />
          </form>
          <div className="admin-user">
            <span className="admin-avatar">GO</span>
            <span>Admin</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 6h14M8 12h8M7 18h10" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 8.5 12 4l9 4.5L12 13 3 8.5Z" />
      <path d="M3 8.5v7L12 20l9-4.5v-7" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 13.5 12.5 21a2 2 0 0 1-2.8 0L3 14.3V4h10.3L20 10.7a2 2 0 0 1 0 2.8Z" />
      <circle cx="8.2" cy="8.2" r="1.1" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h11M12 8l4 4-4 4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
