import { Download, FileText, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice, products } from "@/data/products";
import { useAdminOrders } from "@/hooks/useOrders";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const { toast } = useToast();
  const { data: orders = [] } = useAdminOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

  const now = new Date();

  // Monthly revenue (last 6 months)
  const monthlyRevenueData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString("en-IN", { month: "short" });
    const rev = orders.filter((o) => {
      const od = new Date(o.created_at);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).reduce((s, o) => s + o.total_amount, 0);
    const count = orders.filter((o) => {
      const od = new Date(o.created_at);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).length;
    return { month: label, revenue: rev, orders: count };
  });

  // Daily orders this week
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const dailyData = dayNames.map((day, i) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const ds = dayDate.toISOString().slice(0, 10);
    const dayOrders = orders.filter((o) => o.created_at.slice(0, 10) === ds);
    return { day, orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + o.total_amount, 0) };
  });

  // Top products
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
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

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

  const handleDownload = (type: string) => {
    toast({ title: `${type} report download will be available with backend integration` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Live sales reports and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => handleDownload("PDF")}>
            <FileText className="h-4 w-4" />Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => handleDownload("Excel")}>
            <Download className="h-4 w-4" />Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-heading font-bold mt-1">{formatPrice(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-heading font-bold mt-1">{orders.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Average Order Value</p>
            <p className="text-2xl font-heading font-bold mt-1">{formatPrice(Math.round(avgOrder))}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Calendar className="h-4 w-4" />Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => [formatPrice(value), "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(345, 55%, 22%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Weekly Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="hsl(38, 72%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 72%, 50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />Category-wise Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {categoryData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatPrice(value), "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Products Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((p, i) => (
                <TableRow key={p.name}>
                  <TableCell className="text-sm text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="text-sm font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm">{p.count}</TableCell>
                  <TableCell className="text-sm font-medium">{formatPrice(p.revenue)}</TableCell>
                </TableRow>
              ))}
              {topProducts.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No sales data yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
