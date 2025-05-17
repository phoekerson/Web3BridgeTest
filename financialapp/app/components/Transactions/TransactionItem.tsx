'use client';

import { Transaction, Category } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionItem({ 
  transaction, 
  category, 
  onEdit, 
  onDelete 
}: TransactionItemProps) {
  // Default category color if not found
  const categoryColor = category?.color || (
    transaction.type === 'income' ? '#4CAF50' : '#F44336'
  );
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Category color indicator */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: categoryColor }}
          >
            <span className="text-xs font-medium">
              {category?.name?.substring(0, 2).toUpperCase() || '--'}
            </span>
          </div>
          
          {/* Transaction details */}
          <div>
            <div className="font-medium">
              {category?.name || 'Uncategorized'}
            </div>
            {transaction.notes && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {transaction.notes}
              </div>
            )}
          </div>
        </div>
        
        {/* Amount */}
        <div className="text-right">
          <div className={`font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-2 flex justify-end space-x-2">
        <button 
          onClick={onEdit}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
        <button 
          onClick={onDelete}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}