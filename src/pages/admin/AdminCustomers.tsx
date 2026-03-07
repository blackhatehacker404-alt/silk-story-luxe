import { useState } from "react";
import { Search, Eye, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { useAdminOrders } from "@/hooks/useOrders";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  const { data: orders = [] } = useAdminOrders();

  const filtered = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.full_name || "").toLowerCase().includes(q) ||
      (p.phone || "").includes(q) ||
      p.user_id.includes(q)
    );
  });

  const getCustomerOrders = (userId: string) => orders.filter((o) => o.user_id === userId);
  const getCustomerSpent = (userId: string) => getCustomerOrders(userId).reduce((s, o) => s + o.total_amount, 0);

  const selectedProfile = profiles.find((p) => p.user_id === selectedId);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registered customers ({profiles.length})
        </p>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

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
              {filtered.map((profile) => {
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
                        <p className="text-sm font-medium">{profile.full_name || "Unknown"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{profile.phone || "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(profile.created_at)}</TableCell>
                    <TableCell className="text-sm">{orderCount}</TableCell>
                    <TableCell className="text-sm font-medium">{formatPrice(totalSpent)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedId(profile.user_id)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No customers found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedId(null)}>
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
    </div>
  );
}
