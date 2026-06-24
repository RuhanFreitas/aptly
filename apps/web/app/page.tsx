import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { MarqueeStrip } from "@/components/marketing/marquee-strip";
import { Mission } from "@/components/marketing/mission";
import { DimensionsSection } from "@/components/marketing/dimensions-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CTA } from "@/components/marketing/cta";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <MarqueeStrip />
        <Mission />
        <DimensionsSection />
        <HowItWorks />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}
