import { motion } from "framer-motion";

const BrandStory = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.4em] uppercase text-accent font-body mb-4 block">
              Our Heritage
            </span>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-8 leading-tight">
              Three Generations of
              <br />
              <span className="text-gold-gradient">Silk Mastery</span>
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body max-w-2xl mx-auto">
              Since 1952, Sri Ganapathy Silks has been at the forefront of preserving the sacred art 
              of Kanchipuram silk weaving. Each saree is a masterpiece — handwoven by skilled artisans 
              who have inherited this craft through generations, using pure mulberry silk and real gold zari.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 mt-16"
          >
            {[
              { number: "70+", label: "Years of Heritage" },
              { number: "10,000+", label: "Sarees Crafted" },
              { number: "200+", label: "Master Weavers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-4xl font-heading font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-body">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
