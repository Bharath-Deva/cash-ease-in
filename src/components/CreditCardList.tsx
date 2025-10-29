import { Card, CardContent } from '@/components/ui/card';
import { CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCard {
  id: string;
  cardNumber: string;
  bankName: string;
  expiryDate: string;
  availableLimit: number;
}

interface CreditCardListProps {
  cards: CreditCard[];
  onCardClick: (card: CreditCard) => void;
}

export const CreditCardList = ({ cards, onCardClick }: CreditCardListProps) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CreditCardIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No credit cards added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          onClick={() => onCardClick(card)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <CreditCardIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{card.bankName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Expires</p>
                <p className="text-sm font-medium text-foreground">{card.expiryDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
