'use client';

import { useState } from 'react';
import { Category, Transaction } from '../../types';
import { addTransaction } from '../../types/storage';
import { generateId, formatDateForInput } from '../../types/utils';

interface TransactionFormProps {
  categories: Category[];
  editTransaction?: Transaction;
  onComplete: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ 
  categories, 
  editTransaction, 
  onComplete, 
  onCancel 
}: TransactionFormProps) {
  // Set initial values based on whether we're editing or creating
  const [type, setType] = useState<'income' | 'expense'>(
    editTransaction?.type || 'expense'
  );
  const [amount, setAmount] = useState(
    editTransaction?.amount.toString() || ''
  );
  const [date, setDate] = useState(
    editTransaction?.date || formatDateForInput(new Date())
  );
  const [categoryId, setCategoryId] = useState(
    editTransaction?.categoryId || ''
  );
  const [notes, setNotes] = useState(
    editTransaction?.notes || ''
  );
  
  // Filter categories based on the selected type
  const filteredCategories = categories.filter(category => category.type === type);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !date || !categoryId) {
      alert('Please fill out all required fields');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const transactionData: Transaction = {
      id: editTransaction?.id || generateId(),
      type,
      amount: parsedAmount,
      date,
      categoryId,
      notes,
      createdAt: editTransaction?.createdAt || new Date().toISOString()
    };
    
    try {
      // Use updateTransaction if editing, otherwise addTransaction
      addTransaction(transactionData);
      onComplete();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type */}
      <div>
        <label className="form-label">Transaction Type</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === 'expense'}
              onChange={() => setType('expense')}
              className="mr-2"
            />
            Expense
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === 'income'}
              onChange={() => setType('income')}
              className="mr-2"
            />
            Income
          </label>
        </div>
      </div>
      
      {/* Amount */}
      <div>
        <label htmlFor="amount" className="form-label">Amount</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input pl-7"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>
      
      {/* Date */}
      <div>
        <label htmlFor="date" className="form-label">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-input"
          required
        />
      </div>
      
      {/* Category */}
      <div>
        <label htmlFor="category" className="form-label">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select a category</option>
          {filteredCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        {filteredCategories.length === 0 && (
          <p className="text-sm text-red-600 mt-1">
            No {type} categories available. Please create one first.
          </p>
        )}
      </div>
      
      {/* Notes */}
      <div>
        <label htmlFor="notes" className="form-label">Notes (Optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-input"
          rows={3}
          placeholder="Add notes about this transaction"
        ></textarea>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn ${type === 'income' ? 'btn-success' : 'btn-primary'}`}
        >
          {editTransaction ? 'Update' : 'Save'} Transaction
        </button>
      </div>
    </form>
  );
}