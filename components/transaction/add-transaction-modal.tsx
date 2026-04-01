'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '@/lib/mock-data';

interface AddTransactionModalProps {
  onClose?: () => void;
}

export function AddTransactionModal({ onClose }: AddTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log({
      category: selectedCategory,
      amount: parseFloat(amount),
      description,
      date,
    });
    setOpen(false);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedCategory(CATEGORIES[0].id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] border-border/30 bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Transaction</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Record a new transaction to track your spending
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Amount (ETB)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-foreground">Category</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border/30 bg-secondary hover:border-border/50'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-border hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={!amount || !description}
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
