import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Portfolio Manager',
    company: 'Vanguard',
    avatar: 'SC',
    content: 'The AI-powered insights have completely transformed how I analyze market trends. The real-time data is incredibly accurate.',
    rating: 5,
  },
  {
    name: 'Michael Roberts',
    role: 'Day Trader',
    company: 'Independent',
    avatar: 'MR',
    content: 'Best investment I\'ve made for my trading career. The price alerts and portfolio tracking save me hours every day.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Financial Analyst',
    company: 'BlackRock',
    avatar: 'EW',
    content: 'The technical analysis tools are on par with Bloomberg terminals, but at a fraction of the cost. Highly recommended.',
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Loved by Traders Worldwide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of traders who've transformed their market analysis with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:border-primary/30">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
