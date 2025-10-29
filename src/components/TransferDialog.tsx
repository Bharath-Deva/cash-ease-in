import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatINR } from '@/lib/utils/currency';

interface CreditCard {
  id: string;
  cardNumber: string;
  bankName: string;
  expiryDate: string;
  availableLimit: number;
}

interface SavingsAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  balance: number;
}

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CreditCard | null;
  accounts: SavingsAccount[];
  onTransfer: (accountId: string, amount: number) => void;
}

export const TransferDialog = ({
  open,
  onOpenChange,
  card,
  accounts,
  onTransfer,
}: TransferDialogProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleTransfer = () => {
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      return;
    }
    onTransfer(selectedAccount, parseFloat(amount));
    setSelectedAccount('');
    setAmount('');
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            Transfer from {card.bankName} •••• {card.cardNumber.slice(-4)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Savings Account</label>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Please add a savings account first
              </p>
            ) : (
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bankName} - ••{account.accountNumber.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (₹)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
          </div>
          <Button
            onClick={handleTransfer}
            disabled={!selectedAccount || !amount || parseFloat(amount) <= 0}
            className="w-full"
          >
            Transfer {amount && formatINR(parseFloat(amount))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
