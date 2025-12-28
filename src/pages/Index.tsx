import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveBackground />
      <div className="relative z-10">
        <DashboardHeader />
        {/* Add top padding to compensate for fixed header */}
        <div className="pt-20">
          <HeroSection />
          
          {/* Footer */}
          <div id="contact">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;