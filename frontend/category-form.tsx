"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import { ImageUpload } from "@/frontend/image-upload";
import type { Category } from "@/backend/models";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const isNew = !category;
  const [draft, setDraft] = useState<Category>(
    category ?? { id: "", slug: "", name: "", description: "", image: "", parentId: null, featured: false },
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest(isNew ? "/api/categories" : `/api/categories/${category.id}`, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify(draft),
      });
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!category || !confirm(`Delete ${category.name}?`)) return;
    await adminRequest(`/api/categories/${category.id}`, { method: "DELETE" });
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <article className="admin-card">
        <div className="admin-fields">
          <div className="admin-field">
            <label>
              Name
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Slug
              <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Description
              <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </label>
          </div>
          <ImageUpload label="Image" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} />
          <label className="admin-check">
            <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />
            Featured on homepage
          </label>
        </div>
      </article>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create category" : "Save category"}
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
