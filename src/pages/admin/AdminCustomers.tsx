import { useState } from "react";
import { Search, Eye, Phone, Plus, Edit2, Trash2, UserPlus, Download, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { useAdminOrders } from "@/hooks/useOrders";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  notes: string | null;
  tags: string[] | null;
  source: string;
  created_at: string;
  updated_at: string;
}

const PRESET_TAGS = ["VIP", "Wholesale", "Retail", "Regular", "New", "Bridal", "Corporate"];

const TAG_COLORS: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-800 border-amber-200",
  Wholesale: "bg-blue-100 text-blue-800 border-blue-200",
  Retail: "bg-green-100 text-green-800 border-green-200",
  Regular: "bg-muted text-muted-foreground border-border",
  New: "bg-purple-100 text-purple-800 border-purple-200",
  Bridal: "bg-pink-100 text-pink-800 border-pink-200",
  Corporate: "bg-slate-100 text-slate-800 border-slate-200",
};

const emptyCustomer = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
  tags: [] as string[],
};

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyCustomer);
  const [customTag, setCustomTag] = useState("");
  const queryClient = useQueryClient();

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Customer[];
    },
  });

  const { data: orders = [] } = useAdminOrders();

  const upsertCustomer = useMutation({
    mutationFn: async (values: typeof emptyCustomer & { id?: string }) => {
      if (values.id) {
        const { error } = await supabase.from("customers").update(values).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert({ ...values, source: "manual" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success(editingCustomer ? "Customer updated" : "Customer added");
      closeForm();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Customer deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setForm(emptyCustomer);
    setCustomTag("");
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({
      full_name: c.full_name,
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
      city: c.city || "",
      state: c.state || "",
      pincode: c.pincode || "",
      notes: c.notes || "",
      tags: c.tags || [],
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.full_name.trim()) {
      toast.error("Name is required");
      return;
    }
    upsertCustomer.mutate(editingCustomer ? { ...form, id: editingCustomer.id } : form);
  };

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
      setCustomTag("");
    }
  };

  const exportCSV = () => {
    const allCustomers = [
      ...profiles.map((p) => ({
        Name: p.full_name || "Unknown",
        Email: "",
        Phone: p.phone || "",
        Address: "",
        City: "",
        State: "",
        Pincode: "",
        Tags: "",
        Notes: "",
        Source: "Registered",
        Orders: getCustomerOrders(p.user_id).length,
        "Total Spent": getCustomerSpent(p.user_id),
        "Joined": formatDate(p.created_at),
      })),
      ...customers.map((c) => ({
        Name: c.full_name,
        Email: c.email || "",
        Phone: c.phone || "",
        Address: c.address || "",
        City: c.city || "",
        State: c.state || "",
        Pincode: c.pincode || "",
        Tags: (c.tags || []).join("; "),
        Notes: c.notes || "",
        Source: "Manual",
        Orders: "",
        "Total Spent": "",
        "Joined": formatDate(c.created_at),
      })),
    ];

    if (allCustomers.length === 0) {
      toast.error("No customers to export");
      return;
    }

    const headers = Object.keys(allCustomers[0]);
    const csvRows = [
      headers.join(","),
      ...allCustomers.map((row) =>
        headers.map((h) => `"${String((row as any)[h]).replace(/"/g, '""')}"`).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (p.full_name || "").toLowerCase().includes(q) || (p.phone || "").includes(q);
  });

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(q) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const getCustomerOrders = (userId: string) => orders.filter((o) => o.user_id === userId);
  const getCustomerSpent = (userId: string) => getCustomerOrders(userId).reduce((s, o) => s + o.total_amount, 0);
  const selectedProfile = profiles.find((p) => p.user_id === selectedProfileId);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const getTagClass = (tag: string) => TAG_COLORS[tag] || "bg-secondary text-secondary-foreground border-border";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profiles.length} registered · {customers.length} manual
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            onClick={() => { setEditingCustomer(null); setForm(emptyCustomer); setShowForm(true); }}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, phone or tag..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="registered">
        <TabsList>
          <TabsTrigger value="registered">Registered ({filteredProfiles.length})</TabsTrigger>
          <TabsTrigger value="manual">Manual ({filteredCustomers.length})</TabsTrigger>
        </TabsList>

        {/* Registered Users Tab */}
        <TabsContent value="registered">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => {
                    const orderCount = getCustomerOrders(profile.user_id).length;
                    const totalSpent = getCustomerSpent(profile.user_id);
                    return (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">
                                {(profile.full_name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{profile.full_name || "Unknown"}</p>
                              <Badge variant="secondary" className="text-[10px]">Registered</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{profile.phone || "—"}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(profile.created_at)}</TableCell>
                        <TableCell className="text-sm">{orderCount}</TableCell>
                        <TableCell className="text-sm font-medium">{formatPrice(totalSpent)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedProfileId(profile.user_id)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredProfiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No registered customers found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Customers Tab */}
        <TabsContent value="manual">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Tags</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">City</TableHead>
                    <TableHead className="hidden lg:table-cell">Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-accent/50 flex items-center justify-center">
                            <span className="text-xs font-bold text-accent-foreground">
                              {c.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{c.full_name}</p>
                            {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(c.tags || []).map((tag) => (
                            <span key={tag} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${getTagClass(tag)}`}>
                              {tag}
                            </span>
                          ))}
                          {(!c.tags || c.tags.length === 0) && <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{c.phone || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{c.city || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCustomer.mutate(c.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No manual customers yet. Click "Add Customer" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Profile Detail Dialog */}
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfileId(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">Customer Details</DialogTitle></DialogHeader>
          {selectedProfile && (() => {
            const custOrders = getCustomerOrders(selectedProfile.user_id);
            const spent = getCustomerSpent(selectedProfile.user_id);
            return (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {(selectedProfile.full_name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-lg">{selectedProfile.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">Since {formatDate(selectedProfile.created_at)}</p>
                  </div>
                </div>
                {selectedProfile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProfile.phone}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <p className="text-lg font-heading font-bold">{custOrders.length}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <p className="text-lg font-heading font-bold">{formatPrice(spent)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Order History</h4>
                  <div className="divide-y divide-border rounded-md border border-border">
                    {custOrders.length > 0 ? custOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center px-3 py-2.5">
                        <div>
                          <p className="text-sm font-medium">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatPrice(order.total_amount)}</p>
                          <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">No orders yet</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingCustomer ? "Edit Customer" : "Add Customer"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Customer name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                      form.tags.includes(tag)
                        ? getTagClass(tag) + " ring-2 ring-primary/30"
                        : "bg-background text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {tag}
                    {form.tags.includes(tag) && <X className="ml-1 h-3 w-3" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Custom tag..."
                  className="h-8 text-xs"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                />
                <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={addCustomTag}>Add</Button>
              </div>
              {form.tags.filter((t) => !PRESET_TAGS.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {form.tags.filter((t) => !PRESET_TAGS.includes(t)).map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {tag}
                      <button type="button" onClick={() => toggleTag(tag)} className="ml-1"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this customer..." rows={3} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={upsertCustomer.isPending} className="gap-2">
                <Plus className="h-4 w-4" />
                {upsertCustomer.isPending ? "Saving..." : editingCustomer ? "Update" : "Add Customer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
