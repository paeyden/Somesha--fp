import React from "react";
import HeroSlideshow from "@/components/HeroSlideshow";
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const PublicHome = () => {
  return (
    <div >
      {/* Hero Section */}
      <HeroSlideshow />

      {/* Features Section */}
      <main className="flex-grow p-12 bg-gray-50">
        <h2 className="text-4xl font-semibold text-center mb-16 text-gray-800">
          Why <span className="text-indigo-600">Somesha?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <AcademicCapIcon className="h-14 w-14 text-blue-600 mx-auto mb-6" />,
              title: "📚 For Children",
              text: "Access assigned lessons, track progress, and earn badges while learning in a fun way.",
              color: "hover:shadow-blue-200",
            },
            {
              icon: <UserGroupIcon className="h-14 w-14 text-green-600 mx-auto mb-6" />,
              title: "👨‍👩‍👧 For Parents",
              text: "Monitor your child’s progress, book tutors, and stay engaged in their learning journey.",
              color: "hover:shadow-green-200",
            },
            {
              icon: <BookOpenIcon className="h-14 w-14 text-purple-600 mx-auto mb-6" />,
              title: "🎓 For Tutors",
              text: "Create lessons, assign resources, and track student performance with ease.",
              color: "hover:shadow-purple-200",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`bg-white p-10 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.color}`}
            >
              {feature.icon}
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <section className="mt-20">
          <h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">
            How It <span className="text-indigo-600">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { step: "Step 1: Register", desc: "Create an account as a child, parent, or tutor." },
              { step: "Step 2: Connect", desc: "Parents link children, tutors get verified, and lessons are assigned." },
              { step: "Step 3: Learn & Track", desc: "Children learn, tutors teach, and parents track progress in real time." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-indigo-700">{item.step}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-20">
          <h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">
            What People <span className="text-indigo-600">Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                quote: "Somesha has made it so easy to follow my child’s progress. I feel more connected to their learning journey.",
                author: "— A Parent",
              },
              {
                quote: "I can assign lessons and track how students are doing instantly. It saves me so much time.",
                author: "— A Tutor",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
              >
                <p className="italic text-gray-700">"{testimonial.quote}"</p>
                <p className="mt-4 font-semibold text-indigo-700">{testimonial.author}</p>
              </div>
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