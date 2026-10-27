import { SectionForm } from "@/frontend/section-form";
import { loadCatalog } from "@/backend/catalog";

export default async function NewSectionPage() {
  const { products, categories, brands } = await loadCatalog();
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>New section</h1>
          <p>Name the section and choose the products or featured categories in it.</p>
        </div>
      </div>
      <SectionForm products={products} categories={categories} brands={brands} />
    </>
  );
}
