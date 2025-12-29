import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import StockTicker from '../components/landing/StockTicker';
import TrustedBy from '../components/landing/TrustedBy';
import TestimonialSection from '../components/landing/TestimonialSection';
import CTASection from '../components/landing/CTASection';
import AnimatedCounter from '../components/landing/AnimatedCounter';

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        <DashboardHeader />
        {/* Add top padding to compensate for fixed header */}
        <div className="pt-20">
          {/* Stock Ticker */}
          <StockTicker />
          
          {/* Hero Section */}
          <HeroSection />
          
          {/* Stats Section */}
          <section className="py-16 px-4 border-y border-border/30 bg-card/20">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter end={10000} suffix="+" label="Active Traders" />
              <AnimatedCounter end={5000} suffix="+" label="Stocks Analyzed" />
              <AnimatedCounter end={99} suffix=".9%" label="Uptime" />
              <AnimatedCounter end={24} suffix="/7" label="AI Monitoring" />
            </div>
          </section>
          
          {/* Trusted By Section */}
          <TrustedBy />
          
          {/* Testimonials */}
          <TestimonialSection />
          
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