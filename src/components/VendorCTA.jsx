import React from 'react';
import { Link } from 'react-router-dom';

function VendorCTA() {
  return (
    <section className="bg-red-500 text-white py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Are You a Food Vendor on Campus?
        </h2>
        <p className="mb-6 text-lg">
          Join MealPal and start reaching students with your delicious meals. Upload menus, manage orders, and grow your sales!
        </p>
		<Link
		  to="/auth?vendor=true"
		  className="inline-block bg-white text-red-600 font-semibold px-6 py-3 rounded hover:bg-gray-200 transition"
		>
		  Register as a Vendor
		</Link>

      </div>
    </section>
  );
}

export default VendorCTA;
