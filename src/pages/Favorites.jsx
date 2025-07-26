import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Favorites() {
  const { favorites } = useFavorites();
  const { addToCart } = useCart();

  return (
    <section className="py-16 px-4 bg-yellow-50 text-center min-h-screen">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Your Favorites</h2>

      {favorites.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 italic mb-4">You haven't added any favorites yet.</p>
          <Link 
            to="/meals" 
            className="text-red-500 hover:underline font-medium"
          >
            Browse meals to add some favorites!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {favorites.map((meal) => (
            <div key={meal._id} className="bg-white rounded-xl shadow p-4">
              <img
                src={meal.img || "https://via.placeholder.com/400x300.png?text=Meal+Image"}
                alt={meal.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-3">{meal.name}</h3>
              
              {/* 🔧 FIX: Handle vendor name properly and use encodeURIComponent */}
              <Link
                to={`/vendor/${encodeURIComponent(meal.vendor)}`}
                className="text-sm text-red-500 hover:underline block mt-1"
              >
                by {meal.vendor}
              </Link>
              
              <p className="text-red-500 font-bold mt-2 mb-3">₦{meal.price}</p>
              
              <button
                onClick={() => addToCart(meal)}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
