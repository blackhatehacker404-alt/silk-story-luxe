import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { products, menswearCategories } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import collectionMenswear from "@/assets/collection-menswear.jpg";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

const MenswearPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const menswearProducts = useMemo(() => {
    let filtered = products.filter((p) => p.gender === "men");

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSortBy("newest");
  };

  return (
    <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 lg:h-80 mb-12 overflow-hidden">
        <img
          src={collectionMenswear}
          alt="Menswear Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <span className="text-xs tracking-[0.4em] uppercase text-accent font-body mb-2 block">
            Premium Collection
          </span>
          <h1 className="text-3xl lg:text-5xl font-heading font-bold text-foreground">
            Men's Wear
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            Traditional Shirts, Veshtis & Combos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm tracking-[0.1em] uppercase font-body text-foreground hover:text-accent transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {selectedCategory && <span className="w-2 h-2 rounded-full bg-accent" />}
          </button>
          <p className="text-sm text-muted-foreground font-body">
            {menswearProducts.length} products
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-body bg-transparent text-foreground border-0 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-6 bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm tracking-[0.15em] uppercase font-body font-semibold">Category</h3>
              {selectedCategory && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-accent hover:text-foreground font-body">
                  <X size={14} /> Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {menswearCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`px-4 py-2 text-xs font-body border transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:border-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {menswearProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {menswearProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">No products match your selection.</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-accent underline underline-offset-4 font-body">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MenswearPage;
