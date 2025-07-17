function Hero() {
  return (
    <section className="bg-yellow-50 py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
          Order Meals Easily, On Campus 🍛
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          No more waiting in line. Book your favorite meals from anywhere.
        </p>
        <a href="#meals" className="inline-block bg-red-500 text-white font-semibold px-6 py-3 rounded hover:bg-red-600 transition">
          Browse Meals
        </a>
      </div>
    </section>
  );
}

export default Hero;
