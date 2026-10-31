import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { PhotometricPlayground } from "@/components/site/photometric-playground";
import { ProductBento } from "@/components/site/product-bento";
import { VECalculator } from "@/components/site/ve-calculator";
import { TrustMatrix } from "@/components/site/trust-matrix";
import { QuoteHub } from "@/components/site/quote-hub";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <PhotometricPlayground />
        <ProductBento />
        <VECalculator />
        <TrustMatrix />
        <QuoteHub />
      </main>
      <Footer />
    </>
  );
}
