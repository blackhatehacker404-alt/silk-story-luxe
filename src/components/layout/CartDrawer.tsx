import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-accent" />
                <h2 className="text-lg font-heading font-semibold">Shopping Bag</h2>
                <span className="text-sm text-muted-foreground font-body">({totalItems})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:text-accent transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground font-body">Your bag is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-sm text-accent underline underline-offset-4 font-body"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 pb-6 border-b border-border last:border-0">
                      {/* Product image placeholder */}
                      <div className="w-20 h-24 bg-card rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-2xl">🥻</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-heading font-semibold truncate">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-body">{item.product.collection}</p>
                        <p className="text-sm font-semibold text-accent mt-2 font-body">{formatPrice(item.product.price)}</p>

                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-accent transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-body w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-accent transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors font-body"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground font-body">Subtotal</span>
                  <span className="text-lg font-heading font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 font-body">Shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-primary text-primary-foreground text-center py-3 text-sm tracking-[0.15em] uppercase font-body hover:bg-burgundy-light transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
