import { products, Product } from "./products";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { product: Product; quantity: number }[];
  totalAmount: number;
  status: "new" | "processing" | "shipped" | "delivered";
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  addresses: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }[];
  createdAt: string;
  lastOrderAt: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customerId: "cust-001",
    customerName: "Priya Venkatesh",
    customerEmail: "priya.v@email.com",
    customerPhone: "+91 98765 43210",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[5], quantity: 1 },
    ],
    totalAmount: 73000,
    status: "new",
    paymentStatus: "paid",
    shippingAddress: {
      line1: "45, Temple Street",
      line2: "Near Kapaleeshwarar Temple",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600004",
    },
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "ORD-2024-002",
    customerId: "cust-002",
    customerName: "Lakshmi Narayanan",
    customerEmail: "lakshmi.n@email.com",
    customerPhone: "+91 87654 32109",
    items: [{ product: products[3], quantity: 1 }],
    totalAmount: 55000,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: {
      line1: "12, Silk Bazaar Road",
      city: "Kanchipuram",
      state: "Tamil Nadu",
      pincode: "631501",
    },
    createdAt: "2024-12-14T15:45:00Z",
    updatedAt: "2024-12-15T09:00:00Z",
  },
  {
    id: "ORD-2024-003",
    customerId: "cust-003",
    customerName: "Meenakshi Sundaram",
    customerEmail: "meena.s@email.com",
    customerPhone: "+91 76543 21098",
    items: [
      { product: products[1], quantity: 1 },
      { product: products[4], quantity: 1 },
    ],
    totalAmount: 80000,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: {
      line1: "78, Anna Salai",
      line2: "3rd Floor, Flat 302",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625001",
    },
    createdAt: "2024-12-12T08:20:00Z",
    updatedAt: "2024-12-14T16:00:00Z",
  },
  {
    id: "ORD-2024-004",
    customerId: "cust-004",
    customerName: "Kavitha Rajan",
    customerEmail: "kavitha.r@email.com",
    customerPhone: "+91 65432 10987",
    items: [{ product: products[6], quantity: 1 }],
    totalAmount: 48000,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: {
      line1: "22, MG Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641001",
    },
    createdAt: "2024-12-10T12:00:00Z",
    updatedAt: "2024-12-13T14:30:00Z",
  },
  {
    id: "ORD-2024-005",
    customerId: "cust-005",
    customerName: "Anitha Krishnan",
    customerEmail: "anitha.k@email.com",
    customerPhone: "+91 54321 09876",
    items: [
      { product: products[2], quantity: 1 },
      { product: products[7], quantity: 2 },
    ],
    totalAmount: 76000,
    status: "new",
    paymentStatus: "pending",
    shippingAddress: {
      line1: "56, Nehru Street",
      city: "Trichy",
      state: "Tamil Nadu",
      pincode: "620001",
    },
    createdAt: "2024-12-15T14:00:00Z",
    updatedAt: "2024-12-15T14:00:00Z",
  },
  {
    id: "ORD-2024-006",
    customerId: "cust-001",
    customerName: "Priya Venkatesh",
    customerEmail: "priya.v@email.com",
    customerPhone: "+91 98765 43210",
    items: [{ product: products[4], quantity: 1 }],
    totalAmount: 42000,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: {
      line1: "45, Temple Street",
      line2: "Near Kapaleeshwarar Temple",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600004",
    },
    createdAt: "2024-11-28T09:15:00Z",
    updatedAt: "2024-12-02T11:00:00Z",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Priya Venkatesh",
    email: "priya.v@email.com",
    phone: "+91 98765 43210",
    totalOrders: 4,
    totalSpent: 185000,
    addresses: [
      {
        line1: "45, Temple Street",
        line2: "Near Kapaleeshwarar Temple",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600004",
        isDefault: true,
      },
    ],
    createdAt: "2024-06-15T10:00:00Z",
    lastOrderAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "cust-002",
    name: "Lakshmi Narayanan",
    email: "lakshmi.n@email.com",
    phone: "+91 87654 32109",
    totalOrders: 2,
    totalSpent: 93000,
    addresses: [
      {
        line1: "12, Silk Bazaar Road",
        city: "Kanchipuram",
        state: "Tamil Nadu",
        pincode: "631501",
        isDefault: true,
      },
    ],
    createdAt: "2024-08-20T14:30:00Z",
    lastOrderAt: "2024-12-14T15:45:00Z",
  },
  {
    id: "cust-003",
    name: "Meenakshi Sundaram",
    email: "meena.s@email.com",
    phone: "+91 76543 21098",
    totalOrders: 3,
    totalSpent: 142000,
    addresses: [
      {
        line1: "78, Anna Salai",
        line2: "3rd Floor, Flat 302",
        city: "Madurai",
        state: "Tamil Nadu",
        pincode: "625001",
        isDefault: true,
      },
    ],
    createdAt: "2024-07-10T09:00:00Z",
    lastOrderAt: "2024-12-12T08:20:00Z",
  },
  {
    id: "cust-004",
    name: "Kavitha Rajan",
    email: "kavitha.r@email.com",
    phone: "+91 65432 10987",
    totalOrders: 1,
    totalSpent: 48000,
    addresses: [
      {
        line1: "22, MG Road",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641001",
        isDefault: true,
      },
    ],
    createdAt: "2024-10-05T11:00:00Z",
    lastOrderAt: "2024-12-10T12:00:00Z",
  },
  {
    id: "cust-005",
    name: "Anitha Krishnan",
    email: "anitha.k@email.com",
    phone: "+91 54321 09876",
    totalOrders: 1,
    totalSpent: 76000,
    addresses: [
      {
        line1: "56, Nehru Street",
        city: "Trichy",
        state: "Tamil Nadu",
        pincode: "620001",
        isDefault: true,
      },
    ],
    createdAt: "2024-11-20T16:00:00Z",
    lastOrderAt: "2024-12-15T14:00:00Z",
  },
];

// Dashboard stats
export const dashboardStats = {
  totalSales: 544000,
  todayOrders: 2,
  monthlyRevenue: 374000,
  totalCustomers: 5,
  bestSellers: products.filter((p) => p.isBestSeller),
};

// Monthly revenue data for chart
export const monthlyRevenueData = [
  { month: "Jul", revenue: 125000 },
  { month: "Aug", revenue: 198000 },
  { month: "Sep", revenue: 167000 },
  { month: "Oct", revenue: 245000 },
  { month: "Nov", revenue: 312000 },
  { month: "Dec", revenue: 374000 },
];

// Order status distribution
export const orderStatusData = [
  { name: "New", value: 2, fill: "hsl(38, 72%, 50%)" },
  { name: "Processing", value: 1, fill: "hsl(200, 60%, 50%)" },
  { name: "Shipped", value: 1, fill: "hsl(280, 50%, 50%)" },
  { name: "Delivered", value: 2, fill: "hsl(145, 60%, 40%)" },
];
