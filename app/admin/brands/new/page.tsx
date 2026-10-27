import { BrandForm } from "@/frontend/brand-form";

export default function NewBrandPage() {
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>New brand</h1>
          <p>Appears in the storefront brands grid and navigation.</p>
        </div>
      </div>
      <BrandForm />
    </>
  );
}
