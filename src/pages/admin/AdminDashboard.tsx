import { IndianRupee, ShoppingCart, TrendingUp, Users, AlertTriangle, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, products } from "@/data/products";
import { useAdminOrders } from "@/hooks/useOrders";
import { useAdminCoupons } from "@/hooks/useCoupons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const statusColors: Record<string, string> = {
  new: "bg-accent text-accent-foreground",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboard() {
  const { data: orders = [] } = useAdminOrders();
  const { data: coupons = [] } = useAdminCoupons();

  const { data: profileCount = 0 } = useQuery({
    queryKey: ["admin-customer-count"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const totalSales = orders.reduce((s, o) => s + o.total_amount, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.created_at.slice(0, 10) === today).length;

  const now = new Date();
  const thisMonth = orders.filter((o) => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyRevenue = thisMonth.reduce((s, o) => s + o.total_amount, 0);

  const monthlyRevenueData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString("en-IN", { month: "short" });
    const rev = orders.filter((o) => {
      const od = new Date(o.created_at);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).reduce((s, o) => s + o.total_amount, 0);
    return { month: label, revenue: rev };
  });

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const pieColors: Record<string, string> = {
    new: "hsl(38, 72%, 50%)", processing: "hsl(200, 60%, 50%)",
    shipped: "hsl(280, 50%, 50%)", delivered: "hsl(145, 60%, 40%)",
  };
  const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: pieColors[name] || "#888",
  }));

  // Top selling products from order items
  const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach((o) => {
    const items = o.items as any[];
    items.forEach((i: any) => {
      const name = i.name || "Item";
      if (!productSales[name]) productSales[name] = { name, count: 0, revenue: 0 };
      productSales[name].count += i.quantity || 1;
      productSales[name].revenue += (i.price || 0) * (i.quantity || 1);
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Category breakdown
  const categorySales: Record<string, number> = {};
  orders.forEach((o) => {
    const items = o.items as any[];
    items.forEach((i: any) => {
      const prod = products.find((p) => p.id === i.product_id);
      const cat = prod?.category || "Other";
      categorySales[cat] = (categorySales[cat] || 0) + (i.price || 0) * (i.quantity || 1);
    });
  });
  const catColors = ["hsl(345, 55%, 22%)", "hsl(38, 72%, 50%)", "hsl(200, 60%, 50%)", "hsl(280, 50%, 50%)", "hsl(145, 60%, 40%)", "hsl(20, 70%, 50%)"];
  const categoryData = Object.entries(categorySales).map(([name, value], i) => ({
    name, value, fill: catColors[i % catColors.length],
  }));

  // Low stock products
  const lowStockProducts = products.filter((p) => (p.stock ?? 10) <= LOW_STOCK_THRESHOLD);

  const activeCoupons = coupons.filter((c) => c.is_active).length;

  const stats = [
    { title: "Total Sales", value: formatPrice(totalSales), icon: IndianRupee, change: `${orders.length} orders` },
    { title: "Today's Orders", value: todayOrders.toString(), icon: ShoppingCart, change: "today" },
    { title: "Monthly Revenue", value: formatPrice(monthlyRevenue), icon: TrendingUp, change: `${thisMonth.length} orders` },
    { title: "Total Customers", value: profileCount.toString(), icon: Users, change: "registered" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live business overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{stat.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock & Active Coupons Alerts */}
      {(lowStockProducts.length > 0 || activeCoupons > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lowStockProducts.length > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-heading font-semibold text-destructive">Low Stock Alert ({lowStockProducts.length})</span>
                </div>
                <div className="space-y-1.5">
                  {lowStockProducts.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">{p.name}</span>
                      <Badge variant="destructive" className="text-[10px] shrink-0">{(p.stock ?? 0) <= 0 ? "Out" : p.stock}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {activeCoupons > 0 && (
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-heading font-semibold">{activeCoupons} Active Coupon{activeCoupons > 1 ? "s" : ""}</span>
                </div>
                <p className="text-xs text-muted-foreground">Manage from Settings → Coupons</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => [formatPrice(value), "Revenue"]} contentStyle={{ borderRadius: "6px", border: "1px solid hsl(35, 20%, 88%)", fontSize: "13px" }} />
                <Bar dataKey="revenue" fill="hsl(345, 55%, 22%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Order Status</CardTitle></CardHeader>
          <CardContent>
            {orderStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {orderStatusData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {orderStatusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                      <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Top Selling Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.count} sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(p.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No sales data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Category Breakdown</CardTitle></CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                      {categoryData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatPrice(value), "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {categoryData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No category data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Recent Orders</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {orders.slice(0, 5).map((order) => {
              const addr = order.shipping_address as any;
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{addr?.full_name || addr?.customer_name || "Customer"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.total_amount)}</p>
                    <Badge variant="secondary" className={`text-[10px] ${statusColors[order.status]}`}>{order.status}</Badge>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
