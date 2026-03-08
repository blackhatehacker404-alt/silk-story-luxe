import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import AdminLayout from "@/components/admin/AdminLayout";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ProtectedAdminRoute from "@/components/auth/ProtectedAdminRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminManualOrder from "./pages/admin/AdminManualOrder";
import AdminAIInsights from "./pages/admin/AdminAIInsights";
import AdminAIDescriptions from "./pages/admin/AdminAIDescriptions";
import AdminAIChatbot from "./pages/admin/AdminAIChatbot";
import AdminAIInventory from "./pages/admin/AdminAIInventory";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin") && location.pathname !== "/admin-login";

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <CartDrawer />}
      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<UserDashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="manual-order" element={<AdminManualOrder />} />
          <Route path="ai-insights" element={<AdminAIInsights />} />
          <Route path="ai-descriptions" element={<AdminAIDescriptions />} />
          <Route path="ai-chatbot" element={<AdminAIChatbot />} />
          <Route path="ai-inventory" element={<AdminAIInventory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
