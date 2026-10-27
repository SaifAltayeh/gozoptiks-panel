"use client";

import { useRouter } from "next/navigation";

export function BackButton({
  fallback = "/",
  className = "icon-btn",
}: {
  fallback?: string;
  className?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (typeof document !== "undefined") {
      try {
        const referrer = document.referrer ? new URL(document.referrer) : null;
        if (referrer && referrer.origin === window.location.origin) {
          router.back();
          return;
        }
      } catch {
        // use fallback
      }
    }
    router.push(fallback);
  }

  return (
    <button type="button" className={className} aria-label="Go back" onClick={goBack}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M15 5 8 12l7 7" />
      </svg>
    </button>
  );
}

export function adminFallback(pathname: string) {
  if (pathname === "/admin") return "/";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 2) return "/admin";
  if (parts[1] === "homepage") return "/admin/homepage";
  return `/admin/${parts[1]}`;
}
