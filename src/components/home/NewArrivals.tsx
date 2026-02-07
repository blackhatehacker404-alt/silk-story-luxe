import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

const NewArrivals = () => {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
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
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-body mb-4 block">
              Just Arrived
            </span>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-accent hover:text-burgundy transition-colors font-body"
          >
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <Link
          to="/products"
          className="sm:hidden flex items-center justify-center gap-2 mt-10 text-sm tracking-[0.15em] uppercase text-accent font-body"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
