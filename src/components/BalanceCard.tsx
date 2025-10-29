import { Card, CardContent } from '@/components/ui/card';
import { formatINR } from '@/lib/utils/currency';

interface BalanceCardProps {
  availableCredit: number;
  transferred: number;
}

export const BalanceCard = ({ availableCredit, transferred }: BalanceCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg border-0">
      <CardContent className="p-6 space-y-4">
        <div>
          <p className="text-sm opacity-90 mb-1">Available Credit Limit</p>
          <p className="text-3xl font-bold">{formatINR(availableCredit)}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <p className="text-xs opacity-80">Transferred Amount</p>
            <p className="text-xl font-semibold mt-0.5">{formatINR(transferred)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
