'use client';

import { useState } from 'react';
import { Transaction, Category } from '../../types';
import { formatDate, formatCurrency, getCategoryById } from '../../types/utils';
import { deleteTransaction } from '../../types/storage';
import TransactionForm from './TransactionForms';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onRefresh: () => void;
}

export default function TransactionList({ 
  transactions, 
  categories, 
  onRefresh 
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group transactions by date
  const transactionsByDate: Record<string, Transaction[]> = {};
  
  sortedTransactions.forEach(transaction => {
    if (!transactionsByDate[transaction.date]) {
      transactionsByDate[transaction.date] = [];
    }
    transactionsByDate[transaction.date].push(transaction);
  });
  
  // Get dates in order (newest first)
  const dates = Object.keys(transactionsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Handle edit transaction
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };
  
  // Handle delete transaction
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      onRefresh();
    }
  };
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found. Add a new transaction to get started.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {dates.map(date => (
        <div key={date} className="space-y-2">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">
              {formatDate(date)}
            </h3>
            <div className="ml-2 flex-grow border-b border-gray-200"></div>
          </div>
          
          <div className="space-y-1">
            {transactionsByDate[date].map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={getCategoryById(categories, transaction.categoryId)}
                onEdit={() => handleEdit(transaction)}
                onDelete={() => handleDelete(transaction.id)}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Edit Transaction Modal */}
      {showEditModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
            <TransactionForm 
              categories={categories}
              editTransaction={editingTransaction}
              onComplete={() => {
                onRefresh();
                setShowEditModal(false);
                setEditingTransaction(null);
              }}
              onCancel={() => {
                setShowEditModal(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}