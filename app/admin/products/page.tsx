import Link from "next/link";
import { loadCatalog } from "@/backend/catalog";
import { formatPrice } from "@/frontend/format";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const { products, brands } = await loadCatalog();
  const list = products.filter((product) => {
    if (!query) return true;
    const brand = brands.find((item) => item.id === product.brandId)?.name ?? "";
    return [product.name, product.slug, product.modelId, brand, product.colors.join(" ")].join(" ").toLowerCase().includes(query);
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>
            {list.length} of {products.length} live SKUs
            {query ? ` matching “${q}”` : ""}.
          </p>
        </div>
        <Link className="admin-btn admin-btn-primary" href="/admin/products/new">
          Add product
        </Link>
      </div>
      <article className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Type</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product">
                      {product.images[0] ? <img src={product.images[0]} alt="" /> : <span className="admin-thumb" />}
                      <div>
                        <strong>{product.name}</strong>
                        <div className="admin-muted">{product.colors.join(", ") || product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{brands.find((brand) => brand.id === product.brandId)?.name ?? "—"}</td>
                  <td className="admin-muted">{product.productType}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`admin-badge ${product.stockStatus === "in_stock" ? "is-in" : "is-out"}`}>
                      {product.stockQuantity ?? 0} {product.stockStatus === "in_stock" ? "in" : "out"}
                    </span>
                  </td>
                  <td>
                    <Link className="admin-link-btn admin-btn-ghost" href={`/admin/products/${product.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 ? <p className="admin-empty">No products match that search.</p> : null}
        </div>
      </article>
    </>
  );
}
