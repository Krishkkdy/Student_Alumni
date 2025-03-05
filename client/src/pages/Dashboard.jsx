import React from "react";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-hidden mx-0">
      {/* Navbar */}
      <nav className="w-screen bg-white shadow-md fixed top-0 left-0 z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">AlumniConnect</h1>
        <div className="space-x-6 text-gray-700">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Dashboard</a>
          <a href="#" className="hover:text-blue-600">Mentorship</a>
          <a href="#" className="hover:text-blue-600">Jobs</a>
          <a href="#" className="hover:text-blue-600">Events</a>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Login / Register</button>
      </nav>

      {/* Hero Section */}
      <section className="w-screen bg-blue-600 text-white text-center py-24 mt-0">
        <h2 className="text-4xl font-bold">Connect. Learn. Grow.</h2>
        <p className="mt-2 text-lg">An intelligent platform to interconnect Alumni & Students.</p>
        <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="w-screen bg-gray-100 py-12 flex flex-col md:flex-row justify-center gap-6 px-6">
        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Mentorship</h3>
          <p className="text-gray-600 mt-2">Get career advice from alumni.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Jobs & Internships</h3>
          <p className="text-gray-600 mt-2">Find opportunities shared by alumni.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Networking</h3>
          <p className="text-gray-600 mt-2">Connect with industry professionals.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-10 bg-gray-50 w-screen">
        <h2 className="text-3xl font-bold text-center text-blue-600">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-6">
          {[
            { name: "John Doe", feedback: "This platform helped me land my first job!" },
            { name: "Jane Smith", feedback: "Amazing mentorship opportunities from alumni." },
          ].map((review, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-md">
              <p className="text-gray-700">"{review.feedback}"</p>
              <h4 className="mt-2 font-semibold text-blue-600">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center bg-gray-900 text-white py-6 w-screen mb-0">
        <p>© 2025 AlumniConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
