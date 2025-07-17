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

  const vendorName = decodeURIComponent(name);

  const fetchVendorData = async () => {
    try {
      const mealRes = await fetch("https://mealpal-backend-emoq.onrender.com/api/meals");
      const mealData = await mealRes.json();
      setMeals(mealData.filter(meal => meal.vendor.toLowerCase() === vendorName.toLowerCase()));

      const profileRes = await fetch(`https://mealpal-backend-emoq.onrender.com/api/vendor/${vendorName}`);
      const profileData = await profileRes.json();
      setVendorInfo(profileData);
    } catch (err) {
      console.error("Error loading vendor profile or meals:", err);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [vendorName]);

  const handleRate = async (star) => {
    setRating(star);
    setSubmitted(true);
    try {
      const res = await fetch(`https://mealpal-backend-emoq.onrender.com/api/vendor/${vendorName}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: star }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      // ✅ Refresh vendor info with updated average rating
      await fetchVendorData();

    } catch (err) {
      console.error("Rating error:", err);
    }
  };

  return (
    <section className="py-16 px-4 bg-white text-center min-h-screen">
      <div className="max-w-3xl mx-auto mb-10">
        <img
          src={
            vendorInfo?.coverImage ||
            `https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29va2luZ3xlbnwwfHwwfHx8MA%3D%3D,${vendorName}`
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
                }`}
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
              Average Rating: ⭐ {vendorInfo.averageRating}/5
            </p>
          )}
        </div>
      </div>

      {/* 🍽 Meals */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-red-500 mb-6">
          Meals by {vendorName}
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
          <p className="text-gray-500 italic">No meals listed yet.</p>
        )}
      </div>
    </section>
  );
}

export default VendorProfile;
