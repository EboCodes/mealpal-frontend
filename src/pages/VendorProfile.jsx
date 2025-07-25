import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

function VendorProfile() {
  const { name } = useParams();
  const { addToCart } = useCart();
  const [meals, setMeals] = useState([]);
  const [vendorInfo, setVendorInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vendorName = decodeURIComponent(name);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's school for filtering meals
      const user = JSON.parse(localStorage.getItem("user"));
      const school = user?.school;

      // Fetch meals filtered by school (more efficient)
      const mealRes = await fetch(`https://mealpal-backend-emoq.onrender.com/api/meals${school ? `?school=${school}` : ''}`);
      
      if (!mealRes.ok) {
        throw new Error(`Failed to fetch meals: ${mealRes.status}`);
      }
      
      const mealData = await mealRes.json();
      
      // Debug: log what we got
      console.log("Fetched meals:", mealData);
      console.log("Looking for vendor:", vendorName);
      
      // Filter meals by vendor name - handle both string and object cases
      const filteredMeals = mealData.filter(meal => {
        // Handle case where meal.vendor is a populated object
        if (meal.vendor && typeof meal.vendor === 'object') {
          return meal.vendor.name?.toLowerCase() === vendorName.toLowerCase();
        }
        // Handle case where meal.vendor is still a string (shouldn't happen with your backend, but just in case)
        if (typeof meal.vendor === 'string') {
          return meal.vendor.toLowerCase() === vendorName.toLowerCase();
        }
        return false;
      });

      console.log("Filtered meals:", filteredMeals);
      setMeals(filteredMeals);

      // Fetch vendor profile
      const profileRes = await fetch(`https://mealpal-backend-emoq.onrender.com/api/vendor/${encodeURIComponent(vendorName)}`);
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        console.log("Vendor profile data:", profileData);
        setVendorInfo(profileData);
      } else {
        console.warn("Vendor profile not found, using default info");
        // Set default vendor info if profile not found
        setVendorInfo({
          name: vendorName,
          description: `Delicious meals by ${vendorName}. Enjoy tasty student-friendly dishes!`,
          coverImage: null,
          averageRating: 0
        });
      }
    } catch (err) {
      console.error("Error loading vendor profile or meals:", err);
      setError(err.message);
      // Set fallback data
      setVendorInfo({
        name: vendorName,
        description: `Delicious meals by ${vendorName}. Enjoy tasty student-friendly dishes!`,
        coverImage: null,
        averageRating: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [vendorName]);

  const handleRate = async (star) => {
    setRating(star);
    setSubmitted(true);
    try {
      const res = await fetch(`https://mealpal-backend-emoq.onrender.com/api/vendor/${encodeURIComponent(vendorName)}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: star }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      // ✅ Refresh vendor info with updated average rating
      await fetchVendorData();

    } catch (err) {
      console.error("Rating error:", err);
      setSubmitted(false); // Reset if failed
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4 bg-white text-center min-h-screen">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error && !vendorInfo) {
    return (
      <div className="py-16 px-4 bg-white text-center min-h-screen">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">Error loading vendor profile: {error}</p>
          <button 
            onClick={fetchVendorData}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-white text-center min-h-screen">
      <div className="max-w-3xl mx-auto mb-10">
        <img
          src={
            vendorInfo?.coverImage ||
            `https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29va2luZ3xlbnwwfHwwfHx8MA%3D%3D`
          }
          alt={vendorName}
          className="w-full h-48 object-cover rounded-xl shadow"
        />
        <h2 className="text-3xl font-bold text-red-500 mt-4">
          {vendorInfo?.name || vendorName}'s Profile
        </h2>
        <p className="text-gray-600 mb-2 italic">
          {vendorInfo?.description ||
            `Delicious meals by ${vendorName}. Enjoy tasty student-friendly dishes!`}
        </p>

        {/* ⭐ Rating */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Rate this Vendor</h3>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`text-3xl ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-300 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          {submitted && (
            <p className="mt-2 text-green-600 font-medium">Thanks for rating!</p>
          )}
          {vendorInfo?.averageRating !== undefined && (
            <p className="mt-1 text-sm text-gray-600">
              Average Rating: ⭐ {vendorInfo.averageRating.toFixed(1)}/5
            </p>
          )}
        </div>
      </div>

      {/* 🍽 Meals */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-red-500 mb-6">
          Meals by {vendorInfo?.name || vendorName}
        </h3>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-yellow-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={meal.img || meal.imageURL}
                  alt={meal.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-left">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {meal.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {meal.vendor?.name || vendorName}
                  </p>
                  <span className="font-bold text-red-500">₦{meal.price}</span>
                  <button
                    onClick={() => addToCart(meal)}
                    className="block w-full mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No meals available from this vendor.</p>
        )}
      </div>
    </section>
  );
}

export default VendorProfile;
