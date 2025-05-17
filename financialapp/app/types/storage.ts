import { FinanceState, Transaction, Category } from '../types';

const STORAGE_KEY = 'finance-tracker-data';

// Default categories to start with
const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#4CAF50' },
  { id: '2', name: 'Freelance', type: 'income', color: '#8BC34A' },
  { id: '3', name: 'Investments', type: 'income', color: '#CDDC39' },
  { id: '4', name: 'Housing', type: 'expense', color: '#F44336' },
  { id: '5', name: 'Food', type: 'expense', color: '#FF9800' },
  { id: '6', name: 'Transportation', type: 'expense', color: '#2196F3' },
  { id: '7', name: 'Entertainment', type: 'expense', color: '#9C27B0' },
  { id: '8', name: 'Utilities', type: 'expense', color: '#607D8B' },
];

// Initial state
const initialState: FinanceState = {
  transactions: [],
  categories: defaultCategories,
};

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Load data from local storage
export const loadFinanceData = (): FinanceState => {
  if (!isBrowser) return initialState;
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading finance data from localStorage:', error);
  }
  
  // If no data found or error occurred, return initial state
  return initialState;
};

// Save data to local storage
export const saveFinanceData = (data: FinanceState): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving finance data to localStorage:', error);
  }
};

// Add a new transaction
export const addTransaction = (transaction: Transaction): void => {
  const data = loadFinanceData();
  data.transactions.push(transaction);
  saveFinanceData(data);
};

// Update an existing transaction
export const updateTransaction = (transaction: Transaction): void => {
  const data = loadFinanceData();
  const index = data.transactions.findIndex(t => t.id === transaction.id);
  
  if (index !== -1) {
    data.transactions[index] = transaction;
    saveFinanceData(data);
  }
};

// Delete a transaction
export const deleteTransaction = (id: string): void => {
  const data = loadFinanceData();
  data.transactions = data.transactions.filter(t => t.id !== id);
  saveFinanceData(data);
};

// Add a new category
export const addCategory = (category: Category): void => {
  const data = loadFinanceData();
  data.categories.push(category);
  saveFinanceData(data);
};

// Update an existing category
export const updateCategory = (category: Category): void => {
  const data = loadFinanceData();
  const index = data.categories.findIndex(c => c.id === category.id);
  
  if (index !== -1) {
    data.categories[index] = category;
    saveFinanceData(data);
  }
};

// Delete a category (only if no transactions use it)
export const deleteCategory = (id: string): boolean => {
  const data = loadFinanceData();
  
  // Check if any transaction uses this category
  const usedInTransaction = data.transactions.some(t => t.categoryId === id);
  
  if (usedInTransaction) {
    return false; // Cannot delete a category that's in use
  }
  
  data.categories = data.categories.filter(c => c.id !== id);
  saveFinanceData(data);
  return true;
};

// Clear all data (for testing or reset functionality)
export const clearAllData = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
};