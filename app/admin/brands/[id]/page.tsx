import { notFound } from "next/navigation";
import { BrandForm } from "@/frontend/brand-form";
import { loadCatalog } from "@/backend/catalog";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = (await loadCatalog()).brands.find((item) => item.id === id);
  if (!brand) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{brand.name}</h1>
          <p>Logo and copy update on the shop immediately.</p>
        </div>
      </div>
      <BrandForm brand={brand} />
    </>
  );
}
