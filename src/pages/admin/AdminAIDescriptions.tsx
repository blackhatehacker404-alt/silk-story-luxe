import { useState } from "react";
import { useAdminAI } from "@/hooks/useAdminAI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, RefreshCw, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

export default function AdminAIDescriptions() {
  const { loading, result, callAI } = useAdminAI();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("premium & elegant");

  const handleGenerate = () => {
    if (!productName.trim()) {
      toast({ title: "Enter product name", variant: "destructive" });
      return;
    }
    callAI("generate-description", { productName, category, keywords, tone });
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({ title: "Copied to clipboard!" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          AI Product Description Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate compelling, SEO-optimized product descriptions instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
            <CardDescription>Enter product info to generate descriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Kanchipuram Silk Saree" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarees">Sarees</SelectItem>
                  <SelectItem value="Lehengas">Lehengas</SelectItem>
                  <SelectItem value="Kurtas">Kurtas</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Keywords</Label>
              <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. silk, wedding, traditional, zari work" />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium & elegant">Premium & Elegant</SelectItem>
                  <SelectItem value="casual & friendly">Casual & Friendly</SelectItem>
                  <SelectItem value="luxurious & exclusive">Luxurious & Exclusive</SelectItem>
                  <SelectItem value="trendy & modern">Trendy & Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
              {loading ? "Generating..." : "Generate Description"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Generated Content</CardTitle>
              <CardDescription>AI-generated product copy</CardDescription>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={copyResult}>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Wand2 className="h-12 w-12 opacity-20 mb-4" />
                <p>Fill in the product details and click generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
