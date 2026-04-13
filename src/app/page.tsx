'use client';

import { CallToAction } from '@/components/CallToAction';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { PreviewSection } from '@/components/PreviewSection';
import { TrustSection } from '@/components/TrustSection';
import { UseCases } from '@/components/UseCases';

export default function HomePage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <HeroSection />
      <TrustSection />
      <HowItWorks />
      <UseCases />
    
    </main>
  );
}
