import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";

const slides = [
  {
    image: heroBanner1,
    subtitle: "New Collection 2026",
    title: "Handwoven\nSilk Sarees",
    description: "Authentic silk sarees from the weaving town of Elampillai. Starting at just ₹999.",
    cta: "Shop Now",
    link: "/products",
  },
  {
    image: heroBanner2,
    subtitle: "Bridal Collection",
    title: "Elegance\nRedefined",
    description: "Curated bridal sarees crafted with care for your most precious moments.",
    cta: "Explore Bridal",
    link: "/products?collection=Bridal Heritage",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[85vh] lg:h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl"
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase mb-4 px-4 py-1.5 border border-white/30 text-white/80 font-body">
              {slides[current].subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-tight mb-6 text-white whitespace-pre-line">
              {slides[current].title}
            </h2>
            <p className="text-base lg:text-lg text-white/70 mb-8 max-w-md font-body leading-relaxed">
              {slides[current].description}
            </p>
            <Link
              to={slides[current].link}
              className="inline-block bg-white text-black px-8 py-3.5 text-sm tracking-[0.15em] uppercase font-body hover:bg-white/90 transition-all duration-300"
            >
              {slides[current].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/50 hover:text-white transition-colors" aria-label="Previous slide">
        <ChevronLeft size={28} />
      </button>
      <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/50 hover:text-white transition-colors" aria-label="Next slide">
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-white" : "w-4 bg-white/40"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
