"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HomepageSection, Product } from "@/backend/models";

export function SectionList({
  sections,
  products,
}: {
  sections: HomepageSection[];
  products: Product[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(sections);
  const [busy, setBusy] = useState(false);

  async function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length || busy) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setItems(next);
    setBusy(true);
    await fetch("/api/homepage/sections/order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((item) => item.id) }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Section</th>
            <th>Type</th>
            <th>Products</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((section, index) => (
            <tr key={section.id}>
              <td>
                <div className="admin-order">
                  <button type="button" disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === items.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
              </td>
              <td>
                <strong>{section.title}</strong>
                <div className="admin-muted">{section.description || `Position ${index + 1}`}</div>
              </td>
              <td className="admin-muted">{section.type}</td>
              <td className="admin-muted">
                {section.type === "products"
                  ? `${section.productIds?.filter((id) => products.some((product) => product.id === id)).length ?? 0} SKUs`
                  : "—"}
              </td>
              <td>
                <span className={`admin-badge ${section.active ? "is-in" : "is-out"}`}>
                  {section.active ? "Live" : "Hidden"}
                </span>
              </td>
              <td>
                <Link className="admin-link-btn admin-btn-ghost" href={`/admin/homepage/sections/${section.id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
