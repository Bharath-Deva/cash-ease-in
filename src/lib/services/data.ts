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

// Transfer money from credit card to savings account
export const transferMoney = (cardId: string, accountId: string, amount: number): Transaction => {
  const cards = getCards();
  const accounts = getAccounts();
  const transactions = getTransactions();
  
  const card = cards.find(c => c.id === cardId);
  const account = accounts.find(a => a.id === accountId);
  
  if (!card || !account) {
    throw new Error('Card or account not found');
  }
  
  // Random status: 60% success, 25% pending, 15% failed
  const random = Math.random();
  let status: 'success' | 'pending' | 'failed';
  if (random < 0.6) {
    status = 'success';
  } else if (random < 0.85) {
    status = 'pending';
  } else {
    status = 'failed';
  }
  
  const newTransaction: Transaction = {
    id: `txn_${Date.now()}`,
    date: new Date().toISOString(),
    amount: amount,
    status: status,
    type: 'Credit to Cash',
    description: `${card.bankName} (••${card.cardNumber.slice(-4)}) to ${account.bankName}`,
  };
  
  transactions.unshift(newTransaction); // Add to beginning
  localStorage.setItem('c2c_transactions', JSON.stringify(transactions));
  
  return newTransaction;
};
