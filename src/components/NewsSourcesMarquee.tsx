import React from 'react';

interface NewsSourcesMarqueeProps {
  className?: string;
}

const NewsSourcesMarquee = ({ className = "" }: NewsSourcesMarqueeProps) => {
  const newsSources = [
    "Dawn", 
    "Tribune", 
    "Business Recorder", 
    "Profit Pakistan", 
    "Mettis Global",
    "The News",
    "Express Tribune",
    "Daily Times",
    "Pakistan Today",
    "Geo News"
  ];

  // Duplicate the array to create seamless loop
  const duplicatedSources = [...newsSources, ...newsSources];

  return (
    <div className={`overflow-hidden bg-card/30 backdrop-blur-sm border-y border-border/50 py-3 ${className}`}>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {duplicatedSources.map((source, index) => (
            <div
              key={index}
              className="flex items-center mx-8 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                <span className="text-sm font-medium tracking-wide">{source}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-card/30 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-card/30 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default NewsSourcesMarquee;