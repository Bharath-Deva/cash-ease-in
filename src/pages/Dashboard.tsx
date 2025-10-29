import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionList } from '@/components/TransactionList';
import { CreditCardList } from '@/components/CreditCardList';
import { SavingsAccountList } from '@/components/SavingsAccountList';
import { TransferDialog } from '@/components/TransferDialog';
import { getSummary, getTransactions, addCard, addSavingsAccount, getCards, getAccounts, transferMoney } from '@/lib/services/data';
import { isAuthenticated, logout, getSession } from '@/lib/services/auth';
import { toast } from 'sonner';
import { CreditCard, Wallet, Plus, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(getSummary());
  const [transactions, setTransactions] = useState(getTransactions());
  const [cards, setCards] = useState(getCards());
  const [accounts, setAccounts] = useState(getAccounts());
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [userName, setUserName] = useState('User');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardBank, setCardBank] = useState('');

  // Account form state
  const [accountNumber, setAccountNumber] = useState('');
  const [accountBank, setAccountBank] = useState('');
  const [accountIFSC, setAccountIFSC] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const session = getSession();
    if (session) {
      setUserName(session.phone.slice(-4));
    }

    const userData = JSON.parse(localStorage.getItem('c2c_user_data') || '{}');
    if (!userData.aadhaarVerified) {
      navigate('/kyc');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setTransferDialogOpen(true);
  };

  const handleTransfer = (accountId: string, amount: number) => {
    if (!selectedCard) return;

    try {
      const transaction = transferMoney(selectedCard.id, accountId, amount);
      
      // Update state
      setSummary(getSummary());
      setTransactions(getTransactions());
      setTransferDialogOpen(false);
      
      // Show appropriate toast based on status
      if (transaction.status === 'success') {
        toast.success(`₹${amount.toLocaleString('en-IN')} transferred successfully`);
      } else if (transaction.status === 'pending') {
        toast.info(`Transaction of ₹${amount.toLocaleString('en-IN')} is pending approval`);
      } else {
        toast.error('Transaction failed');
      }
    } catch (error) {
      toast.error('Transfer failed');
    }
  };

  const handleAddCard = () => {
    if (!cardNumber || !cardExpiry || !cardCVV || !cardBank) {
      toast.error('Please fill all card details');
      return;
    }

    addCard({
      cardNumber: cardNumber.replace(/\s/g, ''),
      bankName: cardBank,
      expiryDate: cardExpiry,
      availableLimit: 100000,
    });

    setSummary(getSummary());
    setCards(getCards());
    setCardDialogOpen(false);
    toast.success('Credit card added successfully');

    // Reset form
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardBank('');
  };

  const handleAddAccount = () => {
    if (!accountNumber || !accountBank || !accountIFSC) {
      toast.error('Please fill all account details');
      return;
    }

    addSavingsAccount({
      accountNumber,
      bankName: accountBank,
      ifsc: accountIFSC,
      balance: 0,
    });

    setSummary(getSummary());
    setAccounts(getAccounts());
    setAccountDialogOpen(false);
    toast.success('Savings account added successfully');

    // Reset form
    setAccountNumber('');
    setAccountBank('');
    setAccountIFSC('');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Credit2Cash</h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Balance Summary */}
        <BalanceCard
          availableCredit={summary.availableCredit}
          transferred={summary.transferred}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Add Card</p>
                  <p className="text-xs text-muted-foreground">
                    {summary.totalCards} added
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Credit Card</DialogTitle>
                <DialogDescription>
                  Enter your credit card details to add it
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    placeholder="HDFC Bank"
                    value={cardBank}
                    onChange={(e) => setCardBank(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input
                    placeholder="4532 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardNumber(formatted);
                    }}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry</label>
                    <Input
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2);
                        }
                        setCardExpiry(value);
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <Input
                      type="password"
                      placeholder="123"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
                <Button onClick={handleAddCard} className="w-full">
                  Add Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                    <Wallet className="w-6 h-6 text-secondary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Add Account</p>
                  <p className="text-xs text-muted-foreground">
                    {summary.totalAccounts} added
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Savings Account</DialogTitle>
                <DialogDescription>
                  Enter your bank account details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    placeholder="State Bank of India"
                    value={accountBank}
                    onChange={(e) => setAccountBank(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    placeholder="1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">IFSC Code</label>
                  <Input
                    placeholder="SBIN0001234"
                    value={accountIFSC}
                    onChange={(e) => setAccountIFSC(e.target.value.toUpperCase())}
                    className="uppercase"
                    maxLength={11}
                  />
                </div>
                <Button onClick={handleAddAccount} className="w-full">
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Credit Cards List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Credit Cards</h2>
          <CreditCardList cards={cards} onCardClick={handleCardClick} />
        </div>

        {/* Savings Accounts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Savings Accounts</h2>
          <SavingsAccountList accounts={accounts} />
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Transaction History
          </h2>
          <TransactionList transactions={transactions} />
        </div>
      </main>

      {/* Transfer Dialog */}
      <TransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        card={selectedCard}
        accounts={accounts}
        onTransfer={handleTransfer}
      />
    </div>
  );
};

export default Dashboard;
