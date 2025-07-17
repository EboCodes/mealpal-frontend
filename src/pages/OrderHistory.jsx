import { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://mealpal-backend-emoq.onrender.com/api/orders/${user?.email}`);
        const data = await res.json();
        if (res.ok) setOrders(data);
        else console.error("Failed to fetch orders");
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Hide loading after fetch
      }
    };

    fetchOrders();
  }, [user?.email]);

  return (
    <section className="py-16 px-4 min-h-screen bg-white">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Order History</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order, i) => (
          <div key={i} className="bg-yellow-50 rounded-xl p-4 mb-4 shadow space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Order Date:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <ul className="text-sm border-t pt-2">
              {order.items.map((item, j) => (
                <li key={j} className="flex justify-between mb-1">
                  <span>{item.name} ({item.vendor})</span>
                  <span>
                    ₦{item.price} × {item.quantity || 1}
                  </span>
                </li>
              ))}
            </ul>

            {order.delivery && (
              <>
                <p className="text-yellow-700">
                  <span className="font-medium">📍 Address:</span>{" "}
                  {order.deliveryAddress || "N/A"}
                </p>
                <p className="text-yellow-700">
                  <span className="font-medium">📞 Phone:</span>{" "}
                  {order.phoneNumber || "N/A"}
                </p>
              </>
            )}

            <p className="text-gray-700">
              <span className="font-medium">Delivery:</span>{" "}
              {order.delivery ? "Yes (₦300)" : "No"}
            </p>

            <p className="text-blue-600 font-medium">
              Status: {order.status || "Pending"}
            </p>
          </div>
        ))
      )}
    </section>
  );
}

export default OrderHistory;
