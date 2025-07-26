import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function FeaturedMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));
  const school = user?.school;

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!school) {
          setError("Please log in to view featured meals.");
          setMeals([]);
          return;
        }

        const res = await fetch(
          `https://mealpal-backend-emoq.onrender.com/api/meals/featured?school=${encodeURIComponent(school)}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch featured meals: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Featured meals data:", data); // Debug log
        
        setMeals(data.meals || []);
      } catch (err) {
        console.error("Error fetching featured meals:", err);
        setError(err.message);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMeals();
  }, [school]);

  const handleAddToCart = (meal) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart(meal);
  };

  const handleVendorClick = (vendorName) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/vendor/${encodeURIComponent(vendorName)}`);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-yellow-50 text-center" id="meals">
        <h2 className="text-3xl font-bold text-red-500 mb-6">Featured Meals</h2>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="text-gray-500 ml-3">Loading featured meals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-yellow-50 text-center" id="meals">
        <h2 className="text-3xl font-bold text-red-500 mb-6">Featured Meals</h2>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          {!user && (
            <Link
              to="/auth"
              className="inline-block bg-red-500 text-white font-semibold px-6 py-3 rounded hover:bg-red-600 transition"
            >
              Login to View Meals
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-yellow-50 text-center" id="meals">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Featured Meals</h2>

      {meals.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No featured meals yet.</p>
          <Link
            to="/meals"
            className="inline-block bg-red-500 text-white font-semibold px-6 py-3 rounded hover:bg-red-600 transition"
          >
            Browse All Meals
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={meal.img || "https://via.placeholder.com/400x300.png?text=Meal+Image"}
                  alt={meal.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {meal.name}
                  </h3>
                  
                  {/* Vendor Info */}
                  <button
                    onClick={() => handleVendorClick(meal.vendor?.name)}
                    className="text-sm text-red-500 hover:underline mb-2 block"
                  >
                    by {meal.vendor?.name || "Unknown Vendor"}
                  </button>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-red-500">
                      ₦{meal.price}
                    </span>
                    <span className="text-xs text-gray-500">
                      {meal.purchaseCount > 0 
                        ? `Ordered ${meal.purchaseCount} times` 
                        : "New!"
                      }
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(meal)}
                    className="w-full bg-red-500 text-white font-medium py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/meals"
              className="inline-block bg-red-500 text-white font-semibold px-6 py-3 rounded hover:bg-red-600 transition"
            >
              Browse All Meals
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default FeaturedMeals;
