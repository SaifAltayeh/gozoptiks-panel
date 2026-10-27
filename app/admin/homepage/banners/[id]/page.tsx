import { notFound } from "next/navigation";
import { BannerForm } from "@/frontend/banner-form";
import { loadCatalog } from "@/backend/catalog";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = (await loadCatalog()).heroSlides.find((item) => item.id === id);
  if (!slide) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{slide.heading}</h1>
          <p>Edits update the homepage banner immediately.</p>
        </div>
      </div>
      <BannerForm slide={slide} />
    </>
  );
}
