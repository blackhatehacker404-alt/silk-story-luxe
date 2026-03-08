import { useAdminAI } from "@/hooks/useAdminAI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, RefreshCw } from "lucide-react";
import { products } from "@/data/products";
import ReactMarkdown from "react-markdown";

export default function AdminAIInventory() {
  const { loading, result, callAI } = useAdminAI();

  const handleAnalyze = () => {
    const productData = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock ?? Math.floor(Math.random() * 50),
      isNew: p.isNew,
      isBestseller: p.isBestseller,
    }));
    callAI("inventory-alerts", { products: productData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <PackageSearch className="h-6 w-6 text-primary" />
            AI Smart Inventory
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Predictive stock analysis, reorder suggestions & seasonal recommendations
          </p>
        </div>
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <PackageSearch className="h-4 w-4 mr-2" />}
          {loading ? "Analyzing..." : "Analyze Inventory"}
        </Button>
      </div>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Analysis</CardTitle>
            <CardDescription>AI-powered inventory recommendations for {products.length} products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ) : !loading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <PackageSearch className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-medium text-lg">No analysis yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Click "Analyze Inventory" to get AI-powered stock recommendations</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">AI is analyzing your inventory...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
