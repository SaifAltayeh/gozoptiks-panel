import { notFound } from "next/navigation";
import { SectionForm } from "@/frontend/section-form";
import { loadCatalog } from "@/backend/catalog";

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { homepageSections, products, categories, brands } = await loadCatalog();
  const section = homepageSections.find((item) => item.id === id);
  if (!section) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{section.title}</h1>
          <p>Change the name, text, images, and what appears in this homepage block.</p>
        </div>
      </div>
      <SectionForm section={section} products={products} categories={categories} brands={brands} />
    </>
  );
}
