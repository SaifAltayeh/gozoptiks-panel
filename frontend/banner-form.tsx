"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import { ImageUpload } from "@/frontend/image-upload";
import type { HomepageHeroSlide } from "@/backend/models";

const emptySlide = (): HomepageHeroSlide => ({
  id: "",
  heading: "",
  text: "",
  image: "/images/hero/hero-01.jpg",
  ctaLabel: "Shop",
  ctaHref: "/shop",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
  align: "left",
  imagePosition: "center",
  campaign: "",
  order: 0,
  active: true,
});

export function BannerForm({ slide }: { slide?: HomepageHeroSlide }) {
  const router = useRouter();
  const isNew = !slide;
  const [draft, setDraft] = useState<HomepageHeroSlide>(slide ?? emptySlide());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest(isNew ? "/api/homepage/slides" : `/api/homepage/slides/${slide.id}`, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify({
          ...draft,
          text: draft.text || undefined,
          campaign: draft.campaign || undefined,
          ctaSecondaryLabel: draft.ctaSecondaryLabel || undefined,
          ctaSecondaryHref: draft.ctaSecondaryHref || undefined,
        }),
      });
      router.push("/admin/homepage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save banner.");
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!slide || !confirm(`Delete banner “${slide.heading}”?`)) return;
    await adminRequest(`/api/homepage/slides/${slide.id}`, { method: "DELETE" });
    router.push("/admin/homepage");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <article className="admin-card">
        <div className="admin-fields">
          <div className="admin-field">
            <label>
              Heading
              <input value={draft.heading} onChange={(event) => setDraft({ ...draft, heading: event.target.value })} required />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Text
              <textarea value={draft.text ?? ""} onChange={(event) => setDraft({ ...draft, text: event.target.value })} />
            </label>
          </div>
          <ImageUpload label="Banner image" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} />
          <div className="admin-field">
            <label>
              Campaign label
              <input value={draft.campaign ?? ""} onChange={(event) => setDraft({ ...draft, campaign: event.target.value })} />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Button
              <input value={draft.ctaLabel} onChange={(event) => setDraft({ ...draft, ctaLabel: event.target.value })} />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Button link
              <input value={draft.ctaHref} onChange={(event) => setDraft({ ...draft, ctaHref: event.target.value })} />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Second button
              <input value={draft.ctaSecondaryLabel ?? ""} onChange={(event) => setDraft({ ...draft, ctaSecondaryLabel: event.target.value })} />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Second button link
              <input value={draft.ctaSecondaryHref ?? ""} onChange={(event) => setDraft({ ...draft, ctaSecondaryHref: event.target.value })} />
            </label>
          </div>
          <div className="admin-field">
            <label>
              Order
              <input type="number" value={draft.order ?? 0} onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })} />
            </label>
          </div>
          <label className="admin-check">
            <input type="checkbox" checked={draft.active !== false} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
            Show on homepage
          </label>
        </div>
      </article>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create banner" : "Save banner"}
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
