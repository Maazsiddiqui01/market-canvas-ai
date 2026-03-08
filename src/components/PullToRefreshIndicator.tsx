import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator = ({ pullDistance, isRefreshing, threshold = 80 }: PullToRefreshIndicatorProps) => {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
      style={{ height: pullDistance > 0 || isRefreshing ? `${Math.max(pullDistance, isRefreshing ? 40 : 0)}px` : 0 }}
    >
      <div className={`p-2 rounded-full bg-primary/10 ${isRefreshing ? 'animate-spin' : ''}`}>
        <RefreshCw
          className="h-5 w-5 text-primary transition-transform"
          style={{ transform: isRefreshing ? undefined : `rotate(${rotation}deg)`, opacity: progress }}
        />
      </div>
    </div>
  );
};
