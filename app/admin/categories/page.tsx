import Link from "next/link";
import { FeaturedToggle } from "@/frontend/featured-toggle";
import { loadCatalog } from "@/backend/catalog";

export default async function AdminCategoriesPage() {
  const { categories, products } = await loadCatalog();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Categories</h1>
          <p>{categories.length} shop collections.</p>
        </div>
        <Link className="admin-btn admin-btn-primary" href="/admin/categories/new">
          Add category
        </Link>
      </div>
      <article className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products</th>
                <th>Homepage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="admin-product">
                      {category.image ? <img src={category.image} alt="" /> : <span className="admin-thumb" />}
                      <div>
                        <strong>{category.name}</strong>
                        <div className="admin-muted">{category.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{products.filter((product) => product.categoryIds.includes(category.id)).length}</td>
                  <td>
                    <FeaturedToggle category={category} />
                  </td>
                  <td>
                    <Link className="admin-link-btn admin-btn-ghost" href={`/admin/categories/${category.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
