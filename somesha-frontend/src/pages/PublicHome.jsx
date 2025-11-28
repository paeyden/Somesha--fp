import React from "react";
import HeroSlideshow from "@/components/HeroSlideshow";
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const PublicHome = () => {
  const features = [
    {
      icon: <AcademicCapIcon className="h-14 w-14 text-blue-600 mx-auto mb-4 md:mb-6" aria-hidden="true" />,
      title: "For Children",
      text: "Access assigned lessons, track progress, and earn badges while learning in a fun way.",
      color: "hover:shadow-blue-200",
    },
    {
      icon: <UserGroupIcon className="h-14 w-14 text-green-600 mx-auto mb-4 md:mb-6" aria-hidden="true" />,
      title: "For Parents",
      text: "Monitor your child’s progress, book tutors, and stay engaged in their learning journey.",
      color: "hover:shadow-green-200",
    },
    {
      icon: <BookOpenIcon className="h-14 w-14 text-purple-600 mx-auto mb-4 md:mb-6" aria-hidden="true" />,
      title: "For Tutors",
      text: "Create lessons, assign resources, and track student performance with ease.",
      color: "hover:shadow-purple-200",
    },
  ];

  const steps = [
    { step: "Step 1: Register", desc: "Create an account as a child, parent, or tutor." },
    { step: "Step 2: Connect", desc: "Parents link children, tutors get verified, and lessons are assigned." },
    { step: "Step 3: Learn & Track", desc: "Children learn, tutors teach, and parents track progress in real time." },
  ];

  const testimonials = [
    {
      quote: "Somesha has made it so easy to follow my child’s progress. I feel more connected to their learning journey.",
      author: "— A Parent",
    },
    {
      quote: "I can assign lessons and track how students are doing instantly. It saves me so much time.",
      author: "— A Tutor",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlideshow />

      {/* Features Section */}
      <main className="flex-grow p-6 md:p-12 bg-gray-50">
        <h2
          id="features-heading"
          className="text-4xl font-semibold text-center mb-12 md:mb-16 text-gray-800"
        >
          Why <span className="text-indigo-600">Somesha?</span>
        </h2>

        <section
          aria-labelledby="features-heading"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              role="region"
              aria-label={feature.title}
              tabIndex={0} // keyboard focusable
              className={`bg-white p-6 md:p-10 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.color} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {feature.icon}
              <h3 className="text-2xl font-semibold mb-2 md:mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </div>
          ))}
        </section>

        {/* How It Works Section */}
        <section className="mt-16 md:mt-20" aria-labelledby="how-it-works-heading">
          <h2
            id="how-it-works-heading"
            className="text-4xl font-semibold text-center mb-8 md:mb-12 text-gray-800"
          >
            How It <span className="text-indigo-600">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center">
            {steps.map((item, idx) => (
              <div
                key={idx}
                role="region"
                aria-label={item.step}
                tabIndex={0}
                className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <h3 className="text-xl font-bold mb-2 md:mb-3 text-indigo-700">{item.step}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-16 md:mt-20" aria-labelledby="testimonials-heading">
          <h2
            id="testimonials-heading"
            className="text-4xl font-semibold text-center mb-8 md:mb-12 text-gray-800"
          >
            What People <span className="text-indigo-600">Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {testimonials.map((testimonial, idx) => (
              <blockquote
                key={idx}
                role="region"
                aria-label={`Testimonial by ${testimonial.author}`}
                tabIndex={0}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <p className="italic text-gray-700">"{testimonial.quote}"</p>
                <footer className="mt-4 font-semibold text-indigo-700">{testimonial.author}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-12">
        <p className="text-sm">&copy; {new Date().getFullYear()} Somesha. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicHome;
