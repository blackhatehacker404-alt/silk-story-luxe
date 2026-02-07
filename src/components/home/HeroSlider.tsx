import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";

const slides = [
  {
    image: heroBanner1,
    subtitle: "New Collection 2025",
    title: "Heritage Woven\nin Every Thread",
    description: "Discover our finest Kanchipuram silk sarees, handcrafted with generations of artistry",
    cta: "Explore Collection",
    link: "/products",
  },
  {
    image: heroBanner2,
    subtitle: "Bridal Season",
    title: "Where Tradition\nMeets Elegance",
    description: "Curated bridal sarees for the most precious moment of your life",
    cta: "Shop Bridal",
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

  const goTo = (index: number) => setCurrent(index);
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[85vh] lg:h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-xs tracking-[0.4em] uppercase mb-4 px-4 py-1.5 border border-gold-light/40 text-gold-light font-body">
              {slides[current].subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6 text-cream whitespace-pre-line">
              {slides[current].title}
            </h2>
            <p className="text-base lg:text-lg text-cream/80 mb-8 max-w-lg font-body leading-relaxed">
              {slides[current].description}
            </p>
            <Link
              to={slides[current].link}
              className="inline-block bg-gold-gradient text-accent-foreground px-8 py-3.5 text-sm tracking-[0.2em] uppercase font-body hover:shadow-gold transition-all duration-300"
            >
              {slides[current].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-cream/60 hover:text-cream transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-cream/60 hover:text-cream transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-gold" : "w-4 bg-cream/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
