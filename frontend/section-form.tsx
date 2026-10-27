"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import { ImageUpload } from "@/frontend/image-upload";
import { formatPrice } from "@/frontend/format";
import type { Brand, Category, HomepageSection, Product } from "@/backend/models";

const emptySection = (): HomepageSection => ({
  id: "",
  title: "",
  description: "",
  type: "products",
  productIds: [],
  ctaLabel: "",
  ctaHref: "",
  image: "",
  order: 1,
  active: true,
});

export function SectionForm({
  section,
  products,
  categories,
  brands,
}: {
  section?: HomepageSection;
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const isNew = !section;
  const [draft, setDraft] = useState<HomepageSection>(section ?? emptySection());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function toggleProduct(id: string) {
    const current = draft.productIds ?? [];
    setDraft({
      ...draft,
      productIds: current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    });
  }

  function moveProduct(id: string, direction: -1 | 1) {
    const current = [...(draft.productIds ?? [])];
    const index = current.indexOf(id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= current.length) return;
    [current[index], current[next]] = [current[next], current[index]];
    setDraft({ ...draft, productIds: current });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest(isNew ? "/api/homepage/sections" : `/api/homepage/sections/${section.id}`, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify({
          ...draft,
          description: draft.description || undefined,
          ctaLabel: draft.ctaLabel || undefined,
          ctaHref: draft.ctaHref || undefined,
          image: draft.image || undefined,
          productIds: draft.type === "products" ? draft.productIds ?? [] : undefined,
          categoryIds: draft.type === "categories" ? draft.categoryIds ?? [] : undefined,
          brandIds: draft.type === "brands" ? draft.brandIds ?? [] : undefined,
        }),
      });
      router.push("/admin/homepage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save section.");
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!section || !confirm(`Delete section “${section.title}”?`)) return;
    await adminRequest(`/api/homepage/sections/${section.id}`, { method: "DELETE" });
    router.push("/admin/homepage");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        <article className="admin-card">
          <div className="admin-fields">
            <div className="admin-field">
              <label>
                Section name
                <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Description
                <textarea value={draft.description ?? ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Type
                <select
                  value={draft.type}
                  onChange={(event) => setDraft({ ...draft, type: event.target.value as HomepageSection["type"] })}
                >
                  <option value="products">Product row</option>
                  <option value="editorial">Image + text banner</option>
                  <option value="categories">Featured categories</option>
                  <option value="brands">Featured brands</option>
                </select>
              </label>
            </div>
            {draft.type === "editorial" ? (
              <ImageUpload label="Section image" value={draft.image ?? ""} onChange={(image) => setDraft({ ...draft, image })} />
            ) : null}
            <div className="admin-field">
              <label>
                Button label
                <input value={draft.ctaLabel ?? ""} onChange={(event) => setDraft({ ...draft, ctaLabel: event.target.value })} />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Button link
                <input value={draft.ctaHref ?? ""} onChange={(event) => setDraft({ ...draft, ctaHref: event.target.value })} />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Order
                <input type="number" value={draft.order} onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })} />
              </label>
            </div>
            <label className="admin-check">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
              Show on homepage
            </label>
          </div>
        </article>

        {draft.type === "products" ? (
          <PickerCard
            title="Products in this section"
            items={products.map((product) => ({
              id: product.id,
              name: product.name,
              meta: formatPrice(product.price),
              image: product.images[0],
            }))}
            selectedIds={draft.productIds ?? []}
            onToggle={toggleProduct}
            onMove={moveProduct}
          />
        ) : draft.type === "categories" ? (
          <PickerCard
            title="Featured categories"
            hint="These tiles appear on the homepage. Leave none selected to show the first three."
            items={categories.map((category) => ({
              id: category.id,
              name: category.name,
              meta: category.slug,
              image: category.image,
            }))}
            selectedIds={draft.categoryIds ?? []}
            onToggle={(id) =>
              setDraft({
                ...draft,
                categoryIds: (draft.categoryIds ?? []).includes(id)
                  ? (draft.categoryIds ?? []).filter((item) => item !== id)
                  : [...(draft.categoryIds ?? []), id],
              })
            }
            onMove={(id, direction) => {
              const current = [...(draft.categoryIds ?? [])];
              const index = current.indexOf(id);
              const next = index + direction;
              if (index < 0 || next < 0 || next >= current.length) return;
              [current[index], current[next]] = [current[next], current[index]];
              setDraft({ ...draft, categoryIds: current });
            }}
          />
        ) : draft.type === "brands" ? (
          <PickerCard
            title="Featured brands"
            hint="Leave none selected to show every brand."
            items={brands.map((brand) => ({
              id: brand.id,
              name: brand.name,
              meta: brand.slug,
              image: brand.logo ?? brand.image,
            }))}
            selectedIds={draft.brandIds ?? []}
            onToggle={(id) =>
              setDraft({
                ...draft,
                brandIds: (draft.brandIds ?? []).includes(id)
                  ? (draft.brandIds ?? []).filter((item) => item !== id)
                  : [...(draft.brandIds ?? []), id],
              })
            }
            onMove={(id, direction) => {
              const current = [...(draft.brandIds ?? [])];
              const index = current.indexOf(id);
              const next = index + direction;
              if (index < 0 || next < 0 || next >= current.length) return;
              [current[index], current[next]] = [current[next], current[index]];
              setDraft({ ...draft, brandIds: current });
            }}
          />
        ) : (
          <article className="admin-card">
            <p className="admin-muted">Change the heading, text, image path, and button to update this homepage banner.</p>
          </article>
        )}
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create section" : "Save section"}
        </button>
        {!isNew ? (
          <button type="button" className="admin-btn admin-btn-danger" onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function PickerCard({
  title,
  hint,
  items,
  selectedIds,
  onToggle,
  onMove,
}: {
  title: string;
  hint?: string;
  items: { id: string; name: string; meta: string; image?: string | null }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  return (
    <article className="admin-card">
      <div className="admin-card-head">
        <h2>{title}</h2>
        <span className="admin-muted">{selectedIds.length} selected</span>
      </div>
      {hint ? <p className="admin-muted">{hint}</p> : null}
      <div className="admin-picker">
        {items.map((item) => {
          const selected = selectedIds.includes(item.id);
          const position = selected ? selectedIds.indexOf(item.id) : -1;
          return (
            <div className={`admin-picker-item${selected ? " is-selected" : ""}`} key={item.id}>
              <label>
                <input type="checkbox" checked={selected} onChange={() => onToggle(item.id)} />
                {item.image ? <img src={item.image} alt="" /> : <span className="admin-thumb" />}
                <span>
                  <strong>{item.name}</strong>
                  <span className="admin-muted">{item.meta}</span>
                </span>
              </label>
              {selected ? (
                <span className="admin-picker-order">
                  <button type="button" onClick={() => onMove(item.id, -1)} aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" onClick={() => onMove(item.id, 1)} aria-label="Move down">
                    ↓
                  </button>
                  <em>{position + 1}</em>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
