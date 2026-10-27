"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import { ImageGalleryUpload, ImageUpload } from "@/frontend/image-upload";
import type { Brand, Category, Product } from "@/backend/models";

function emptyProduct(brands: Brand[]): Product {
  return {
    id: "",
    slug: "",
    name: "",
    brandId: brands[0]?.id ?? "",
    modelId: "",
    categoryIds: [],
    description: "",
    images: [],
    hoverImage: "",
    price: 0,
    stockStatus: "in_stock",
    stockQuantity: 0,
    variations: [
      {
        id: "color",
        type: "color",
        name: "Color",
        options: [{ id: "default", label: "Default", available: true }],
      },
    ],
    attributes: [],
    featured: false,
    createdAt: new Date().toISOString().slice(0, 10),
    relatedIds: [],
    colors: [],
    frameShape: "",
    productType: "optical",
  };
}

export function ProductForm({
  product,
  brands,
  categories,
}: {
  product?: Product;
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const isNew = !product;
  const [draft, setDraft] = useState<Product>(product ?? emptyProduct(brands));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [colors, setColors] = useState((product?.colors ?? []).join(", "));
  const [attributes, setAttributes] = useState(
    (product?.attributes ?? []).map((item) => `${item.label}: ${item.value}`).join("\n"),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload: Product = {
      ...draft,
      images,
      colors: colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      attributes: attributes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: label.trim(), value: rest.join(":").trim() };
        }),
      hoverImage: draft.hoverImage || undefined,
      modelId: draft.modelId || undefined,
      originalPrice: draft.originalPrice || undefined,
    };

    try {
      const saved = await adminRequest<Product>(isNew ? "/api/products" : `/api/products/${product.id}`, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify(payload),
      });
      router.push("/admin/products");
      router.refresh();
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!product || !confirm(`Delete ${product.name}?`)) return;
    setBusy(true);
    try {
      await adminRequest(`/api/products/${product.id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product.");
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-grid">
        <article className="admin-card">
          <div className="admin-fields">
            <div className="admin-field">
              <label>
                Name
                <input value={draft.name} onChange={(event) => update("name", event.target.value)} required />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Description
                <textarea value={draft.description} onChange={(event) => update("description", event.target.value)} />
              </label>
            </div>
            <ImageGalleryUpload label="Product images" value={images} onChange={setImages} />
            <ImageUpload label="Hover image" value={draft.hoverImage ?? ""} onChange={(url) => update("hoverImage", url)} />
            <div className="admin-field">
              <label>
                Attributes, one `Label: Value` per line
                <textarea value={attributes} onChange={(event) => setAttributes(event.target.value)} />
              </label>
            </div>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-fields">
            <div className="admin-field">
              <label>
                Brand
                <select value={draft.brandId} onChange={(event) => update("brandId", event.target.value)}>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-field">
              <label>
                Model id
                <input value={draft.modelId ?? ""} onChange={(event) => update("modelId", event.target.value)} />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Slug
                <input value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="Generated from name if empty" />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Price
                <input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => update("price", Number(event.target.value))} />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Type
                <select value={draft.productType} onChange={(event) => update("productType", event.target.value as Product["productType"])}>
                  <option value="optical">Optical</option>
                  <option value="sunglasses">Sunglasses</option>
                </select>
              </label>
            </div>
            <div className="admin-field">
              <label>
                Frame shape
                <input value={draft.frameShape} onChange={(event) => update("frameShape", event.target.value)} />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Colors
                <input value={colors} onChange={(event) => setColors(event.target.value)} placeholder="black, tortoise" />
              </label>
            </div>
            <div className="admin-field">
              <label>
                Stock status
                <select value={draft.stockStatus} onChange={(event) => update("stockStatus", event.target.value as Product["stockStatus"])}>
                  <option value="in_stock">In stock</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
              </label>
            </div>
            <div className="admin-field">
              <label>
                Quantity
                <input
                  type="number"
                  min="0"
                  value={draft.stockQuantity ?? 0}
                  onChange={(event) => update("stockQuantity", Number(event.target.value))}
                />
              </label>
            </div>
            <label className="admin-check">
              <input type="checkbox" checked={draft.featured} onChange={(event) => update("featured", event.target.checked)} />
              Featured on storefront
            </label>
            <div>
              <div className="admin-muted" style={{ marginBottom: "0.45rem" }}>
                Categories
              </div>
              <div className="admin-checks">
                {categories.map((category) => (
                  <label className="admin-check" key={category.id}>
                    <input
                      type="checkbox"
                      checked={draft.categoryIds.includes(category.id)}
                      onChange={(event) => {
                        update(
                          "categoryIds",
                          event.target.checked
                            ? [...draft.categoryIds, category.id]
                            : draft.categoryIds.filter((id) => id !== category.id),
                        );
                      }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </button>
        {!isNew ? (
          <button type="button" className="admin-btn admin-btn-danger" onClick={onDelete} disabled={busy}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
