import { notFound } from "next/navigation";
import { ProductForm } from "@/frontend/product-form";
import { loadCatalog } from "@/backend/catalog";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products, brands, categories } = await loadCatalog();
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{product.name}</h1>
          <p>Edits write to the same catalog the shop reads.</p>
        </div>
      </div>
      <ProductForm product={product} brands={brands} categories={categories} />
    </>
  );
}
