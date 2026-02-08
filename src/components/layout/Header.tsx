import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "Our Story" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs tracking-[0.2em] uppercase font-body">
        Complimentary Shipping on Orders Above ₹25,000
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <h1 className="text-xl lg:text-2xl font-heading font-bold tracking-wide text-primary">
              Sri Ganapathy
            </h1>
            <span className="text-[10px] lg:text-xs tracking-[0.3em] uppercase text-muted-foreground font-body">
              Silks
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-[0.15em] uppercase font-body transition-colors duration-300 hover:text-accent ${
                  location.pathname === link.to
                    ? "text-accent"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-foreground hover:text-accent transition-colors hidden sm:block" aria-label="Search">
              <Search size={20} />
            </button>

            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="p-2 text-accent hover:text-accent/80 transition-colors hidden sm:block"
                aria-label="Admin Panel"
                title="Admin Panel"
              >
                <Shield size={20} />
              </Link>
            )}

            {/* Admin Login Link (visible to all) */}
            {!isAdmin && (
              <Link
                to="/admin-login"
                className="p-2 text-muted-foreground hover:text-accent transition-colors hidden sm:block"
                aria-label="Admin Login"
                title="Admin Login"
              >
                <Shield size={18} />
              </Link>
            )}

            {/* Account / Auth */}
            <Link
              to={user ? "/account" : "/auth"}
              className="p-2 text-foreground hover:text-accent transition-colors hidden sm:block"
              aria-label={user ? "Account" : "Sign In"}
            >
              <User size={20} />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-foreground hover:text-accent transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm tracking-[0.15em] uppercase font-body py-2 transition-colors ${
                    location.pathname === link.to
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={user ? "/account" : "/auth"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm tracking-[0.15em] uppercase font-body py-2 text-foreground hover:text-accent transition-colors"
              >
                {user ? "My Account" : "Sign In"}
              </Link>
              <Link
                to="/admin-login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm tracking-[0.15em] uppercase font-body py-2 text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
              >
                <Shield size={14} /> Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
