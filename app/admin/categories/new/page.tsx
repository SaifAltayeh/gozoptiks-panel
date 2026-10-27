import { CategoryForm } from "@/frontend/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>New category</h1>
          <p>Used by shop filters and merchandising tiles.</p>
        </div>
      </div>
      <CategoryForm />
    </>
  );
}
