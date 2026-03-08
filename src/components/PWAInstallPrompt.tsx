import { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    // Listen for install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // On iOS, show banner after a short delay
    if (ios) {
      const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 2000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-[60] animate-slide-in-bottom max-w-md mx-auto">
      <Card className="bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl shadow-primary/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm mb-1">Install Market Canvas AI</h3>
              {isIOS ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tap <Share className="inline h-3 w-3 mx-0.5" /> Share then <strong>"Add to Home Screen"</strong> to install this app
                </p>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Install for quick access, offline support & a native app experience
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                {!isIOS && (
                  <Button size="sm" onClick={handleInstall} className="h-8 text-xs rounded-lg gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Install App
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-8 text-xs rounded-lg text-muted-foreground">
                  Not now
                </Button>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
