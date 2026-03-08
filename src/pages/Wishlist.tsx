import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

const Wishlist = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { wishlistIds } = useWishlist();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (loading) return <div className="min-h-screen pt-32 flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-background pt-28 lg:pt-32 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-3 flex items-center justify-center gap-3">
            <Heart className="text-accent" size={32} /> My Wishlist
          </h1>
          <p className="text-muted-foreground font-body">{wishlistProducts.length} saved items</p>
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-body mb-4">Your wishlist is empty.</p>
            <Link to="/products" className="text-sm text-accent underline underline-offset-4 font-body">
              Browse Sarees
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {wishlistProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
