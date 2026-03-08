import HeroSlider from "@/components/home/HeroSlider";
import BrandStory from "@/components/home/BrandStory";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <main>
      <HeroSlider />

      {/* Products Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-14"
          >
            <div>
              <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body mb-3 block">
                Our Collection
              </span>
              <h2 className="text-3xl lg:text-5xl font-heading">
                Shop Sarees
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm tracking-[0.1em] uppercase text-foreground hover:text-muted-foreground transition-colors font-body"
            >
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <Link
            to="/products"
            className="sm:hidden flex items-center justify-center gap-2 mt-10 text-sm tracking-[0.1em] uppercase text-foreground font-body"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <BrandStory />
    </main>
  );
};

export default Index;
