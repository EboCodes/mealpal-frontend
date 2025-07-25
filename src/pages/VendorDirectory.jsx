import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function VendorDirectory() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const school = user?.school;

      if (!school) {
        console.warn("No school found for user");
        setLoading(false);
        return;
      }

      try {
        
        const res = await fetch(
          `https://mealpal-backend-emoq.onrender.com/api/vendor?school=${school}`
        );

        console.log("Vendors fetch response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Vendors fetch error:", errorText);
          throw new Error(`Failed to fetch vendors: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched vendors:", data);
        
        // Sort by average rating (highest first)
        const sorted = data.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        setVendors(sorted);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-yellow-50 min-h-screen">
        <div className="text-center text-gray-600 text-lg">Loading vendors...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-yellow-50 min-h-screen">
      <h2 className="text-3xl font-bold text-red-500 mb-8 text-center">Our Vendors</h2>

      {vendors.length === 0 ? (
        <p className="text-center text-gray-500">No vendors found for your school.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vendors.map((vendor) => (
            <Link
              key={vendor.name} // Use name as key instead of index for better React performance
              to={`/vendor/${encodeURIComponent(vendor.name)}`}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition block"
            >
              <img
                src={
                  vendor.coverImage ||
                  `https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=500&auto=format&fit=crop&q=60`
                }
                alt={vendor.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{vendor.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {vendor.description || "Delicious meals available!"}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-yellow-500 text-sm">
                  ⭐ {vendor.averageRating ? vendor.averageRating.toFixed(1) : "New"}
                </div>
                <span className="text-xs text-gray-500">
                  {vendor.averageRating ? `${vendor.averageRating.toFixed(1)}/5` : "No ratings yet"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default VendorDirectory;
