// Dummy data service for Credit2Cash
// Manages mock financial data in localStorage

export interface Transaction {
  id: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  type: string;
  date: string;
  description: string;
}

export interface CreditCard {
  id: string;
  cardNumber: string;
  bankName: string;
  expiryDate: string;
  availableLimit: number;
}

export interface SavingsAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  balance: number;
}

export interface Summary {
  availableCredit: number;
  transferred: number;
  totalCards: number;
  totalAccounts: number;
}

// Initialize dummy data
const initializeDummyData = () => {
  if (!localStorage.getItem('c2c_transactions')) {
    const dummyTransactions: Transaction[] = [
      {
        id: '1',
        amount: 2500,
        status: 'success',
        type: 'Credit to Cash',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'HDFC Credit Card to SBI Account',
      },
      {
        id: '2',
        amount: 5000,
        status: 'success',
        type: 'Credit to Cash',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'ICICI Credit Card to HDFC Account',
      },
      {
        id: '3',
        amount: 1500,
        status: 'pending',
        type: 'Credit to Cash',
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        description: 'Axis Credit Card to PNB Account',
      },
      {
        id: '4',
        amount: 3000,
        status: 'failed',
        type: 'Credit to Cash',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'SBI Credit Card - Insufficient limit',
      },
    ];
    localStorage.setItem('c2c_transactions', JSON.stringify(dummyTransactions));
  }
};

// Get summary
export const getSummary = (): Summary => {
  const cards = getCards();
  const accounts = getAccounts();
  const transactions = getTransactions().filter((t) => t.status === 'success');
  
  const transferred = transactions.reduce((sum, t) => sum + t.amount, 0);
  const availableCredit = cards.reduce((sum, c) => sum + c.availableLimit, 0);
  
  return {
    availableCredit,
    transferred,
    totalCards: cards.length,
    totalAccounts: accounts.length,
  };
};

// Transactions
export const getTransactions = (filter?: 'success' | 'failed' | 'pending'): Transaction[] => {
  initializeDummyData();
  const transactions = JSON.parse(localStorage.getItem('c2c_transactions') || '[]');
  
  if (filter) {
    return transactions.filter((t: Transaction) => t.status === filter);
  }
  
  return transactions;
};

// Credit Cards
export const getCards = (): CreditCard[] => {
  return JSON.parse(localStorage.getItem('c2c_cards') || '[]');
};

export const addCard = (card: Omit<CreditCard, 'id'>): void => {
  const cards = getCards();
  const newCard = {
    ...card,
    id: Date.now().toString(),
  };
  cards.push(newCard);
  localStorage.setItem('c2c_cards', JSON.stringify(cards));
};

// Savings Accounts
export const getAccounts = (): SavingsAccount[] => {
  return JSON.parse(localStorage.getItem('c2c_accounts') || '[]');
};

export const addSavingsAccount = (account: Omit<SavingsAccount, 'id'>): void => {
  const accounts = getAccounts();
  const newAccount = {
    ...account,
    id: Date.now().toString(),
  };
  accounts.push(newAccount);
  localStorage.setItem('c2c_accounts', JSON.stringify(accounts));
};
