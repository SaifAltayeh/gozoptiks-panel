import Link from "next/link";
import { loadCatalog } from "@/backend/catalog";
import { formatPrice } from "@/frontend/format";

export default async function AdminDashboardPage() {
  const { products, brands, categories, orders, store } = await loadCatalog();
  const inStock = products.filter((product) => product.stockStatus === "in_stock").length;
  const revenue = orders.filter((order) => order.orderStatus === "paid").reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => order.paymentStatus === "pending").length;

  const byBrand = brands
    .map((brand) => ({
      name: brand.name,
      count: products.filter((product) => product.brandId === brand.id).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...byBrand.map((item) => item.count), 1);
  const optical = products.filter((product) => product.productType === "optical").length;
  const sunglasses = products.filter((product) => product.productType === "sunglasses").length;
  const opticalPct = products.length ? Math.round((optical / products.length) * 100) : 0;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Live {store.wordmark} catalog and checkout activity.</p>
        </div>
        <Link className="admin-btn admin-btn-primary" href="/admin/products/new">
          Add product
        </Link>
      </div>

      <section className="admin-kpis">
        <article className="admin-card admin-kpi">
          <div className="label">Products</div>
          <div className="value">{products.length}</div>
          <div className="meta">{inStock} in stock</div>
        </article>
        <article className="admin-card admin-kpi">
          <div className="label">Brands</div>
          <div className="value">{brands.length}</div>
          <div className="meta">{categories.length} categories</div>
        </article>
        <article className="admin-card admin-kpi">
          <div className="label">Orders</div>
          <div className="value">{orders.length}</div>
          <div className="meta">{pending} awaiting payment</div>
        </article>
        <article className="admin-card admin-kpi">
          <div className="label">Paid total</div>
          <div className="value">{formatPrice(revenue)}</div>
          <div className="meta">From marked-paid checkouts</div>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Catalog mix</h2>
            <span className="admin-muted">Units by brand</span>
          </div>
          <div className="admin-bars">
            {byBrand.length ? (
              byBrand.map((item) => (
                <div className="admin-bar" key={item.name}>
                  <span>{item.name}</span>
                  <div className="admin-bar-track">
                    <span style={{ width: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                  <strong>{item.count}</strong>
                </div>
              ))
            ) : (
              <p className="admin-empty">No products yet.</p>
            )}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Type split</h2>
            <span className="admin-muted">Optical vs sun</span>
          </div>
          <div className="admin-donut-wrap">
            <svg viewBox="0 0 36 36" width="140" height="140">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#eee" strokeWidth="6" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#111"
                strokeWidth="6"
                strokeDasharray={`${opticalPct} ${100 - opticalPct}`}
                strokeDashoffset="25"
              />
            </svg>
            <div className="admin-legend">
              <div>
                <i style={{ background: "#111" }} />
                Optical {optical}
              </div>
              <div>
                <i style={{ background: "#cfcfcf" }} />
                Sunglasses {sunglasses}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Live products</h2>
            <Link href="/admin/products">View all</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product">
                        {product.images[0] ? <img src={product.images[0]} alt="" /> : <span className="admin-thumb" />}
                        <div>
                          <strong>{product.name}</strong>
                          <div className="admin-muted">{product.modelId ?? product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{brands.find((brand) => brand.id === product.brandId)?.name ?? "—"}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <span className={`admin-badge ${product.stockStatus === "in_stock" ? "is-in" : "is-out"}`}>
                        {product.stockStatus === "in_stock" ? "In stock" : "Out"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <h2>Recent checkouts</h2>
            <Link href="/admin/orders">View all</Link>
          </div>
          {orders.length ? (
            <div className="admin-feed">
              {orders.slice(0, 6).map((order) => (
                <div className="admin-feed-item" key={order.reference}>
                  <div>
                    <strong>{order.customer.fullName || order.reference}</strong>
                    <div className="admin-muted">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} · {order.paymentStatus}
                    </div>
                  </div>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-empty">Storefront checkouts will land here as soon as a guest places an order.</p>
          )}
        </article>
      </section>
    </>
  );
}
