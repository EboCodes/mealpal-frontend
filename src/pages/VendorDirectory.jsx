// VendorDirectory.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function VendorDirectory() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("https://mealpal-backend-emoq.onrender.com/api/vendor");
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error("Failed to load vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  return (
    <section className="py-16 px-4 bg-yellow-50 min-h-screen">
      <h2 className="text-3xl font-bold text-red-500 mb-8 text-center">Our Vendors</h2>

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
                `https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29va2luZ3xlbnwwfHwwfHx8MA%3D%3D,${v.name}`
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
    </section>
  );
}

export default VendorDirectory;
