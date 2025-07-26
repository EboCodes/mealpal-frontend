import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart(); // ✅ Renamed from cartItems

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/auth");

      Swal.fire({
        icon: 'success',
        title: 'Logged out!',
        text: 'You have been successfully logged out.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const isVendor = user?.role === "vendor";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* 🌟 Logo */}
        <Link to="/" className="flex items-center" onClick={handleClose}>
          <img src="/meal.png" alt="MealPal Logo" className="h-10 w-auto" />
        </Link>

        {/* 🌐 Navigation */}
        <nav className={`${
          open
            ? 'flex flex-col gap-4 absolute top-16 right-4 bg-white p-6 rounded-md shadow-md z-40'
            : 'hidden'
        } md:flex md:items-center md:gap-6 md:static md:bg-transparent`}>

          <Link to="/" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
            Home
          </Link>

          {/* 👨‍🎓 Student-Only Links */}
          {user && !isVendor && (
            <>
              <Link to="/meals" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
                Meals
              </Link>
              <Link to="/vendors" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
                Browse Vendors
              </Link>
              <Link to="/orders" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
                Orders
              </Link>
              <Link to="/favorites" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
                Favorites
              </Link>
              <Link to="/cart" className="relative text-gray-700 hover:text-red-500" onClick={handleClose}>
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* 🧑‍🍳 Vendor Dashboard */}
          {user && isVendor && (
            <Link to="/dashboard" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
              Dashboard
            </Link>
          )}

          {/* 🔐 Auth Section */}
          {user ? (
            <button
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="text-gray-700 hover:text-red-500" onClick={handleClose}>
              Login / Register
            </Link>
          )}
        </nav>

        {/* 🍔 Hamburger Icon */}
        <div className="md:hidden cursor-pointer z-50" onClick={() => setOpen(!open)}>
          <div className={`w-6 h-1 bg-black mb-1 transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-1 bg-black mb-1 transition-opacity ${open ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-1 bg-black transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
