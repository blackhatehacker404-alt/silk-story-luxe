import HeroSlider from "@/components/home/HeroSlider";
import BrandStory from "@/components/home/BrandStory";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import NewsletterSection from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <main>
      <HeroSlider />
      <BrandStory />
      <FeaturedCollections />
      <NewArrivals />
      <BestSellers />
      <NewsletterSection />
    </main>
  );
};

export default Index;
