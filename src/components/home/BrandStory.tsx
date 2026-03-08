import { motion } from "framer-motion";
import { useAboutStats } from "@/hooks/useSiteSettings";
const BrandStory = () => {
  const { data: stats } = useAboutStats();
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-body mb-4 block">
              Our Story
            </span>
            <h2 className="text-3xl lg:text-5xl font-heading mb-8 leading-tight">
              Crafted in Elampillai
            </h2>
            <div className="w-12 h-px bg-foreground mx-auto mb-8" />
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-body max-w-2xl mx-auto">
              Kalai Fashions brings you authentic handwoven silk sarees directly from Elampillai — 
              a town renowned for its weaving heritage. We work closely with local artisans to deliver 
              beautiful sarees at prices that start from just ₹999, making silk accessible to everyone.
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
              { number: "500+", label: "Sarees Crafted" },
              { number: "₹999", label: "Starting Price" },
              { number: "50+", label: "Artisan Partners" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-4xl font-heading mb-2">
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
