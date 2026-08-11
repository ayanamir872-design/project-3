import HeroSection from '@/components/HeroSection';
import ServiceGrid from '@/components/ServiceGrid';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactBanner from '@/components/ContactBanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceGrid />
      <AboutSection />
      <TestimonialsSection />
      <ContactBanner />
    </>
  );
}
