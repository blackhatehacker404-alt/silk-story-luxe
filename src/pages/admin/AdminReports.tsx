import { Download, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { monthlyRevenueData, mockOrders } from "@/data/admin-mock-data";
import { formatPrice } from "@/data/products";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const { toast } = useToast();

  const totalRevenue = monthlyRevenueData.reduce((sum, m) => sum + m.revenue, 0);
  const avgOrder = totalRevenue / mockOrders.length;

  const dailyData = [
    { day: "Mon", orders: 3, revenue: 95000 },
    { day: "Tue", orders: 5, revenue: 142000 },
    { day: "Wed", orders: 2, revenue: 68000 },
    { day: "Thu", orders: 4, revenue: 115000 },
    { day: "Fri", orders: 6, revenue: 198000 },
    { day: "Sat", orders: 8, revenue: 275000 },
    { day: "Sun", orders: 4, revenue: 120000 },
  ];

  const handleDownload = (type: string) => {
    toast({ title: `${type} report download will be available with backend integration` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sales reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => handleDownload("PDF")}>
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => handleDownload("Excel")}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Revenue (6 months)
            </p>
            <p className="text-2xl font-heading font-bold mt-1">
              {formatPrice(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl font-heading font-bold mt-1">
              {mockOrders.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Average Order Value
            </p>
            <p className="text-2xl font-heading font-bold mt-1">
              {formatPrice(Math.round(avgOrder))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(345, 55%, 22%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">
              Weekly Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(38, 72%, 50%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(38, 72%, 50%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">
            Recent Orders Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-sm">{order.id}</TableCell>
                  <TableCell className="text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-sm">{order.items.length}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-sm capitalize">{order.status}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
