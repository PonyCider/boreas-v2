import { BoreasHero } from "@/components/hero/boreas-hero";
import { Header } from "@/components/hero/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BoreasLandingSections } from "@/components/landing/boreas-landing-sections";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <BoreasHero />
      <BoreasLandingSections />
      <SiteFooter />
    </div>
  );
}
