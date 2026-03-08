import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ShoppingBag, Ticket, X } from "lucide-react";
import { useValidateCoupon, useIncrementCouponUsage } from "@/hooks/useCoupons";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const validateCoupon = useValidateCoupon();
  const incrementUsage = useIncrementCouponUsage();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: string; code: string; discount: number } | null>(null);

  const [form, setForm] = useState({
    fullName: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "Tamil Nadu", pincode: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const finalTotal = totalPrice - (appliedCoupon?.discount || 0);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCoupon.mutate(
      { code: couponCode, orderTotal: totalPrice },
      {
        onSuccess: (result) => {
          setAppliedCoupon({ id: result.coupon.id, code: result.coupon.code, discount: result.discount });
          toast.success(`Coupon applied! You save ${formatPrice(result.discount)}`);
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  if (items.length === 0) {
    return (
      <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-heading font-bold mb-2">Cart is Empty</h1>
          <Link to="/products" className="text-accent underline underline-offset-4 font-body">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-heading font-bold mb-2">Please Sign In</h1>
          <p className="text-muted-foreground mb-4 font-body">You need to be signed in to place an order.</p>
          <Link to="/auth" className="text-accent underline underline-offset-4 font-body">Sign In / Sign Up</Link>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderNumber = `KF-${Date.now().toString(36).toUpperCase()}`;
      const orderItems = items.map((item) => ({
        name: item.product.name, product_id: item.product.id,
        quantity: item.quantity, price: item.product.price,
      }));

      const { error } = await supabase.from("orders").insert({
        user_id: user.id, order_number: orderNumber,
        items: orderItems as any, total_amount: finalTotal,
        shipping_address: {
          full_name: form.fullName, phone: form.phone,
          address_line1: form.addressLine1, address_line2: form.addressLine2,
          city: form.city, state: form.state, pincode: form.pincode,
        } as any,
        payment_method: "cod", payment_status: "pending", status: "new",
      });

      if (error) throw error;

      // Increment coupon usage
      if (appliedCoupon) {
        incrementUsage.mutate(appliedCoupon.id);
      }

      // WhatsApp notification to admin
      const number = "918870226867";
      const itemsText = items.map((i) => `${i.product.name} × ${i.quantity}`).join("\n");
      const discountText = appliedCoupon ? `\nDiscount: -${formatPrice(appliedCoupon.discount)} (${appliedCoupon.code})` : "";
      const text = encodeURIComponent(
        `🛒 New Order!\n\nOrder: ${orderNumber}\nCustomer: ${form.fullName}\nPhone: ${form.phone}\n\nItems:\n${itemsText}${discountText}\n\nTotal: ${formatPrice(finalTotal)}\n\nAddress: ${form.addressLine1}, ${form.city}, ${form.state} - ${form.pincode}`
      );
      window.open(`https://wa.me/${number}?text=${text}`, "_blank");

      clearCart();
      toast.success(`Order ${orderNumber} placed successfully!`);
      navigate("/account");
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-28 lg:pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <Link to="/products" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-6 font-body">
          <ChevronLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="text-2xl lg:text-3xl font-heading font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base font-heading">Shipping Address</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Full name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Address Line 1 *</Label>
                  <Input value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} placeholder="Street address" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Address Line 2</Label>
                  <Input value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} placeholder="Apartment, suite, etc." />
                </div>
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Input value={form.state} onChange={(e) => update("state", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Pincode *</Label>
                  <Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-32">
              <CardHeader><CardTitle className="text-base font-heading">Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="font-body">
                      {item.product.name} <span className="text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}

                {/* Coupon */}
                <div className="pt-3 border-t border-border">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-primary/5 rounded-md px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{appliedCoupon.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary font-medium">-{formatPrice(appliedCoupon.discount)}</span>
                        <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={validateCoupon.isPending}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-body text-muted-foreground">Total</span>
                  <span className="text-lg font-heading font-bold">{formatPrice(finalTotal)}</span>
                </div>
                <Button onClick={handlePlaceOrder} disabled={loading} className="w-full" size="lg">
                  {loading ? "Placing Order..." : "Place Order & Notify via WhatsApp"}
                </Button>
                <p className="text-xs text-muted-foreground text-center font-body">
                  Order details will be shared with the seller via WhatsApp
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
