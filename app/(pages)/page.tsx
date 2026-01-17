import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { HowItWorks } from "@/components/home/how-it-works";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <HowItWorks />
    </>
  );
}
