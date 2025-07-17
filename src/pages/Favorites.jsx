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
        <p className="text-gray-500 italic">You haven’t added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {favorites.map((meal, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              <img
                src={meal.img}
                alt={meal.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-3">{meal.name}</h3>
              <Link
                to={`/vendor/${encodeURIComponent(meal.vendor)}`}
                className="text-sm text-red-500 hover:underline"
              >
                {meal.vendor}
              </Link>
              <p className="text-red-500 font-bold mt-1">₦{meal.price}</p>
              <button
                onClick={() => addToCart(meal)}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
