import Link from "next/link";
import { loadCatalog } from "@/backend/catalog";

export default async function AdminBrandsPage() {
  const { brands, products } = await loadCatalog();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Brands</h1>
          <p>{brands.length} brands on the storefront.</p>
        </div>
        <Link className="admin-btn admin-btn-primary" href="/admin/brands/new">
          Add brand
        </Link>
      </div>
      <article className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Products</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    <div className="admin-product">
                      {brand.logo ? <img src={brand.logo} alt="" /> : <span className="admin-thumb" />}
                      <div>
                        <strong>{brand.name}</strong>
                        <div className="admin-muted">{brand.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{products.filter((product) => product.brandId === brand.id).length}</td>
                  <td>
                    <Link className="admin-link-btn admin-btn-ghost" href={`/admin/brands/${brand.id}`}>
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
