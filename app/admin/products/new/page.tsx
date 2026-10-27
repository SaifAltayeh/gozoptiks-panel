import { ProductForm } from "@/frontend/product-form";
import { loadCatalog } from "@/backend/catalog";

export default async function NewProductPage() {
  const { brands, categories } = await loadCatalog();
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>New product</h1>
          <p>This SKU appears on the storefront as soon as you save it.</p>
        </div>
      </div>
      <ProductForm brands={brands} categories={categories} />
    </>
  );
}
