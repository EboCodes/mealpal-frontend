import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function VendorOrders({ vendorName }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const statuses = ["Pending", "Preparing", "Delivered"];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://mealpal-backend-emoq.onrender.com/api/orders/vendor/${vendorName}`);
      const data = await res.json();
      setOrders(data);

      // Calculate revenue for this vendor
      const total = data.reduce((sum, order) => {
        const vendorItems = order.items.filter((item) => item.vendor === vendorName);
        const vendorTotal = vendorItems.reduce(
          (itemSum, item) => itemSum + item.price * (item.quantity || 1),
          0
        );
        return sum + vendorTotal;
      }, 0);

      setRevenue(total);
    } catch (err) {
      toast.error("Failed to fetch vendor orders");
      console.error("Error fetching vendor orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorName) {
      fetchOrders();
    }
  }, [vendorName]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://mealpal-backend-emoq.onrender.com/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <section className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-red-500 mb-4">{vendorName}’s Orders</h2>

      {loading ? (
        <p className="text-gray-500 italic">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 italic">No orders yet</p>
      ) : (
        <>
          <div className="mb-6 text-green-600 font-medium">
            📊 Total Revenue: ₦{revenue.toLocaleString()}
          </div>

          {orders.map((order, idx) => (
            <div key={order._id} className="mb-4 p-4 border rounded shadow bg-gray-50">
              <h4 className="font-semibold mb-2">
                Order #{idx + 1} –{" "}
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </h4>

              <ul className="text-sm list-disc pl-4 mb-2">
                {order.items
                  .filter((item) => item.vendor === vendorName)
                  .map((item, i) => (
                    <li key={i}>
                      {item.name} — ₦{item.price} × {item.quantity || 1}
                    </li>
                  ))}
              </ul>

              <div className="text-sm text-gray-700 mb-1">
                Delivery: {order.delivery ? "Yes" : "No"}
              </div>
              {order.delivery && (
                <>
                  <div className="text-sm text-gray-700">📍 {order.deliveryAddress || "N/A"}</div>
                  <div className="text-sm text-gray-700">📞 {order.phoneNumber || "N/A"}</div>
                </>
              )}

              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <select
                  className="text-sm border rounded px-2 py-1"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

export default VendorOrders;
