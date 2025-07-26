import { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function Cart() {
  const [useDelivery, setUseDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔧 FIX: Use correct cart property name from context
  const { cart, removeFromCart, clearCart, updateQuantity, totalPrice, totalItems } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));

  const deliveryFee = useDelivery ? 600 : 0;
  const total = totalPrice + deliveryFee;

  const handleConfirm = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (useDelivery && (!deliveryAddress || !phoneNumber)) {
      toast.error("Please enter delivery address and phone number.");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please enter your phone number.");
      return;
    }

    setLoading(true);

    try {
      // 🔧 FIX: Transform cart items with proper structure
      const transformedItems = cart.map(item => ({
        _id: item._id,              // 🔧 Important: Use _id for meal identification
        mealId: item._id,           // 🔧 Also include mealId for backward compatibility
        name: item.name,
        vendor: item.vendor?.name || item.vendor, // Handle both object and string
        price: item.price,
        quantity: item.quantity || 1,
        img: item.img
      }));

      const orderData = {
        items: transformedItems,
        userEmail: user?.email,
        total,
        delivery: useDelivery,
        deliveryAddress: useDelivery ? deliveryAddress : "",
        phoneNumber: phoneNumber,
      };

      console.log("Sending order data:", orderData); // Debug log

      const res = await fetch("https://mealpal-backend-emoq.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Order created successfully:", result);
        
        toast.success("🎉 Order confirmed!");
        clearCart();
        setUseDelivery(false);
        setDeliveryAddress("");
        setPhoneNumber("");
      } else {
        const errorData = await res.json();
        console.error("Order failed:", errorData);
        toast.error(errorData.message || "Failed to confirm order");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item._id);
      toast.success("Removed from cart");
    } else {
      updateQuantity(item._id, newQuantity);
    }
  };

  if (!user) {
    return (
      <section className="bg-white py-16 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-6">Your Cart</h2>
          <p className="text-red-500 mb-4">Please log in to view your cart</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button 
              onClick={() => window.location.href = '/meals'}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Browse Meals
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-yellow-50 p-4 rounded shadow">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      ₦{item.price} × {item.quantity} = ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">by {item.vendor?.name || item.vendor}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      removeFromCart(item._id);
                      toast.success("Removed from cart");
                    }}
                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Phone Number - Always Required */}
              <div className="mt-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>

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
                <div className="mt-4">
                  <label className="block font-medium text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your full delivery address"
                    rows="3"
                    required
                  />
                </div>
              )}

              {useDelivery && (
                <div className="flex justify-between bg-yellow-100 p-3 rounded text-yellow-900 font-medium">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Items ({totalItems})</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              {useDelivery && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading || !phoneNumber || (useDelivery && !deliveryAddress)}
              className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Placing Order...' : `Confirm Order (₦${total.toLocaleString()})`}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
