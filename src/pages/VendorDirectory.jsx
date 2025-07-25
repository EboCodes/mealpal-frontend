import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function VendorDirectory() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const school = user?.school;

      if (!school) return;

      try {
        const res = await fetch(
          `https://mealpal-backend-emoq.onrender.com/api/vendors?school=${encodeURIComponent(school)}`
        );

        if (!res.ok) throw new Error("Failed to fetch vendors");

        const data = await res.json();
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

  return (
    <section className="py-16 px-4 bg-yellow-50 min-h-screen">
      <h2 className="text-3xl font-bold text-red-500 mb-8 text-center">Our Vendors</h2>

      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading vendors...</div>
      ) : vendors.length === 0 ? (
        <p className="text-center text-gray-500">No vendors found for your school.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vendors.map((v, i) => (
            <Link
              key={i}
              to={`/vendor/${encodeURIComponent(v.name)}`}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition block"
            >
              <img
                src={
                  v.coverImage ||
                  `https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=500&auto=format&fit=crop&q=60`
                }
                alt={v.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{v.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{v.description}</p>
              <div className="text-yellow-500 text-sm">
                ⭐ {v.averageRating?.toFixed(1) || "N/A"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default VendorDirectory;
