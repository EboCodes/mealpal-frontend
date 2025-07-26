import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // 🔧 Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }, []);

  // 🔧 Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  const toggleFavorite = (meal) => {
    setFavorites((prev) => {
      // 🔧 Use meal._id for comparison instead of name (more reliable)
      const exists = prev.find((item) => item._id === meal._id);
      
      if (exists) {
        // Remove from favorites
        return prev.filter((item) => item._id !== meal._id);
      } else {
        // Add to favorites - ensure we store all necessary data
        const mealToStore = {
          _id: meal._id,
          name: meal.name,
          price: meal.price,
          img: meal.img,
          vendor: meal.vendor?.name || meal.vendor, // Handle both object and string cases
          rating: meal.rating,
        };
        return [...prev, mealToStore];
      }
    });
  };

  // 🔧 Function to clear all favorites (optional utility)
  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite, 
      clearFavorites 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
