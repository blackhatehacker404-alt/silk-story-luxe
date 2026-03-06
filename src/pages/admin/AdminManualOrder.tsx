import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateManualOrder } from "@/hooks/useOrders";
import { toast } from "sonner";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import { formatPrice } from "@/data/products";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export default function AdminManualOrder() {
  const createOrder = useCreateManualOrder();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [items, setItems] = useState<OrderItem[]>([{ name: "", quantity: 1, price: 0 }]);

  const addItem = () => setItems([...items, { name: "", quantity: 1, price: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof OrderItem, value: string | number) => {
    setItems(items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || items.some((i) => !i.name || i.price <= 0)) {
      toast.error("Please fill in all required fields");
      return;
    }

    createOrder.mutate(
      {
        customer_name: customerName,
        customer_phone: customerPhone,
        items,
        total_amount: totalAmount,
        shipping_address: {
          address_line1: addressLine1,
          address_line2: addressLine2,
          city,
          state,
          pincode,
        },
        payment_status: paymentStatus,
        payment_method: paymentMethod,
      },
      {
        onSuccess: (orderNumber) => {
          toast.success(`Order ${orderNumber} created successfully`);
          // Reset form
          setCustomerName("");
          setCustomerPhone("");
          setAddressLine1("");
          setAddressLine2("");
          setCity("");
          setPincode("");
          setItems([{ name: "", quantity: 1, price: 0 }]);
          setPaymentStatus("pending");
          setPaymentMethod("cash");
        },
        onError: () => toast.error("Failed to create order"),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6" /> Create Manual Order
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Add an order on behalf of a customer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Customer Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" required />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" required />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader><CardTitle className="text-base">Shipping Address</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Address Line 1</Label>
              <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street address" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Address Line 2</Label>
              <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Apartment, suite, etc." />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Pincode</Label>
              <Input value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Order Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
              <Plus className="h-3 w-3" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Product Name *</Label>
                  <Input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Saree name" />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs">Qty</Label>
                  <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)} />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Price (₹) *</Label>
                  <Input type="number" min={0} value={item.price} onChange={(e) => updateItem(i, "price", parseFloat(e.target.value) || 0)} />
                </div>
                {items.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-9 w-9 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-border text-right">
              <span className="text-sm text-muted-foreground">Total: </span>
              <span className="text-lg font-heading font-bold">{formatPrice(totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader><CardTitle className="text-base">Payment</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={createOrder.isPending} className="w-full sm:w-auto">
          {createOrder.isPending ? "Creating..." : "Create Order"}
        </Button>
      </form>
    </div>
  );
}
