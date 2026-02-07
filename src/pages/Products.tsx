import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories, collections } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [selectedCollection, setSelectedCollection] = useState<string>(
    searchParams.get("collection") || ""
  );
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (selectedCollection) {
      filtered = filtered.filter((p) => p.collection === selectedCollection);
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
  }, [selectedCategory, selectedCollection, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCollection("");
    setSortBy("newest");
  };

  const hasActiveFilters = selectedCategory || selectedCollection;

  return (
    <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-3">
            {selectedCollection || "All Sarees"}
          </h1>
          <p className="text-muted-foreground font-body">
            {filteredProducts.length} exquisite pieces
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm tracking-[0.1em] uppercase font-body text-foreground hover:text-accent transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-accent" />
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-body bg-transparent text-foreground border-0 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm tracking-[0.15em] uppercase font-body font-semibold">Refine By</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-accent hover:text-burgundy font-body"
                >
                  <X size={14} /> Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category filter */}
              <div>
                <h4 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3 font-body">
                  Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setSelectedCategory(selectedCategory === cat ? "" : cat)
                      }
                      className={`px-3 py-1.5 text-xs font-body border transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-foreground hover:border-accent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collection filter */}
              <div>
                <h4 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3 font-body">
                  Collection
                </h4>
                <div className="flex flex-wrap gap-2">
                  {collections.map((col) => (
                    <button
                      key={col}
                      onClick={() =>
                        setSelectedCollection(
                          selectedCollection === col ? "" : col
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-body border transition-colors ${
                        selectedCollection === col
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-foreground hover:border-accent"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">
              No sarees match your selection.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-accent underline underline-offset-4 font-body"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductsPage;
