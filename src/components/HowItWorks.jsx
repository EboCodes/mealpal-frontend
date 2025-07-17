function HowItWorks() {
  const steps = [
    {
      icon: '🍽️',
      title: 'Browse Meals',
      desc: 'Explore available meals from campus vendors in real-time.',
    },
    {
      icon: '📱',
      title: 'Book Online',
      desc: 'Select, book, and pay ahead with ease on your phone.',
    },
    {
      icon: '🛍️',
      title: 'Doorstep Delivery',
      desc: 'Skip the lines. Skip the stress. Order from the comfort of your home and get it at your doorstep!',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2 className="text-3xl font-bold text-red-500 mb-10">How It Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="bg-yellow-50 rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="text-5xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">{step.title}</h3>
            <p className="text-gray-700">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
