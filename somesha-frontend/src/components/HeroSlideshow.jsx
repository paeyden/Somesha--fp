import React, { useEffect, useState } from "react";
import { ReactTyped } from "react-typed";
import { useNavigate } from "react-router-dom";

const images = ["/learn.jpg", "/learn2.jpg", "/learn3.jpg", "/learn4.jpg", "/learn5.jpg"];

const HeroSlideshow = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  // Preload images
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto rotation
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  // Keyboard control
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const goTo = (i) => setIndex(i);

  return (
    <section
      className="relative h-[320px] md:h-[520px] w-full overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${images[index]})`,
        }}
      />

      {/* Strong Overlay (cannot be overridden) */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 text-white">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-xl">
          <ReactTyped
            strings={[
              "Welcome to Somesha",
              "Learn. Connect. Grow.",
              "Empowering Parents, Tutors & Students",
            ]}
            typeSpeed={50}
            backSpeed={30}
            loop
          />
        </h1>

        <p className="text-lg md:text-xl mt-4 mb-6 font-light drop-shadow-lg">
          Your education journey starts here.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition font-medium shadow-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium shadow-lg"
          >
            Login
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-30 opacity-80 hover:opacity-100"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-30 opacity-80 hover:opacity-100"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
