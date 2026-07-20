import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollReveal from './ScrollReveal';

/**
 * Objection handling. These are the real questions that stop a visitor from signing up for a
 * stock-research product: is it advice, how is Sharia compliance decided, where does the data
 * come from, is my portfolio private. Answers are deliberately plain and honest — over-claiming
 * here is what destroys trust with a finance audience.
 */
const faqs = [
  {
    q: 'Is this financial advice?',
    a: 'No. Market Canvas AI gives you research, data and analysis so you can make your own informed decisions. It is not licensed financial advice, and nothing here is a promise of returns. Always do your own checks — and consult a licensed advisor for personal advice.',
  },
  {
    q: 'How do you decide if a stock is Sharia-compliant?',
    a: 'Stocks are screened against KMI All-Share / AAOIFI-style criteria. That rules out conventional banking and insurance, alcohol, gambling, tobacco, weapons, adult entertainment and pork-related businesses, and applies limits on interest-bearing debt and impermissible income. Screens change as companies report, so we re-check continuously — please re-verify a name before you invest.',
  },
  {
    q: 'Which markets do you cover?',
    a: 'The Pakistan Stock Exchange (PSX) and US-listed equities. You can switch between them anywhere in the app, and each market keeps its own portfolio, watchlist and currency.',
  },
  {
    q: 'Where does your data come from?',
    a: 'Live market prices during trading hours, public company disclosures and filings, and reputable financial press. Technical indicators are computed from public market data. Where an analysis leans on a broker or analyst view, it is treated as one input to weigh — never as the final word.',
  },
  {
    q: 'Do I need an account to try it?',
    a: 'No. You can explore the market view and see what the platform does before signing up. Creating a free account is what lets you track your own portfolio, save a watchlist and receive alerts.',
  },
  {
    q: 'Is my portfolio data private?',
    a: 'Yes. Your holdings are tied to your own account and protected by database-level security rules, so only you can read them. We never publish or share your positions.',
  },
  {
    q: 'How often is everything updated?',
    a: 'Prices refresh automatically during market hours. Research, recommendations and the Sharia screen refresh on a daily cycle, so what you see reflects the latest completed analysis.',
  },
];

const FAQSection = () => {
  return (
    <ScrollReveal>
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Questions, answered
            </h2>
            <p className="text-muted-foreground text-lg">
              The things worth knowing before you trust any research tool with your money.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base md:text-lg font-medium hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default FAQSection;
