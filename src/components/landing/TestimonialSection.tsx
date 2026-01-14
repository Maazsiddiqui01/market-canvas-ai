import React from 'react';
import { Star, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const testimonials = [
  {
    name: 'Ahmed H.',
    role: 'Retail Investor',
    avatar: 'AH',
    content: 'The AI research summaries save me so much time. Instead of reading through multiple reports, I get quick insights to help with my analysis.',
    rating: 5,
  },
  {
    name: 'Fatima K.',
    role: 'Part-time Trader',
    avatar: 'FK',
    content: 'Love the price alerts feature! I don\'t have to constantly watch the market anymore. The portfolio tracking is really convenient too.',
    rating: 5,
  },
  {
    name: 'Ali R.',
    role: 'Finance Student',
    avatar: 'AR',
    content: 'Great tool for learning about PSX stocks. The AI explanations help me understand market trends better. Perfect for beginners like me.',
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30 dark:bg-transparent">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Loved by Traders Nationwide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of traders who've transformed their market analysis with our AI-powered platform
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card dark:bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full transition-all duration-300 group-hover:translate-y-[-4px] group-hover:border-primary/30 shadow-sm">
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
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialSection;
