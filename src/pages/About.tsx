import { motion } from "framer-motion";
import { useShopIdentity } from "@/hooks/useSiteSettings";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";

const About = () => {
  const { data: shop } = useShopIdentity();

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body mb-4 block">
              Our Story
            </span>
            <h1 className="text-4xl lg:text-6xl font-heading mb-6 leading-tight">
              {shop?.shop_name ?? "Kalai Fashions"}
            </h1>
            <div className="w-12 h-px bg-foreground mx-auto mb-6" />
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
              {shop?.tagline ?? "Elampillai"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-heading">
                Crafted in {shop?.tagline ?? "Elampillai"}
              </h2>
              <div className="w-12 h-px bg-foreground mx-auto" />
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body">
                {shop?.shop_name ?? "Kalai Fashions"} brings you authentic handwoven silk sarees
                directly from {shop?.tagline ?? "Elampillai"} — a town renowned for its weaving
                heritage. We work closely with local artisans to deliver beautiful sarees at
                prices that start from just ₹999, making silk accessible to everyone.
              </p>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body">
                Every saree tells a story of tradition, patience, and artistry. Our weavers
                pour their skills into each thread, creating pieces that celebrate India's
                rich textile legacy while embracing contemporary tastes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: "500+", label: "Sarees Crafted" },
              { number: "₹999", label: "Starting Price" },
              { number: "50+", label: "Artisan Partners" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-4xl font-heading mb-2">{stat.number}</div>
                <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body mb-4 block">
              What We Stand For
            </span>
            <h2 className="text-3xl lg:text-4xl font-heading">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              {
                title: "Authentic Craft",
                description:
                  "Every saree is handwoven by skilled artisans using traditional techniques passed down through generations.",
              },
              {
                title: "Fair Pricing",
                description:
                  "By working directly with weavers, we eliminate middlemen and bring you authentic silk at honest prices.",
              },
              {
                title: "Community First",
                description:
                  "We're committed to supporting the weaving communities and preserving the art of handloom for future generations.",
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <h3 className="text-lg font-heading mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto text-center"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body mb-4 block">
              Get In Touch
            </span>
            <h2 className="text-3xl lg:text-4xl font-heading mb-10">Visit Us</h2>

            <div className="space-y-4 text-sm text-muted-foreground font-body">
              <div className="flex items-center justify-center gap-2">
                <MapPin size={16} />
                <span>
                  {shop?.address_line1 ?? "Elampillai"}, {shop?.city ?? "Salem"},{" "}
                  {shop?.state ?? "Tamil Nadu"} — {shop?.pincode ?? "637502"}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} />
                <span>{shop?.phone ?? "+91 88702 26867"}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail size={16} />
                <span>{shop?.email ?? "info@kalaifashions.com"}</span>
              </div>
            </div>

            {(shop?.instagram_url || shop?.facebook_url || shop?.youtube_url) && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {shop?.instagram_url && (
                  <a href={shop.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                )}
                {shop?.facebook_url && (
                  <a href={shop.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                )}
                {shop?.youtube_url && (
                  <a href={shop.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;
