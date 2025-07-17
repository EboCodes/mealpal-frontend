import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // <-- import useNavigate

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
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();  // <-- initialize navigate
  const user = JSON.parse(localStorage.getItem("user")); // <-- get logged-in user info

  const staticMeals = [
    {
      name: "Jollof Rice & Chicken",
      vendor: "Mama Nkechi's",
      price: 1200,
      rating: 4.3,
      img: "https://plus.unsplash.com/premium_photo-1694141252026-3df1de888a21?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "Spaghetti & Turkey",
      vendor: "Chef T",
      price: 1500,
      rating: 4.7,
      img: "https://plus.unsplash.com/premium_photo-1677000666741-17c3c57139a2?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "Indomie & Boiled Egg",
      vendor: "Auntie Mo",
      price: 800,
      rating: 3.9,
      img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    },
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("https://mealpal-backend-emoq.onrender.com/api/meals");
        const backendMeals = await res.json();
        setMeals([...staticMeals, ...backendMeals]);
      } catch (err) {
        console.error("Error loading meals:", err);
        setMeals(staticMeals); // fallback
      }
    };
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(query.toLowerCase()) ||
      meal.vendor.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="py-16 px-4 bg-yellow-50 text-center" id="meals">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Featured Meals</h2>

      <div className="mb-10 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search meals or vendors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredMeals.map((meal, i) => {
          const isFav = favorites.some((fav) => fav.name === meal.name);
          return (
            <div key={i} className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
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
                        navigate("/login");
                      } else {
                        navigate(`/vendor/${encodeURIComponent(meal.vendor)}`);
                      }
                    }}
                    className="text-sm text-red-500 hover:underline cursor-pointer"
                  >
                    {meal.vendor}
                  </span>
                  <RatingStars value={meal.rating || 4.0} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-500">₦{meal.price}</span>
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate("/login");
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
