import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🔧 Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // 🔧 Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (meal) => {
    setCart((prev) => {
      // Check if meal already exists in cart
      const existingItem = prev.find((item) => item._id === meal._id);
      
      if (existingItem) {
        // If exists, increment quantity
        return prev.map((item) =>
          item._id === meal._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new, add with quantity 1
        return [...prev, { ...meal, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (mealId) => {
    setCart((prev) => prev.filter((item) => item._id !== mealId));
  };

  const updateQuantity = (mealId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    
    setCart((prev) =>
      prev.map((item) =>
        item._id === mealId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Note: Purchase count tracking is now handled automatically 
  // when orders are created in orderRoutes.js

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate total items
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
