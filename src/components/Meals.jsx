import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const fallbackImage = "https://via.placeholder.com/400x300.png?text=Meal+Image";

function RatingStars({ value = 4.0 }) {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}
      {hasHalf && <span>☆</span>}
      <span className="text-gray-500 ml-1">({value.toFixed(1)})</span>
    </div>
  );
}

function Meals() {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const school = user?.school;
        if (!school) {
          console.warn("No school found for user.");
          setMeals([]);
          return;
        }

        const res = await fetch(
          `https://mealpal-backend-emoq.onrender.com/api/meals?school=${school}`
        );

        if (!res.ok) throw new Error("Meal fetch failed");

        const data = await res.json();
        setMeals(data.meals || []);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setMeals([]);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = (meals || [])
    .filter((meal) => {
      const vendorName = meal.vendor?.name || "";
      return (
        meal.name.toLowerCase().includes(query.toLowerCase()) ||
        vendorName.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <section className="py-16 px-4 bg-yellow-50 text-center">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Meals</h2>

      {/* 🔍 Search Input */}
      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search meals or vendors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      {/* 🔽 Sort Dropdown */}
      <div className="mb-10 max-w-md mx-auto">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700"
        >
          <option value="">Sort by: Latest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* 🧾 Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredMeals.map((meal, i) => {
          // 🔧 FIX: Use meal._id for favorites comparison instead of name
          const isFav = favorites.some((fav) => fav._id === meal._id);
          const vendorName = meal.vendor?.name || "Unknown Vendor";
          
          return (
            <div key={meal._id || i} className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <button
                onClick={() => toggleFavorite(meal)}
                className="absolute top-3 right-3 text-xl"
              >
                {isFav ? "❤️" : "🤍"}
              </button>
              <img
                src={meal.img || fallbackImage}
                alt={meal.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-left">
                <h3 className="text-xl font-semibold text-gray-800">{meal.name}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span
                    onClick={() => {
                      if (!user) {
                        navigate("/auth");
                      } else {
                        // 🔧 FIX: Navigate using vendor NAME instead of ID
                        navigate(`/vendor/${encodeURIComponent(vendorName)}`);
                      }
                    }}
                    className="text-sm text-red-500 hover:underline cursor-pointer"
                  >
                    {vendorName}
                  </span>
                  <RatingStars value={meal.rating || 4.0} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-500">₦{meal.price}</span>
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate("/auth");
                      } else {
                        addToCart(meal);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMeals.length === 0 && (
          <p className="col-span-full text-gray-500 italic">
            No meals match your search.
          </p>
        )}
      </div>
    </section>
  );
}

export default Meals;
