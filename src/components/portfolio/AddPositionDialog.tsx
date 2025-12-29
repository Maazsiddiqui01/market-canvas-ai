import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddPositionDialogProps {
  holdingId: string;
  ticker: string;
  onAdd: (holdingId: string, shares: number, buyPrice: number, buyDate?: string, notes?: string) => Promise<void>;
}

export const AddPositionDialog = ({ holdingId, ticker, onAdd }: AddPositionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shares: '',
    buyPrice: '',
    buyDate: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.shares || !formData.buyPrice) return;
    
    setIsSubmitting(true);
    try {
      await onAdd(
        holdingId,
        parseFloat(formData.shares),
        parseFloat(formData.buyPrice),
        formData.buyDate || undefined,
        formData.notes || undefined
      );
      setFormData({ shares: '', buyPrice: '', buyDate: '', notes: '' });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <Plus className="h-3 w-3" />
          Add Position
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Position to {ticker}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shares</Label>
              <Input
                type="number"
                placeholder="100"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Buy Price (PKR)</Label>
              <Input
                type="number"
                placeholder="150.00"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Buy Date (Optional)</Label>
            <Input
              type="date"
              value={formData.buyDate}
              onChange={(e) => setFormData({ ...formData, buyDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Input
              placeholder="e.g., Bought on dip"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!formData.shares || !formData.buyPrice || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Position'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
