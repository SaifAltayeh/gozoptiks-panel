import { notFound } from "next/navigation";
import { CategoryForm } from "@/frontend/category-form";
import { loadCatalog } from "@/backend/catalog";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = (await loadCatalog()).categories.find((item) => item.id === id);
  if (!category) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{category.name}</h1>
          <p>Name and image feed the storefront collection pages.</p>
        </div>
      </div>
      <CategoryForm category={category} />
    </>
  );
}
