import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminCoupons, useCreateCoupon, useToggleCoupon, useDeleteCoupon } from "@/hooks/useCoupons";
import { useToast } from "@/hooks/use-toast";

export default function AdminCoupons() {
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const toggleCoupon = useToggleCoupon();
  const deleteCoupon = useDeleteCoupon();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_uses: "",
    expires_at: "",
  });

  const handleCreate = () => {
    if (!form.code || !form.discount_value) {
      toast({ title: "Please fill code and discount value", variant: "destructive" });
      return;
    }
    createCoupon.mutate(
      {
        code: form.code,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      },
      {
        onSuccess: () => {
          toast({ title: "Coupon created!" });
          setOpen(false);
          setForm({ code: "", discount_type: "percentage", discount_value: "", min_order_amount: "", max_uses: "", expires_at: "" });
        },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      }
    );
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage discount codes ({coupons.length} total)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Create Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">New Coupon</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Coupon Code *</Label>
                <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="FLAT20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={form.discount_type} onValueChange={(v) => setForm((p) => ({ ...p, discount_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value *</Label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))} placeholder="20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Order (₹)</Label>
                  <Input type="number" value={form.min_order_amount} onChange={(e) => setForm((p) => ({ ...p, min_order_amount: e.target.value }))} placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input type="number" value={form.max_uses} onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))} placeholder="Unlimited" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={createCoupon.isPending}>{createCoupon.isPending ? "Creating..." : "Create Coupon"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="hidden md:table-cell">Min Order</TableHead>
                <TableHead className="hidden md:table-cell">Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-medium text-sm">{c.code}</TableCell>
                  <TableCell className="text-sm">
                    {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {c.min_order_amount ? `₹${c.min_order_amount}` : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {c.used_count}{c.max_uses ? `/${c.max_uses}` : ""}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? "default" : "secondary"} className="text-[10px]">
                      {c.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleCoupon.mutate({ id: c.id, is_active: !c.is_active })}>
                      {c.is_active ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCoupon.mutate(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {coupons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Ticket className="mx-auto h-8 w-8 mb-2 opacity-30" />
                    No coupons created yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
