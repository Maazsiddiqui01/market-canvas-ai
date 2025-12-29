import { Button } from '@/components/ui/button';
import { Trash2, Calendar, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

interface Position {
  id: string;
  shares: number;
  buy_price: number;
  buy_date: string | null;
  notes: string | null;
  created_at: string;
}

interface PositionsListProps {
  positions: Position[];
  currentPrice: number | null;
  onDelete: (positionId: string) => void;
}

export const PositionsList = ({ positions, currentPrice, onDelete }: PositionsListProps) => {
  if (positions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2 pl-4">
        No individual positions recorded
      </div>
    );
  }

  return (
    <div className="space-y-2 pl-4 border-l-2 border-border/50 ml-4">
      {positions.map((position) => {
        const positionValue = position.shares * position.buy_price;
        const currentValue = currentPrice ? position.shares * currentPrice : null;
        const pnl = currentValue ? currentValue - positionValue : null;
        const pnlPercent = pnl && positionValue > 0 ? (pnl / positionValue) * 100 : null;

        return (
          <div
            key={position.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 text-sm"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium">{position.shares} shares @ PKR {position.buy_price.toLocaleString()}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {position.buy_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(position.buy_date), 'MMM d, yyyy')}
                    </span>
                  )}
                  {position.notes && (
                    <span className="flex items-center gap-1">
                      <StickyNote className="h-3 w-3" />
                      {position.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-muted-foreground">Cost: PKR {positionValue.toLocaleString()}</p>
                {pnl !== null && (
                  <p className={`text-xs font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pnl >= 0 ? '+' : ''}{pnl.toLocaleString()} ({pnlPercent?.toFixed(2)}%)
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(position.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
