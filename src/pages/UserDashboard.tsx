import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, MapPin, Package, Plus, Trash2, LogOut } from "lucide-react";
import { formatPrice } from "@/data/products";

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: any[];
  created_at: string;
}

const UserDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ full_name: string; phone: string }>({ full_name: "", phone: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "" });
  };

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setAddresses(data as Address[]);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name, phone: profile.phone })
      .eq("user_id", user!.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
  };

  const addAddress = async () => {
    const { error } = await supabase.from("addresses").insert({
      user_id: user!.id,
      ...newAddress,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Address added!" });
      setShowAddressForm(false);
      setNewAddress({ label: "Home", full_name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pincode: "" });
      fetchAddresses();
    }
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    fetchAddresses();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  if (loading) return <div className="min-h-screen pt-32 flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">My Account</h1>
              <p className="text-muted-foreground font-body mt-1">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={() => { signOut(); navigate("/"); }} className="gap-2">
              <LogOut size={16} /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card border border-border w-full justify-start">
              <TabsTrigger value="profile" className="gap-2 font-body"><User size={16} /> Profile</TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 font-body"><Package size={16} /> Orders</TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2 font-body"><MapPin size={16} /> Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-heading font-semibold">Profile Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-body">Full Name</Label>
                    <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-body">Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <Button onClick={updateProfile} className="bg-primary text-primary-foreground">Save Changes</Button>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-heading font-semibold mb-4">Order History</h2>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 font-body">No orders yet. Start shopping!</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-body text-sm font-medium">#{order.order_number}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-body capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground font-body">
                          <span>{new Date(order.created_at).toLocaleDateString("en-IN")}</span>
                          <span className="font-semibold text-foreground">{formatPrice(order.total_amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-semibold">Saved Addresses</h2>
                  <Button size="sm" variant="outline" onClick={() => setShowAddressForm(!showAddressForm)} className="gap-1">
                    <Plus size={14} /> Add
                  </Button>
                </div>

                {showAddressForm && (
                  <div className="border border-border rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input placeholder="Full Name" value={newAddress.full_name} onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} />
                      <Input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                      <Input placeholder="Address Line 1" className="sm:col-span-2" value={newAddress.address_line1} onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })} />
                      <Input placeholder="Address Line 2 (optional)" className="sm:col-span-2" value={newAddress.address_line2} onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })} />
                      <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                      <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                      <Input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                      <Input placeholder="Label (Home, Office)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addAddress} className="bg-primary text-primary-foreground">Save Address</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <p className="text-muted-foreground text-center py-8 font-body">No saved addresses.</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-border rounded-lg p-4 flex justify-between items-start">
                        <div className="font-body text-sm">
                          <p className="font-semibold">{addr.full_name} <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded">{addr.label}</span></p>
                          <p className="text-muted-foreground mt-1">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                          <p className="text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-muted-foreground">{addr.phone}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteAddress(addr.id)} className="text-destructive hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
};

export default UserDashboard;
