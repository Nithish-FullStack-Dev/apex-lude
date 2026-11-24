"use client";

import { useEffect, useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { EngineStorySection } from "./components/sections/EngineStorySection";
import IndustriesSection from "./components/sections/IndustriesSection";
import { ManufacturingSection } from "./components/sections/ManufacturingSection";
import { ProductShowcaseSection } from "./components/sections/ProductShowcaseSection";
import { PRODUCT_CATEGORIES } from "./data/apexData";
import LubricantHeroExperience from "./components/sections/LubricantHeroExperience";

export default function App() {
  const [reducedMotion, setReducedMotion] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string>(
    PRODUCT_CATEGORIES[0].id,
  );

  const [quoteProductTitle, setQuoteProductTitle] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mq.addEventListener("change", handler);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  const handleRequestQuote = (productTitle: string) => {
    setQuoteProductTitle(productTitle);

    const element = document.getElementById("contact");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen text-[var(--color-light-grey)]">
      <Navbar />

      <main className="relative">
        <LubricantHeroExperience />

        <div className="relative z-10 bg-[var(--color-charcoal)]">
          <EngineStorySection reducedMotion={reducedMotion} />

          <ProductShowcaseSection
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
            onRequestQuote={handleRequestQuote}
          />

          <IndustriesSection />

          <ManufacturingSection reducedMotion={reducedMotion} />

          <AboutSection />

          <ContactSection
            preselectedProductTitle={quoteProductTitle}
            reducedMotion={reducedMotion}
          />

          <Footer onSelectProduct={setSelectedProductId} />
        </div>
      </main>
    </div>
  );
}
