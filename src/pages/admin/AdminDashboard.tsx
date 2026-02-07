import { IndianRupee, ShoppingCart, TrendingUp, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  dashboardStats,
  monthlyRevenueData,
  orderStatusData,
  mockOrders,
} from "@/data/admin-mock-data";
import { formatPrice } from "@/data/products";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statusColors: Record<string, string> = {
  new: "bg-accent text-accent-foreground",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Sales",
      value: formatPrice(dashboardStats.totalSales),
      icon: IndianRupee,
      change: "+12.5%",
    },
    {
      title: "Today's Orders",
      value: dashboardStats.todayOrders.toString(),
      icon: ShoppingCart,
      change: "+2",
    },
    {
      title: "Monthly Revenue",
      value: formatPrice(dashboardStats.monthlyRevenue),
      icon: TrendingUp,
      change: "+19.8%",
    },
    {
      title: "Total Customers",
      value: dashboardStats.totalCustomers.toString(),
      icon: Users,
      change: "+3",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Revenue"]}
                  contentStyle={{
                    borderRadius: "6px",
                    border: "1px solid hsl(35, 20%, 88%)",
                    fontSize: "13px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(345, 55%, 22%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {orderStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Sellers */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Best Sellers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {dashboardStats.bestSellers.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
