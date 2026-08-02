import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LandingSections } from "@/components/landing/landing-sections";

export default function Home() {
  return (
    <>
      <Header />
      <LandingSections />
      <SiteFooter />
    </>
  );
}
