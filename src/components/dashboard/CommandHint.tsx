import { useEffect, useState } from 'react';
import { Command, X } from 'lucide-react';

const KEY = 'cmd_hint_dismissed_v1';

export const CommandHint = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(KEY)) return;
    // Hide on mobile — keyboard shortcut is desktop-only
    if (window.matchMedia('(max-width: 767px)').matches) return;
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(KEY, '1');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in">
      <div className="glass rounded-2xl p-4 pr-10 shadow-lg border border-border/50 relative">
        <button
          onClick={dismiss}
          aria-label="Dismiss tip"
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-xl shrink-0"
            style={{ background: 'var(--gradient-brand-tint)' }}
            aria-hidden="true"
          >
            <Command className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Quick tip</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-[10px] font-mono">
                ⌘K
              </kbd>{' '}
              anywhere to search stocks or jump to a page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
