import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import collectionBridal from "@/assets/collection-bridal.jpg";
import collectionFestival from "@/assets/collection-festival.jpg";
import collectionContemporary from "@/assets/collection-contemporary.jpg";

const collections = [
  {
    title: "Bridal Heritage",
    subtitle: "For the Most Precious Day",
    image: collectionBridal,
    link: "/products?collection=Bridal Heritage",
  },
  {
    title: "Festival Special",
    subtitle: "Celebrate in Splendour",
    image: collectionFestival,
    link: "/products?collection=Festival Special",
  },
  {
    title: "Contemporary Elegance",
    subtitle: "Modern Meets Tradition",
    image: collectionContemporary,
    link: "/products?collection=Contemporary Elegance",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-body mb-4 block">
            Curated For You
          </span>
          <h2 className="text-3xl lg:text-5xl font-heading font-bold">
            Our Collections
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link
                to={col.link}
                className="group block relative overflow-hidden aspect-[3/4]"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="text-xs tracking-[0.3em] uppercase text-gold-light mb-2 font-body">
                    {col.subtitle}
                  </p>
                  <h3 className="text-xl lg:text-2xl font-heading font-bold text-cream mb-3">
                    {col.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-cream/80 group-hover:text-gold transition-colors font-body">
                    Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
