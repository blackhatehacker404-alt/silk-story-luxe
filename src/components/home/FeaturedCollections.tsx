import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Share2 } from "lucide-react";
import { toast } from "sonner";
import collectionBridal from "@/assets/collection-bridal.jpg";
import collectionFestival from "@/assets/collection-festival.jpg";
import collectionContemporary from "@/assets/collection-contemporary.jpg";
import collectionMenswear from "@/assets/collection-menswear.jpg";

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
  {
    title: "Men's Wear",
    subtitle: "Traditional Elegance for Him",
    image: collectionMenswear,
    link: "/menswear",
  },
];

const handleShare = (e: React.MouseEvent, title: string, link: string) => {
  e.preventDefault();
  e.stopPropagation();
  const url = `${window.location.origin}${link}`;
  if (navigator.share) {
    navigator.share({ title, url });
  } else {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  }
};

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

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
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
                className="group block relative overflow-hidden aspect-[3/4] rounded-sm"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Share button */}
                <button
                  onClick={(e) => handleShare(e, col.title, col.link)}
                  className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full transition-all hover:scale-110 z-10"
                  aria-label={`Share ${col.title}`}
                >
                  <Share2 size={14} className="text-foreground" />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2 font-body">
                    {col.subtitle}
                  </p>
                  <h3 className="text-xl lg:text-2xl font-heading font-bold text-background mb-3">
                    {col.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-background/80 group-hover:text-accent transition-colors font-body">
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
