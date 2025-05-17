// Utility functions for the finance tracker

import { Transaction, Category, TransactionFilters, FinanceSummary, CategorySummary } from '../types';

// Generate a new unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date to YYYY-MM-DD for inputs
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date to a more readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Format amount as currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Filter transactions based on given filters
export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter(transaction => {
    // Filter by date range
    if (filters.startDate && transaction.date < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && transaction.date > filters.endDate) {
      return false;
    }
    
    // Filter by transaction type
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by category
    if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Filter by amount range
    if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
      return false;
    }
    
    if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
      return false;
    }
    
    // Filter by search term (in notes)
    if (filters.searchTerm && 
        !(transaction.notes?.toLowerCase().includes(filters.searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
};

// Calculate finance summary
export const calculateSummary = (
  transactions: Transaction[],
  categories: Category[]
): FinanceSummary => {
  // Initialize summary
  const summary: FinanceSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    topIncomeCategories: [],
    topExpenseCategories: []
  };
  
  // Category totals
  const categoryTotals: Record<string, number> = {};
  
  // Calculate totals
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpenses += transaction.amount;
    }
    
    // Add to category total
    if (!categoryTotals[transaction.categoryId]) {
      categoryTotals[transaction.categoryId] = 0;
    }
    categoryTotals[transaction.categoryId] += transaction.amount;
  });
  
  // Calculate balance
  summary.balance = summary.totalIncome - summary.totalExpenses;
  
  // Calculate top categories
  const incomeCategorySummaries: CategorySummary[] = [];
  const expenseCategorySummaries: CategorySummary[] = [];
  
  categories.forEach(category => {
    const total = categoryTotals[category.id] || 0;
    if (total === 0) return;
    
    const percentage = category.type === 'income'
      ? (total / summary.totalIncome) * 100
      : (total / summary.totalExpenses) * 100;
    
    const categorySummary: CategorySummary = {
      categoryId: category.id,
      categoryName: category.name,
      total,
      percentage,
      color: category.color
    };
    
    if (category.type === 'income') {
      incomeCategorySummaries.push(categorySummary);
    } else {
      expenseCategorySummaries.push(categorySummary);
    }
  });
  
  // Sort and get top categories
  summary.topIncomeCategories = incomeCategorySummaries
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
    
  summary.topExpenseCategories = expenseCategorySummaries
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  
  return summary;
};

// Get current month transactions
export const getCurrentMonthTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  return filterTransactions(transactions, {
    startDate: firstDay,
    endDate: lastDay
  });
};

// Group transactions by date
export const groupTransactionsByDate = (
  transactions: Transaction[]
): Record<string, Transaction[]> => {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  
  return grouped;
};

// Get category by ID
export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

// Generate random color for new categories
export const generateRandomColor = (): string => {
  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};