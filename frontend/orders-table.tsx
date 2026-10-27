"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/frontend/format";
import type { Order, OrderStatus, PaymentStatus } from "@/backend/models";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function patch(reference: string, patch: Partial<Order>) {
    await fetch(`/api/orders/${encodeURIComponent(reference)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    router.refresh();
  }

  if (!orders.length) {
    return <p className="admin-empty">No checkouts yet. Place an order on the storefront to see it here.</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.reference}>
              <td>
                <strong>{order.reference}</strong>
                <div className="admin-muted">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </div>
              </td>
              <td>
                {order.customer.fullName}
                <div className="admin-muted">{order.customer.email}</div>
              </td>
              <td>{formatPrice(order.total)}</td>
              <td>
                <select
                  value={order.paymentStatus}
                  onChange={(event) => patch(order.reference, { paymentStatus: event.target.value as PaymentStatus })}
                >
                  <option value="pending">Pending</option>
                  <option value="successful">Successful</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <select
                  value={order.orderStatus}
                  onChange={(event) => patch(order.reference, { orderStatus: event.target.value as OrderStatus })}
                >
                  <option value="demo_recorded">Recorded</option>
                  <option value="awaiting_payment">Awaiting payment</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
