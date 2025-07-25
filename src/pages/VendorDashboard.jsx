import { useState, useEffect } from "react";
import VendorOrders from "./VendorOrders";
import toast from "react-hot-toast";

function VendorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorName = user?.name || "Unknown Vendor";

  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", imageFile: null, editingId: null });
  const [previewURL, setPreviewURL] = useState("");

  const [profile, setProfile] = useState({ description: "", coverImage: null });
  const [coverPreview, setCoverPreview] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSubmittingMeal, setIsSubmittingMeal] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const mealRes = await fetch(`https://mealpal-backend-emoq.onrender.com/api/meals?email=${user.email}`);
      const mealsData = await mealRes.json();
      setMeals(mealsData.filter((m) => m.vendor === vendorName));

      const profileRes = await fetch(`https://mealpal-backend-emoq.onrender.com/api/vendor/${vendorName}`);
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData) {
        setProfile({
          description: profileData.description || "",
          coverImage: profileData.coverImage || null,
        });
        setCoverPreview(profileData.coverImage);
      }
    } catch (err) {
      console.error("Error loading:", err);
      toast.error("Failed to load meals or profile");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [vendorName]);


  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage" && files.length > 0) {
      setProfile((prev) => ({ ...prev, coverImage: files[0] }));
      setCoverPreview(URL.createObjectURL(files[0]));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const formData = new FormData();
    formData.append("email", user?.email);
    formData.append("description", profile.description);
    if (profile.coverImage instanceof File) {
      formData.append("coverImage", profile.coverImage);
    }

    try {
      const res = await fetch("https://mealpal-backend-emoq.onrender.com/api/vendor/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated!");
        setCoverPreview(data.coverImage);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleMealChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files[0]) {
      setForm({ ...form, imageFile: files[0] });
      setPreviewURL(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddOrEditMeal = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    setIsSubmittingMeal(true);
    const formData = new FormData();
    formData.append("name", form.name);
	formData.append("price", form.price);
	formData.append("vendor", vendorName);
	formData.append("school", user?.school || "Unknown"); 

    if (form.imageFile instanceof File) {
      formData.append("image", form.imageFile);
    }

    try {
      const endpoint = form.editingId
        ? `https://mealpal-backend-emoq.onrender.com/api/meals/${form.editingId}`
        : "https://mealpal-backend-emoq.onrender.com/api/meals";
      const method = form.editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, { method, body: formData });
      const data = await res.json();

      if (res.ok) {
        setMeals((prev) =>
          form.editingId
            ? prev.map((m) => (m._id === form.editingId ? data : m))
            : [...prev, data]
        );
        setForm({ name: "", price: "", imageFile: null, editingId: null });
        setPreviewURL("");
        toast.success(form.editingId ? "Meal updated!" : "Meal added!");
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmittingMeal(false);
    }
  };

  const handleEditMeal = (meal) => {
    setForm({
      name: meal.name,
      price: meal.price,
      imageFile: null,
      editingId: meal._id,
    });
    setPreviewURL(meal.img || meal.imageURL);
  };

  const handleDeleteMeal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      const res = await fetch(`https://mealpal-backend-emoq.onrender.com/api/meals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMeals((prev) => prev.filter((m) => m._id !== id));
        toast.success("Meal deleted.");
      } else {
        toast.error("Delete failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading Dashboard...</p>;
  }

  return (
    <section className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-red-500 mb-6">{vendorName}'s Dashboard</h2>

        {/* 🧑🏽‍🍳 Profile Section */}
        <div className="bg-white border border-yellow-200 p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-semibold mb-4">Vendor Profile</h3>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleProfileChange}
            rows={3}
            placeholder="Describe your food service..."
            className="w-full border px-3 py-2 rounded mb-4"
          />
          <input type="file" name="coverImage" onChange={handleProfileChange} accept="image/*" />
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="w-full h-40 object-cover rounded mt-4"
            />
          )}
          <button
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="mt-4 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
          >
            {isSavingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* 🍽️ Meal Upload/Edit Form */}
        <form
          onSubmit={handleAddOrEditMeal}
          className="bg-yellow-50 p-6 rounded shadow mb-10 space-y-4"
        >
          <h3 className="text-xl font-semibold mb-2">
            {form.editingId ? "Edit Meal" : "Upload a New Meal"}
          </h3>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleMealChange}
            placeholder="Meal Name"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleMealChange}
            placeholder="Price (₦)"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleMealChange}
            className="w-full px-4 py-2 border rounded"
          />
          {previewURL && (
            <img
              src={previewURL}
              alt="Preview"
              className="w-40 h-40 object-cover rounded border"
            />
          )}
          <button
            type="submit"
            disabled={isSubmittingMeal}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            {form.editingId ? "Update Meal" : isSubmittingMeal ? "Uploading..." : "Add Meal"}
          </button>
        </form>

        {/* 🍽️ Uploaded Meals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {meals.length === 0 ? (
            <p className="text-gray-500 italic">No meals uploaded yet.</p>
          ) : (
            meals.map((meal) => (
              <div key={meal._id} className="bg-yellow-100 p-4 rounded shadow relative">
                <img
                  src={meal.img || meal.imageURL}
                  alt={meal.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="text-lg font-bold mt-2">{meal.name}</h4>
                <p className="text-sm text-gray-600">Vendor: {meal.vendor}</p>
                <p className="text-red-500 font-semibold">₦{meal.price}</p>
                <div className="flex justify-end mt-2 gap-2">
                  <button
                    onClick={() => handleEditMeal(meal)}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 📦 Vendor Orders */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Orders</h3>
          <VendorOrders vendorName={vendorName} />
        </div>
      </div>
    </section>
  );
}

export default VendorDashboard;
