import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast"; // ✅ Added

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Meals from "./components/Meals";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import Favorites from "./pages/Favorites";
import VendorProfile from "./pages/VendorProfile";
import VendorDashboard from "./pages/VendorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorDirectory from "./pages/VendorDirectory";
import VendorOrders from "./pages/VendorOrders"; // ✅ Import VendorOrders

function AppWrapper() {
  const location = useLocation();
  const [isVendor, setIsVendor] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!storedUser?.token);
    setIsVendor(storedUser?.role === "vendor");
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/meals" element={<Meals />} />

        {/* Routes for STUDENTS only */}
        {isLoggedIn && !isVendor && (
          <>
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/:name"
              element={
                <ProtectedRoute>
                  <VendorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute>
                  <VendorDirectory />
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Routes for VENDORS only */}
        {isLoggedIn && isVendor && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <VendorOrders />
                </ProtectedRoute>
              }
            />
          </>
        )}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} /> {/* ✅ Added */}
      <AppWrapper />
    </Router>
  );
}

export default App;
