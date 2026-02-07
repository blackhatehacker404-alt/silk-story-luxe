import { motion } from "framer-motion";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="py-20 lg:py-28 bg-burgundy-gradient text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-gold-light font-body mb-4 block">
            Stay Connected
          </span>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Join Our Heritage Circle
          </h2>
          <p className="text-sm text-primary-foreground/70 mb-8 font-body leading-relaxed">
            Be the first to discover new collections, exclusive offers, and stories 
            from the loom. Join our community of silk connoisseurs.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm font-body focus:outline-none focus:border-gold"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold-gradient text-accent-foreground text-sm tracking-[0.15em] uppercase font-body hover:shadow-gold transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
