import { useState } from "react";
import { Search, Eye, ChevronDown, Download, Tag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminOrders, useUpdateOrderStatus, OrderRow } from "@/hooks/useOrders";
import { formatPrice } from "@/data/products";
import { generateInvoicePDF } from "@/utils/generateInvoice";
import { generateShippingLabel } from "@/utils/generateShippingLabel";
import { useShopIdentity } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  new: "bg-accent text-accent-foreground",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const paymentColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

const statusMessages: Record<string, string> = {
  processing: "Your order is being processed and will be shipped soon.",
  shipped: "Your order has been shipped! You'll receive it soon.",
  delivered: "Your order has been delivered. Thank you for shopping with Kalai Fashions!",
};

const allStatuses = ["all", "new", "processing", "shipped", "delivered"] as const;

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const filtered = orders.filter((order) => {
    const addr = order.shipping_address as any;
    const name = addr?.customer_name || addr?.full_name || "";
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sendWhatsAppNotification = (order: OrderRow, newStatus: string) => {
    const addr = order.shipping_address as any;
    const phone = (addr?.customer_phone || addr?.phone || "").replace(/[^0-9]/g, "");
    if (!phone) return;

    const customerName = addr?.customer_name || addr?.full_name || "Customer";
    const msg = statusMessages[newStatus];
    if (!msg) return;

    const text = encodeURIComponent(
      `Hi ${customerName}! 🙏\n\n` +
      `Order Update: *${order.order_number}*\n` +
      `Status: *${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}*\n\n` +
      `${msg}\n\n` +
      `— Kalai Fashions`
    );
    const phoneNum = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${phoneNum}?text=${text}`, "_blank");
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId);
    updateStatus.mutate({ id: orderId, status: newStatus }, {
      onSuccess: () => {
        toast.success(`Order status updated to ${newStatus}`);
        if (order && statusMessages[newStatus]) {
          sendWhatsAppNotification(order, newStatus);
        }
      },
    });
  };

  const getOrderItems = (order: OrderRow) => {
    const items = order.items as any[];
    return items.map((i: any) => ({
      name: i.name || i.product?.name || "Item",
      quantity: i.quantity || 1,
      price: i.price || i.product?.price || 0,
    }));
  };

  const handleDownloadInvoice = (order: OrderRow) => {
    const addr = order.shipping_address as any;
    generateInvoicePDF({
      orderNumber: order.order_number, date: order.created_at,
      customerName: addr?.customer_name || addr?.full_name || "Customer",
      customerPhone: addr?.customer_phone || addr?.phone || "",
      address: addr, items: getOrderItems(order),
      totalAmount: order.total_amount, paymentStatus: order.payment_status,
      paymentMethod: order.payment_method || undefined,
    });
  };

  const handleDownloadLabel = (order: OrderRow) => {
    const addr = order.shipping_address as any;
    generateShippingLabel({
      orderNumber: order.order_number,
      customerName: addr?.customer_name || addr?.full_name || "Customer",
      customerPhone: addr?.customer_phone || addr?.phone || "",
      address: addr,
      items: getOrderItems(order),
    });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and track all customer orders ({orders.length} total)</p>
      </div>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by order # or customer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                {allStatuses.map((s) => (<SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const addr = order.shipping_address as any;
                const name = addr?.customer_name || addr?.full_name || "—";
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-sm">{order.order_number}</TableCell>
                    <TableCell>
                      <p className="text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">{addr?.customer_phone || addr?.phone || ""}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                    <TableCell className="font-medium text-sm">{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
                            <Badge variant="secondary" className={`text-[10px] ${statusColors[order.status] || ""}`}>{order.status}</Badge>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {(["new", "processing", "shipped", "delivered"] as const).map((status) => (
                            <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(order.id, status)} className="capitalize">
                              {status}
                              {statusMessages[status] && <MessageCircle className="ml-auto h-3 w-3 text-muted-foreground" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className={`text-[10px] ${paymentColors[order.payment_status] || ""}`}>{order.payment_status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order)} title="View"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadInvoice(order)} title="Invoice"><Download className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadLabel(order)} title="Shipping Label"><Tag className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (<TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No orders found</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">Order {selectedOrder?.order_number}</DialogTitle></DialogHeader>
          {selectedOrder && (() => {
            const addr = selectedOrder.shipping_address as any;
            const items = getOrderItems(selectedOrder);
            return (
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Customer</h4>
                  <p className="text-sm font-medium">{addr?.customer_name || addr?.full_name || "—"}</p>
                  <p className="text-sm text-muted-foreground">{addr?.customer_phone || addr?.phone || ""}</p>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Shipping Address</h4>
                  <p className="text-sm">{addr?.address_line1 || addr?.line1 || ""}{addr?.address_line2 || addr?.line2 ? `, ${addr.address_line2 || addr.line2}` : ""}</p>
                  <p className="text-sm">{addr?.city}, {addr?.state} - {addr?.pincode}</p>
                </div>
                <div>
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</h4>
                  <div className="divide-y divide-border rounded-md border border-border">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center px-3 py-2">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-heading font-bold">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={statusColors[selectedOrder.status] || ""}>{selectedOrder.status}</Badge>
                  <Badge variant="secondary" className={paymentColors[selectedOrder.payment_status] || ""}>{selectedOrder.payment_status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => handleDownloadInvoice(selectedOrder)}>
                    <Download className="h-4 w-4" /> Invoice
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => handleDownloadLabel(selectedOrder)}>
                    <Tag className="h-4 w-4" /> Shipping Label
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
