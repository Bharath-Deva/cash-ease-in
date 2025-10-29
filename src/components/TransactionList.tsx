import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils/currency';
import { Transaction } from '@/lib/services/data';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.status === filter);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-success-bg text-success-foreground border-0 hover:bg-success-bg">
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="border-0">
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'success', 'failed', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No transactions found
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(transaction.date), 'MMM dd, yyyy • hh:mm a')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-foreground">
                      {formatINR(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
