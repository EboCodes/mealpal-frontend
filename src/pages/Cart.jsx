import { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function Cart() {
  const [useDelivery, setUseDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { cartItems, removeFromCart, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));

  const deliveryFee = useDelivery ? 600 : 0;
  const total = cartItems.reduce((sum, item) => sum + item.price, 0) + deliveryFee;

  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (useDelivery && (!deliveryAddress || !phoneNumber)) {
      toast.error("Please enter delivery address and phone number.");
      return;
    }

    const orderData = {
      items: cartItems,
      userEmail: user?.email,
      total,
      delivery: useDelivery,
      deliveryAddress: useDelivery ? deliveryAddress : "",
      phoneNumber: useDelivery ? phoneNumber : "",
    };

    try {
      const res = await fetch("https://mealpal-backend-emoq.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        toast.success("🎉 Order confirmed!");
        clearCart();
        setUseDelivery(false);
        setDeliveryAddress("");
        setPhoneNumber("");
      } else {
        toast.error("Failed to confirm order");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="bg-white py-16 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-red-500 mb-6">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-yellow-50 p-4 rounded shadow">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">₦{item.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(i);
                      toast.success("Removed from cart");
                    }}
                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Delivery Toggle */}
              <div className="flex items-center justify-between p-4 border rounded">
                <label htmlFor="delivery" className="font-semibold text-gray-700">
                  Delivery? (+₦600)
                </label>
                <input
                  id="delivery"
                  type="checkbox"
                  checked={useDelivery}
                  onChange={() => setUseDelivery(!useDelivery)}
                  className="w-5 h-5"
                />
              </div>

              {useDelivery && (
                <>
                  <div className="mt-4">
                    <label className="block font-medium text-gray-700 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter delivery address"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="flex justify-between bg-yellow-100 p-3 rounded text-yellow-900 font-medium mt-4">
                    <span>Delivery Fee</span>
                    <span>₦{deliveryFee}</span>
                  </div>
                </>
              )}
            </div>

            {/* Total & Confirm */}
            <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
              <span>Total:</span>
              <span>₦{total}</span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-6 bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
            >
              Confirm Order
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
