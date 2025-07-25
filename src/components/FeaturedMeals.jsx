import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FeaturedMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const school = user?.school;

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      try {
        const res = await fetch(
          `https://mealpal-backend-emoq.onrender.com/api/meals/featured?school=${encodeURIComponent(
            school
          )}`
        );
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (err) {
        console.error("Error fetching featured meals:", err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    if (school) {
      fetchFeaturedMeals();
    }
  }, [school]);

  return (
    <section className="py-16 px-4 bg-yellow-50 text-center" id="meals">
      <h2 className="text-3xl font-bold text-red-500 mb-6">Featured Meals</h2>

      {loading ? (
        <p className="text-gray-500">Loading featured meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-gray-500">No featured meals yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={meal.img}
                  alt={meal.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{meal.name}</h3>
                  <p className="text-gray-700">₦{meal.price}</p>
                  <p className="text-sm text-gray-500">
                    Bought {meal.purchaseCount || 0} times
                  </p>
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
