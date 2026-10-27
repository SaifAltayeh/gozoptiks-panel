import { OrdersTable } from "@/frontend/orders-table";
import { loadCatalog } from "@/backend/catalog";

export default async function AdminOrdersPage() {
  const { orders } = await loadCatalog();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p>Guest checkouts from the storefront, including pending Visa.</p>
        </div>
      </div>
      <article className="admin-card">
        <OrdersTable orders={orders} />
      </article>
    </>
  );
}
