import React from 'react';
import { Mail, Linkedin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Creator Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-2">Created by Maaz</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Market Canvas AI - Your intelligent companion for smarter trading decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:maaz01888@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Get in Touch
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://www.linkedin.com/in/maazsiddiqui01/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center md:col-span-2">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Important Disclaimer
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    The information provided on this platform is for educational and informational purposes only. 
                    It should not be considered as financial advice or a recommendation to buy or sell any securities. 
                    <strong className="block mt-2">
                      Please conduct your own due diligence and consult with a qualified financial advisor before making any investment decisions.
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Market data provided by</span>
            <a 
              href="https://www.tradingview.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              TradingView
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Market Canvas AI. Built with AI-powered innovation for intelligent market analysis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;