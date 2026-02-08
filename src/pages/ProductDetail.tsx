import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Share2, ChevronLeft, Heart } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { getProductImage } from "@/data/product-images";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="text-accent underline underline-offset-4 font-body">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Sri Ganapathy Silks`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out ${product.name} at Sri Ganapathy Silks - ${formatPrice(product.price)}\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm font-body">
          <Link to="/products" className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors">
            <ChevronLeft size={16} />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[3/4] bg-card overflow-hidden group cursor-zoom-in">
              <img
                src={getProductImage(product.id)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              <div className="w-20 h-24 bg-card overflow-hidden cursor-pointer border-2 border-accent">
                <img src={getProductImage(product.id)} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-body">
                {product.collection}
              </span>
              <button className="p-2 text-muted-foreground hover:text-accent transition-colors" aria-label="Add to wishlist">
                <Heart size={20} />
              </button>
            </div>

            <h1 className="text-2xl lg:text-4xl font-heading font-bold mb-1">
              {product.name}
            </h1>

            {product.tamilName && (
              <p className="text-sm text-muted-foreground font-accent italic mb-4">
                {product.tamilName}
              </p>
            )}

            <p className="text-xs text-muted-foreground font-body mb-6">
              {product.category}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-2xl lg:text-3xl font-heading font-bold text-accent">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-muted-foreground line-through font-body">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed font-body mb-8">
              {product.description}
            </p>

            {/* Details */}
            <div className="space-y-4 mb-8 p-6 bg-card border border-border">
              <div>
                <h4 className="text-xs tracking-[0.15em] uppercase text-accent mb-1 font-body">Fabric</h4>
                <p className="text-sm font-body">{product.fabric}</p>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-xs tracking-[0.15em] uppercase text-accent mb-1 font-body">Border</h4>
                <p className="text-sm font-body">{product.borderDescription}</p>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="text-xs tracking-[0.15em] uppercase text-accent mb-1 font-body">Pallu</h4>
                <p className="text-sm font-body">{product.palluDescription}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  addToCart(product);
                  toast.success("Added to your bag");
                }}
                className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase font-body hover:bg-burgundy-light transition-colors flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  toast.success("Proceeding to checkout");
                }}
                className="w-full py-4 bg-gold-gradient text-accent-foreground text-sm tracking-[0.2em] uppercase font-body hover:shadow-gold transition-all flex items-center justify-center gap-3"
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body">Share</span>
              <button
                onClick={handleWhatsAppShare}
                className="text-sm text-muted-foreground hover:text-accent transition-colors font-body"
              >
                WhatsApp
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors font-body"
              >
                <Share2 size={14} /> Copy Link
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
