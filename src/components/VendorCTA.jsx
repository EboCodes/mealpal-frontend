import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function VendorCTA() {
  const navigate = useNavigate();

  const handleVendorRegister = () => {
    Swal.fire({
      title: 'Switch to Vendor?',
      text: 'You are currently logged in as a student. Do you want to log out and register as a vendor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user"); // Logout student
        navigate("/auth?vendor=true");   // Redirect to vendor signup
      }
    });
  };

  return (
    <section className="bg-red-500 text-white py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Are You a Food Vendor on Campus?
        </h2>
        <p className="mb-6 text-lg">
          Join MealPal and start reaching students with your delicious meals. Upload menus, manage orders, and grow your sales!
        </p>
        <button
          onClick={handleVendorRegister}
          className="inline-block bg-white text-red-600 font-semibold px-6 py-3 rounded hover:bg-gray-200 transition"
        >
          Register as a Vendor
        </button>
      </div>
    </section>
  );
}

export default VendorCTA;
