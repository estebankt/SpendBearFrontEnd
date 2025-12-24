import Header from '@/components/marketing/Header';
import Hero from '@/components/marketing/Hero';
import Features from '@/components/marketing/Features';
import PrivacySection from '@/components/marketing/PrivacySection';
import CTASection from '@/components/marketing/CTASection';
import Footer from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <PrivacySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
