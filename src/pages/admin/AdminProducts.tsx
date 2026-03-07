import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products as initialProducts, categories, collections, formatPrice, Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminProducts() {
  const [productList, setProductList] = useState<(Product & { visible?: boolean })[]>(
    initialProducts.map((p) => ({ ...p, visible: true }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "", tamilName: "", price: "", originalPrice: "",
    category: "", collection: "", description: "", fabric: "",
    borderDescription: "", palluDescription: "",
  });

  const filtered = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", tamilName: "", price: "", originalPrice: "", category: "", collection: "", description: "", fabric: "", borderDescription: "", palluDescription: "" });
    setEditingProduct(null);
    setUploadedImages([]);
  };

  const openAddDialog = () => { resetForm(); setIsDialogOpen(true); };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, tamilName: product.tamilName || "", price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "", category: product.category,
      collection: product.collection, description: product.description, fabric: product.fabric,
      borderDescription: product.borderDescription, palluDescription: product.palluDescription,
    });
    setUploadedImages(product.images || []);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast({ title: "Missing fields", description: "Please fill in name, price and category.", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      setProductList((prev) => prev.map((p) =>
        p.id === editingProduct.id ? {
          ...p, name: formData.name, tamilName: formData.tamilName || undefined,
          price: Number(formData.price), originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          category: formData.category, collection: formData.collection, description: formData.description,
          fabric: formData.fabric, borderDescription: formData.borderDescription, palluDescription: formData.palluDescription,
          images: uploadedImages,
        } : p
      ));
      toast({ title: "Product updated successfully" });
    } else {
      const newProduct: Product & { visible: boolean } = {
        id: `sg-${Date.now()}`, name: formData.name, tamilName: formData.tamilName || undefined,
        price: Number(formData.price), originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category, collection: formData.collection, description: formData.description,
        fabric: formData.fabric, borderDescription: formData.borderDescription, palluDescription: formData.palluDescription,
        images: uploadedImages, visible: true,
      };
      setProductList((prev) => [newProduct, ...prev]);
      toast({ title: "Product added successfully" });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const toggleVisibility = (id: string) => {
    setProductList((prev) => prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));
  };

  const deleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Product removed" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your collection ({productList.length} products)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2"><Plus className="h-4 w-4" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="Royal Burgundy Bridal Silk" />
                </div>
                <div className="space-y-2">
                  <Label>Tamil Name</Label>
                  <Input value={formData.tamilName} onChange={(e) => setFormData((p) => ({ ...p, tamilName: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹) *</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Original Price (₹)</Label>
                  <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData((p) => ({ ...p, originalPrice: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData((p) => ({ ...p, category: val }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Collection</Label>
                  <Select value={formData.collection} onValueChange={(val) => setFormData((p) => ({ ...p, collection: val }))}>
                    <SelectTrigger><SelectValue placeholder="Select collection" /></SelectTrigger>
                    <SelectContent>{collections.map((col) => (<SelectItem key={col} value={col}>{col}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <ImageUpload images={uploadedImages} onImagesChange={setUploadedImages} folder="products" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Fabric</Label>
                <Input value={formData.fabric} onChange={(e) => setFormData((p) => ({ ...p, fabric: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Border Description</Label>
                  <Input value={formData.borderDescription} onChange={(e) => setFormData((p) => ({ ...p, borderDescription: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Pallu Description</Label>
                  <Input value={formData.palluDescription} onChange={(e) => setFormData((p) => ({ ...p, palluDescription: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleSave}>{editingProduct ? "Update Product" : "Add Product"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, category or collection..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Collection</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{product.category}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{product.collection}</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                      {product.originalPrice && (<span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.originalPrice)}</span>)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={product.visible !== false ? "default" : "secondary"} className="text-[10px]">{product.visible !== false ? "Visible" : "Hidden"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleVisibility(product.id)}>{product.visible !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProduct(product.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
