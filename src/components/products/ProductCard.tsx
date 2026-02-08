import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { getProductImage } from "@/data/product-images";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-card mb-4">
          <img
            src={getProductImage(product.id)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-accent text-accent-foreground text-[10px] tracking-[0.2em] uppercase font-body">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-body">
                Best Seller
              </span>
            )}
          </div>

          {/* Quick add */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="absolute bottom-3 right-3 p-3 bg-background/90 backdrop-blur-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </motion.button>
        </div>
      </Link>

      <div className="space-y-1.5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-heading font-semibold group-hover:text-accent transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground font-body">{product.collection}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-semibold text-accent">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through font-body">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
