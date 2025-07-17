import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailClick = () => {
    window.location.href = 'mailto:maaz01888@gmail.com?subject=Market Canvas AI Inquiry&body=Hi Maaz, I would like to discuss about Market Canvas AI.';
  };

  return (
    <>
      {/* Floating Email Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/10"
          size="sm"
        >
          <Mail className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Email Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-in-bottom">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-6 w-80 max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get in Touch</h3>
                  <p className="text-sm text-muted-foreground">Let's discuss opportunities</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Have questions about Market Canvas AI or want to collaborate? I'd love to hear from you!
              </p>
              
              <Button 
                onClick={handleEmailClick}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium transition-all duration-300 hover:scale-105"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  maaz01888@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailWidget;