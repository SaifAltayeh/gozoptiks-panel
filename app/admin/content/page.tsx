import { StoreForm } from "@/frontend/store-form";
import { loadCatalog } from "@/backend/catalog";

export default async function AdminContentPage() {
  const { store, categories, brands } = await loadCatalog();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Content</h1>
          <p>Footer, announcement bar, and store text used across the shop.</p>
        </div>
      </div>
      <StoreForm store={store} categories={categories} brands={brands} />
    </>
  );
}
