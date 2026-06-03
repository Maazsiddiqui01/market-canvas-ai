import React from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import DashboardHeader from '../components/DashboardHeader';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import TrustedBy from '../components/landing/TrustedBy';
import CTASection from '../components/landing/CTASection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AnimatedCounter from '../components/landing/AnimatedCounter';
import ScrollReveal from '../components/landing/ScrollReveal';


const Index = () => {
  useDocumentTitle(
    'Market Canvas AI — AI-Powered PSX Stock Analytics & Trading Intelligence',
    'AI-powered Pakistan Stock Exchange analytics with real-time market data, portfolio tracking, price alerts, and intelligent trading recommendations.'
  );

  return (
    <main className="min-h-dvh bg-background relative overflow-hidden">
      
      <div className="relative z-10">
        <DashboardHeader />
        {/* Add top padding to compensate for fixed header */}
        <div className="pt-20">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Stats Section */}
          <ScrollReveal>
            <section className="py-16 px-4 border-y border-border/30 bg-card/50 dark:bg-card/20">
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatedCounter end={450} suffix="+" label="PSX Stocks Covered" />
                <AnimatedCounter end={2} suffix="" label="Markets (PSX + US)" />
                <AnimatedCounter end={100} suffix="%" label="Sharia-Screened" />
                <AnimatedCounter end={24} suffix="/7" label="AI Monitoring" />
              </div>
            </section>
          </ScrollReveal>
          
          {/* Features Section */}
          <FeaturesSection />
          
          {/* Trusted By Section */}
          <TrustedBy />
          
          {/* CTA Section */}
          <CTASection />
          
          {/* Footer */}
          <div id="contact">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;