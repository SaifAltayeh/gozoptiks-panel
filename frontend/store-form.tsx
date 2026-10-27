"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import type { Brand, Category, StoreConfig } from "@/backend/models";

export function StoreForm({
  store,
  categories,
  brands,
}: {
  store: StoreConfig;
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<StoreConfig>(store);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function toggleId(list: string[], id: string) {
    return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest("/api/store", {
        method: "PUT",
        body: JSON.stringify({
          ...draft,
          contact: {
            ...draft.contact,
            phone: draft.contact.phone || null,
            email: draft.contact.email || null,
            instagram: draft.contact.instagram || null,
          },
        }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save content.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Announcement & wordmark</h2>
          </div>
          <div className="admin-fields">
            <div className="admin-field">
              <label>
                Wordmark
                <input value={draft.wordmark} onChange={(event) => setDraft({ ...draft, wordmark: event.target.value })} />
              </label>
            </div>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={draft.announcement.enabled}
                onChange={(event) =>
                  setDraft({ ...draft, announcement: { ...draft.announcement, enabled: event.target.checked } })
                }
              />
              Show announcement bar
            </label>
            <div className="admin-field">
              <label>
                Announcement text
                <input
                  value={draft.announcement.text}
                  onChange={(event) => setDraft({ ...draft, announcement: { ...draft.announcement, text: event.target.value } })}
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Announcement link
                <input
                  value={draft.announcement.href}
                  onChange={(event) => setDraft({ ...draft, announcement: { ...draft.announcement, href: event.target.value } })}
                />
              </label>
            </div>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Footer</h2>
          </div>
          <div className="admin-fields">
            <div className="admin-field">
              <label>
                Footer text
                <textarea
                  value={draft.footer.blurb}
                  onChange={(event) => setDraft({ ...draft, footer: { ...draft.footer, blurb: event.target.value } })}
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Shop column title
                <input
                  value={draft.footer.shopTitle}
                  onChange={(event) => setDraft({ ...draft, footer: { ...draft.footer, shopTitle: event.target.value } })}
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Brands column title
                <input
                  value={draft.footer.brandsTitle}
                  onChange={(event) => setDraft({ ...draft, footer: { ...draft.footer, brandsTitle: event.target.value } })}
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Store column title
                <input
                  value={draft.footer.storeTitle}
                  onChange={(event) => setDraft({ ...draft, footer: { ...draft.footer, storeTitle: event.target.value } })}
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Bottom note
                <input
                  value={draft.footer.note}
                  onChange={(event) => setDraft({ ...draft, footer: { ...draft.footer, note: event.target.value } })}
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Phone
                <input
                  value={draft.contact.phone ?? ""}
                  onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, phone: event.target.value } })}
                  placeholder="Leave empty if not ready"
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Email
                <input
                  value={draft.contact.email ?? ""}
                  onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, email: event.target.value } })}
                  placeholder="Leave empty if not ready"
                />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Instagram URL
                <input
                  value={draft.contact.instagram ?? ""}
                  onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, instagram: event.target.value } })}
                />
              </label>
            </div>
          </div>
        </article>
      </div>

      <div className="admin-form-grid">
        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Footer categories</h2>
            <span className="admin-muted">Empty means all</span>
          </div>
          <div className="admin-checks">
            {categories.map((category) => (
              <label className="admin-check" key={category.id}>
                <input
                  type="checkbox"
                  checked={draft.footer.categoryIds.includes(category.id)}
                  onChange={() =>
                    setDraft({
                      ...draft,
                      footer: { ...draft.footer, categoryIds: toggleId(draft.footer.categoryIds, category.id) },
                    })
                  }
                />
                {category.name}
              </label>
            ))}
          </div>
        </article>
        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Footer brands</h2>
            <span className="admin-muted">Empty means all</span>
          </div>
          <div className="admin-checks">
            {brands.map((brand) => (
              <label className="admin-check" key={brand.id}>
                <input
                  type="checkbox"
                  checked={draft.footer.brandIds.includes(brand.id)}
                  onChange={() =>
                    setDraft({
                      ...draft,
                      footer: { ...draft.footer, brandIds: toggleId(draft.footer.brandIds, brand.id) },
                    })
                  }
                />
                {brand.name}
              </label>
            ))}
          </div>
        </article>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save content"}
        </button>
      </div>
    </form>
  );
}
