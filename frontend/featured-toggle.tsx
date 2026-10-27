"use client";

import { useRouter } from "next/navigation";
import type { Category } from "@/backend/models";

export function FeaturedToggle({ category }: { category: Category }) {
  const router = useRouter();

  async function toggle() {
    await fetch(`/api/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...category, featured: !category.featured }),
    });
    router.refresh();
  }

  return (
    <button
      type="button"
      className={`admin-badge ${category.featured ? "is-in" : "is-out"}`}
      onClick={toggle}
      style={{ border: 0, cursor: "pointer" }}
    >
      {category.featured ? "Featured" : "Off"}
    </button>
  );
}
