import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState("user");
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("vendor") === "true") {
      setUserType("vendor");
    }
  }, [location]);

  const isStudent = userType === "user";
  const isVendor = userType === "vendor";
  const isSignup = mode === "signup";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignup
      ? "https://mealpal-backend-emoq.onrender.com/api/auth/register"
      : "https://mealpal-backend-emoq.onrender.com/api/auth/login";

    const payload = {
      ...form,
      role: isVendor ? "vendor" : "user",
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "An error occurred",
        });
        return;
      }

      if (!isSignup && data.role !== payload.role) {
        Swal.fire({
          icon: "warning",
          title: "Wrong Login Method",
          text: `This account is registered as a ${data.role}. Please use the correct login tab.`,
        });
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          role: data.role,
          name: data.name || form.name,
          email: data.email || form.email,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Welcome, ${data.name || form.name}`,
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (data.role === "vendor") {
          navigate("/dashboard");
        } else {
          navigate("/meals");
        }
      }, 1600);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-yellow-50 px-4 py-10">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">
        {/* Mode Switch */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            onClick={() => setMode("login")}
            className={`py-1 px-3 rounded font-semibold ${
              !isSignup ? "bg-red-500 text-white" : "text-red-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`py-1 px-3 rounded font-semibold ${
              isSignup ? "bg-red-500 text-white" : "text-red-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-between mb-6 border-b pb-2">
          <button
            onClick={() => setUserType("user")}
            className={`w-1/2 py-2 font-bold ${
              isStudent
                ? "text-red-600 border-b-4 border-red-600"
                : "text-gray-500"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setUserType("vendor")}
            className={`w-1/2 py-2 font-bold ${
              isVendor
                ? "text-red-600 border-b-4 border-red-600"
                : "text-gray-500"
            }`}
          >
            Vendor
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={isVendor ? "Business Name" : "Full Name"}
              className="w-full px-4 py-2 border rounded"
              required
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            required
          />

          {isSignup && isVendor && (
            <div className="bg-yellow-100 p-3 text-sm rounded border border-yellow-300 text-yellow-800">
              ⚠️ Vendors must pay a <strong>₦3,000 registration fee</strong> to activate their account.
              Payment step will follow after submitting this form (Payment system not integrated yet).
            </div>
          )}

          <button
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            {isSignup
              ? isVendor
                ? "Continue to Payment"
                : "Sign Up as Student"
              : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Auth;
