import { useState } from "react";
import { Search, Eye, MapPin, ShoppingBag, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { mockCustomers, mockOrders, Customer } from "@/data/admin-mock-data";
import { formatPrice } from "@/data/products";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getCustomerOrders = (customerId: string) =>
    mockOrders.filter((o) => o.customerId === customerId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage your customer base ({mockCustomers.length} customers)
        </p>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
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
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">{customer.totalOrders}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatPrice(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-5">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {selectedCustomer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg">
                    {selectedCustomer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer since {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCustomer.phone}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <p className="text-lg font-heading font-bold">
                    {selectedCustomer.totalOrders}
                  </p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <p className="text-lg font-heading font-bold">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <p className="text-lg font-heading font-bold">
                    {formatPrice(
                      Math.round(
                        selectedCustomer.totalSpent / selectedCustomer.totalOrders
                      )
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg. Order</p>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Addresses
                </h4>
                {selectedCustomer.addresses.map((addr, i) => (
                  <div
                    key={i}
                    className="text-sm p-3 bg-secondary rounded-lg"
                  >
                    <p>
                      {addr.line1}
                      {addr.line2 && `, ${addr.line2}`}
                    </p>
                    <p>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Order History
                </h4>
                <div className="divide-y divide-border rounded-md border border-border">
                  {getCustomerOrders(selectedCustomer.id).length > 0 ? (
                    getCustomerOrders(selectedCustomer.id).map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center px-3 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)} ·{" "}
                            {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(order.totalAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No orders yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
