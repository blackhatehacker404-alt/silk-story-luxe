import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-2">Sri Ganapathy</h3>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 text-gold-light opacity-80">Silks</p>
            <p className="text-sm leading-relaxed opacity-75 font-body">
              A heritage brand dedicated to preserving the timeless art of handwoven silk sarees, 
              crafted with love in the heart of South India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-gold-light font-body">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {["Collections", "New Arrivals", "Best Sellers", "Bridal"].map((link) => (
                <Link
                  key={link}
                  to="/products"
                  className="text-sm opacity-75 hover:opacity-100 transition-opacity font-body"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-gold-light font-body">Customer Care</h4>
            <div className="flex flex-col gap-3">
              {["Shipping Policy", "Returns & Exchange", "Care Instructions", "FAQ"].map((link) => (
                <span
                  key={link}
                  className="text-sm opacity-75 hover:opacity-100 transition-opacity cursor-pointer font-body"
                >
                  {link}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-gold-light font-body">Get in Touch</h4>
            <div className="flex flex-col gap-3 text-sm opacity-75 font-body">
              <p>123 Silk Street, Kanchipuram</p>
              <p>Tamil Nadu, India — 631502</p>
              <p>+91 98765 43210</p>
              <p>info@sriganapathysilks.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-xs tracking-[0.15em] opacity-60 font-body">
            © {new Date().getFullYear()} Sri Ganapathy Silks. All rights reserved. Handcrafted with heritage.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
