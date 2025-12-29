import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StockSelector } from './StockSelector';
import { Stock } from '@/data/stockData';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface PositionEntry {
  id: string;
  shares: string;
  buyPrice: string;
  buyDate: string;
  notes: string;
}

interface AddHoldingDialogProps {
  onAdd: (
    ticker: string,
    stockName: string,
    positions: Array<{ shares: number; buyPrice: number; buyDate?: string; notes?: string }>
  ) => Promise<void>;
}

export const AddHoldingDialog = ({ onAdd }: AddHoldingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [positions, setPositions] = useState<PositionEntry[]>([
    { id: crypto.randomUUID(), shares: '', buyPrice: '', buyDate: '', notes: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPositionRow = () => {
    setPositions([
      ...positions,
      { id: crypto.randomUUID(), shares: '', buyPrice: '', buyDate: '', notes: '' }
    ]);
  };

  const removePositionRow = (id: string) => {
    if (positions.length > 1) {
      setPositions(positions.filter(p => p.id !== id));
    }
  };

  const updatePosition = (id: string, field: keyof PositionEntry, value: string) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculateTotals = () => {
    let totalShares = 0;
    let totalCost = 0;

    positions.forEach(p => {
      const shares = parseFloat(p.shares) || 0;
      const price = parseFloat(p.buyPrice) || 0;
      totalShares += shares;
      totalCost += shares * price;
    });

    const weightedAvg = totalShares > 0 ? totalCost / totalShares : 0;

    return { totalShares, totalCost, weightedAvg };
  };

  const isValid = () => {
    if (!selectedStock) return false;
    
    // At least one position with valid shares and price
    return positions.some(p => {
      const shares = parseFloat(p.shares);
      const price = parseFloat(p.buyPrice);
      return shares > 0 && price > 0;
    });
  };

  const handleSubmit = async () => {
    if (!selectedStock || !isValid()) return;

    setIsSubmitting(true);
    try {
      const validPositions = positions
        .filter(p => parseFloat(p.shares) > 0 && parseFloat(p.buyPrice) > 0)
        .map(p => ({
          shares: parseFloat(p.shares),
          buyPrice: parseFloat(p.buyPrice),
          buyDate: p.buyDate || undefined,
          notes: p.notes || undefined,
        }));

      await onAdd(selectedStock.ticker, selectedStock.name, validPositions);
      
      // Reset form
      setSelectedStock(null);
      setPositions([{ id: crypto.randomUUID(), shares: '', buyPrice: '', buyDate: '', notes: '' }]);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { totalShares, totalCost, weightedAvg } = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Holding
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Holding</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Stock Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Stock *</Label>
            <StockSelector
              value={selectedStock}
              onChange={setSelectedStock}
              placeholder="Search by ticker or company name..."
            />
          </div>

          {/* Positions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Entry Positions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPositionRow}
                className="gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add Position
              </Button>
            </div>

            <div className="space-y-3">
              {positions.map((position, index) => (
                <div 
                  key={position.id} 
                  className="p-3 rounded-lg border border-border/50 bg-secondary/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Position {index + 1}
                    </span>
                    {positions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removePositionRow(position.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Shares *</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={position.shares}
                        onChange={(e) => updatePosition(position.id, 'shares', e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Buy Price (PKR) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        value={position.buyPrice}
                        onChange={(e) => updatePosition(position.id, 'buyPrice', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Buy Date</Label>
                      <Input
                        type="date"
                        value={position.buyDate}
                        onChange={(e) => updatePosition(position.id, 'buyDate', e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Notes</Label>
                      <Input
                        placeholder="Optional notes..."
                        value={position.notes}
                        onChange={(e) => updatePosition(position.id, 'notes', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Preview */}
          {totalShares > 0 && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Position Summary</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Total Shares</p>
                  <p className="font-semibold">{totalShares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Weighted Avg Price</p>
                  <p className="font-semibold">PKR {weightedAvg.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total Cost</p>
                  <p className="font-semibold">PKR {totalCost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!isValid() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add to Portfolio'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
