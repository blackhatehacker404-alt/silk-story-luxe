import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { categories as initialCategories, collections as initialCollections } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategories() {
  const [categoryList, setCategoryList] = useState([...initialCategories]);
  const [collectionList, setCollectionList] = useState([...initialCollections]);
  const [newCategory, setNewCategory] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ index: number; value: string } | null>(null);
  const [editingCollection, setEditingCollection] = useState<{ index: number; value: string } | null>(null);
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [isColDialogOpen, setIsColDialogOpen] = useState(false);
  const { toast } = useToast();

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategoryList((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
    setIsCatDialogOpen(false);
    toast({ title: "Category added" });
  };

  const addCollection = () => {
    if (!newCollection.trim()) return;
    setCollectionList((prev) => [...prev, newCollection.trim()]);
    setNewCollection("");
    setIsColDialogOpen(false);
    toast({ title: "Collection added" });
  };

  const deleteCategory = (index: number) => {
    setCategoryList((prev) => prev.filter((_, i) => i !== index));
    toast({ title: "Category removed" });
  };

  const deleteCollection = (index: number) => {
    setCollectionList((prev) => prev.filter((_, i) => i !== index));
    toast({ title: "Collection removed" });
  };

  const saveEditCategory = () => {
    if (!editingCategory || !editingCategory.value.trim()) return;
    setCategoryList((prev) =>
      prev.map((c, i) => (i === editingCategory.index ? editingCategory.value.trim() : c))
    );
    setEditingCategory(null);
    toast({ title: "Category updated" });
  };

  const saveEditCollection = () => {
    if (!editingCollection || !editingCollection.value.trim()) return;
    setCollectionList((prev) =>
      prev.map((c, i) => (i === editingCollection.index ? editingCollection.value.trim() : c))
    );
    setEditingCollection(null);
    toast({ title: "Collection updated" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Categories & Collections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage product categories and collections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-heading">
              Categories ({categoryList.length})
            </CardTitle>
            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 h-8">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading">Add Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g., Pattu Silk"
                      onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    />
                  </div>
                  <Button onClick={addCategory} className="w-full">
                    Add Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {categoryList.map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-3"
                >
                  {editingCategory?.index === index ? (
                    <Input
                      value={editingCategory.value}
                      onChange={(e) =>
                        setEditingCategory({ index, value: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && saveEditCategory()}
                      onBlur={saveEditCategory}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm">{cat}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        setEditingCategory({ index, value: cat })
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteCategory(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collections */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-heading">
              Collections ({collectionList.length})
            </CardTitle>
            <Dialog open={isColDialogOpen} onOpenChange={setIsColDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 h-8">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading">Add Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Collection Name</Label>
                    <Input
                      value={newCollection}
                      onChange={(e) => setNewCollection(e.target.value)}
                      placeholder="e.g., Diwali Special"
                      onKeyDown={(e) => e.key === "Enter" && addCollection()}
                    />
                  </div>
                  <Button onClick={addCollection} className="w-full">
                    Add Collection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {collectionList.map((col, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-3"
                >
                  {editingCollection?.index === index ? (
                    <Input
                      value={editingCollection.value}
                      onChange={(e) =>
                        setEditingCollection({ index, value: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && saveEditCollection()}
                      onBlur={saveEditCollection}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm">{col}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        setEditingCollection({ index, value: col })
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteCollection(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
