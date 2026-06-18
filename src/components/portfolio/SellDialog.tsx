import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus } from 'lucide-react';

interface SellDialogProps {
  holdingId: string;
  ticker: string;
  maxShares: number;
  cur?: string;
  onSell: (holdingId: string, sharesToSell: number, sellPrice: number, sellDate?: string) => Promise<void>;
}

export const SellDialog = ({ holdingId, ticker, maxShares, cur = 'PKR', onSell }: SellDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ shares: '', sellPrice: '', sellDate: '' });

  const sharesNum = parseFloat(formData.shares);
  const overMax = !isNaN(sharesNum) && sharesNum > maxShares + 1e-9;

  const handleSubmit = async () => {
    if (!formData.shares || !formData.sellPrice || overMax) return;
    setIsSubmitting(true);
    try {
      await onSell(holdingId, parseFloat(formData.shares), parseFloat(formData.sellPrice), formData.sellDate || undefined);
      setFormData({ shares: '', sellPrice: '', sellDate: '' });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-down hover:text-down" aria-label="Sell">
          <Minus className="h-3 w-3" />
          Sell
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell {ticker}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Shares to sell</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setFormData({ ...formData, shares: String(maxShares) })}
                >
                  Sell all ({maxShares})
                </button>
              </div>
              <Input
                type="number"
                placeholder={String(maxShares)}
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
              />
              {overMax && (
                <p className="text-xs text-down">You only hold {maxShares} shares.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sell price ({cur})</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sell date (optional)</Label>
            <Input
              type="date"
              value={formData.sellDate}
              onChange={(e) => setFormData({ ...formData, sellDate: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Reduces your position oldest-lot-first and records the realized profit/loss. Selling your whole
            position removes the holding.
          </p>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!formData.shares || !formData.sellPrice || overMax || isSubmitting}
          >
            {isSubmitting ? 'Recording…' : 'Record sale'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
