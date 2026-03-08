import { Link } from "react-router-dom";
import { useShopIdentity } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { data: shop } = useShopIdentity();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading mb-2">{shop?.shop_name ?? "Kalai Fashions"}</h3>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-60 font-body">{shop?.tagline ?? "Elampillai"}</p>
            <p className="text-sm leading-relaxed opacity-60 font-body">
              Handcrafted silk sarees from the weaving town of {shop?.tagline ?? "Elampillai"},
              bringing you timeless elegance at honest prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 opacity-80 font-body">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {["Shop All", "New Arrivals", "Best Sellers", "Bridal"].map((link) => (
                <Link key={link} to="/products" className="text-sm opacity-60 hover:opacity-100 transition-opacity font-body">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 opacity-80 font-body">Customer Care</h4>
            <div className="flex flex-col gap-3">
              {["Shipping Policy", "Returns & Exchange", "Care Instructions", "FAQ"].map((link) => (
                <span key={link} className="text-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-body">
                  {link}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 opacity-80 font-body">Get in Touch</h4>
            <div className="flex flex-col gap-3 text-sm opacity-60 font-body">
              <p>{shop?.address_line1 ?? "Elampillai"}, {shop?.city ?? "Salem"} District</p>
              <p>{shop?.state ?? "Tamil Nadu"}, India — {shop?.pincode ?? "637502"}</p>
              <p>{shop?.phone ?? "+91 98765 43210"}</p>
              <p>{shop?.email ?? "info@kalaifashions.com"}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center">
          <p className="text-xs tracking-[0.15em] opacity-40 font-body">
            © {new Date().getFullYear()} {shop?.shop_name ?? "Kalai Fashions"}. All rights reserved. Handcrafted in {shop?.tagline ?? "Elampillai"}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
