import { Link, Navigate } from "react-router-dom";

function Landing() {
  const user = JSON.parse(localStorage.getItem("user")); // or use your auth context

  if (user) {
    return <Navigate to="/meals" />;
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Welcome to MealPal 🍽️</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl">
        Discover, order, and enjoy meals from your favorite campus vendors.
        Fast, reliable, and made just for students!
      </p>
      <Link
        to="/auth"
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md text-lg transition"
      >
        Get Started
      </Link>
    </div>
  );
}

export default Landing;
