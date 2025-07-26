import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🔧 FIX: Load cart from localStorage with better error handling
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // 🔧 Validate that it's actually an array
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.warn("Invalid cart data in localStorage, clearing...");
          localStorage.removeItem("cart");
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("cart");
    }
  }, []);

  // 🔧 FIX: Save cart to localStorage with validation
  useEffect(() => {
    try {
      if (Array.isArray(cart)) {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (meal) => {
    // 🔧 FIX: Add validation for meal object
    if (!meal || !meal._id) {
      console.error("Invalid meal object passed to addToCart:", meal);
      return;
    }

    setCart((prev) => {
      // 🔧 Ensure prev is always an array
      const currentCart = Array.isArray(prev) ? prev : [];
      
      // Check if meal already exists in cart
      const existingItem = currentCart.find((item) => item?._id === meal._id);
      
      if (existingItem) {
        // If exists, increment quantity
        return currentCart.map((item) =>
          item?._id === meal._id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      } else {
        // If new, add with quantity 1
        return [...currentCart, { ...meal, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (mealId) => {
    if (!mealId) {
      console.error("No mealId provided to removeFromCart");
      return;
    }
    
    setCart((prev) => {
      const currentCart = Array.isArray(prev) ? prev : [];
      return currentCart.filter((item) => item?._id !== mealId);
    });
  };

  const updateQuantity = (mealId, newQuantity) => {
    if (!mealId) {
      console.error("No mealId provided to updateQuantity");
      return;
    }
    
    if (newQuantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    
    setCart((prev) => {
      const currentCart = Array.isArray(prev) ? prev : [];
      return currentCart.map((item) =>
        item?._id === mealId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // 🔧 FIX: Calculate totals with better validation
  const totalPrice = Array.isArray(cart) 
    ? cart.reduce((total, item) => {
        if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
          return total + (item.price * item.quantity);
        }
        return total;
      }, 0)
    : 0;

  const totalItems = Array.isArray(cart)
    ? cart.reduce((total, item) => {
        if (item && typeof item.quantity === 'number') {
          return total + item.quantity;
        }
        return total;
      }, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart: Array.isArray(cart) ? cart : [], // Always ensure cart is an array
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
