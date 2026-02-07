import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOrders, Order } from "@/data/admin-mock-data";
import { formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

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

const allStatuses = ["all", "new", "processing", "shipped", "delivered"] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filtered = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
    toast({ title: `Order ${orderId} status updated to ${newStatus}` });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and track all customer orders ({orders.length} total)
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-sm">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {order.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 gap-1"
                        >
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${statusColors[order.status]}`}
                          >
                            {order.status}
                          </Badge>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {(["new", "processing", "shipped", "delivered"] as const).map(
                          (status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => updateStatus(order.id, status)}
                              className="capitalize"
                            >
                              {status}
                            </DropdownMenuItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${paymentColors[order.paymentStatus]}`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Order {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5">
              {/* Customer Info */}
              <div>
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Customer
                </h4>
                <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.customerEmail}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.customerPhone}
                </p>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Shipping Address
                </h4>
                <p className="text-sm">
                  {selectedOrder.shippingAddress.line1}
                  {selectedOrder.shippingAddress.line2 &&
                    `, ${selectedOrder.shippingAddress.line2}`}
                </p>
                <p className="text-sm">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} -{" "}
                  {selectedOrder.shippingAddress.pincode}
                </p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Items
                </h4>
                <div className="divide-y divide-border rounded-md border border-border">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-heading font-bold">
                  {formatPrice(selectedOrder.totalAmount)}
                </span>
              </div>

              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className={statusColors[selectedOrder.status]}
                >
                  {selectedOrder.status}
                </Badge>
                <Badge
                  variant="secondary"
                  className={paymentColors[selectedOrder.paymentStatus]}
                >
                  {selectedOrder.paymentStatus}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
