import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface SavingsAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  balance: number;
}

interface SavingsAccountListProps {
  accounts: SavingsAccount[];
}

export const SavingsAccountList = ({ accounts }: SavingsAccountListProps) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No savings accounts added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                <Wallet className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{account.bankName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {account.ifsc}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">A/C</p>
                <p className="text-sm font-medium text-foreground">
                  ••{account.accountNumber.slice(-4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
