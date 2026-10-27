"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import { ImageUpload } from "@/frontend/image-upload";
import type { Brand } from "@/backend/models";

export function BrandForm({ brand }: { brand?: Brand }) {
  const router = useRouter();
  const isNew = !brand;
  const [draft, setDraft] = useState<Brand>(
    brand ?? { id: "", slug: "", name: "", description: "", logo: "", image: "" },
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest(isNew ? "/api/brands" : `/api/brands/${brand.id}`, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify({ ...draft, logo: draft.logo || null }),
      });
      router.push("/admin/brands");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save brand.");
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!brand || !confirm(`Delete ${brand.name}?`)) return;
    await adminRequest(`/api/brands/${brand.id}`, { method: "DELETE" });
    router.push("/admin/brands");
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
          <ImageUpload label="Logo" value={draft.logo ?? ""} onChange={(logo) => setDraft({ ...draft, logo })} />
          <ImageUpload label="Cover image" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} />
        </div>
      </article>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create brand" : "Save brand"}
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
