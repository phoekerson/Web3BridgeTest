'use client';

import { FinanceSummary } from '../../types';
import { formatCurrency } from '../../types/utils';

interface SummaryProps {
  summary: FinanceSummary;
}

export default function Summary({ summary }: SummaryProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Summary */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Total Income</h3>
            <span className="text-green-600 text-lg font-semibold">
              {formatCurrency(summary.totalIncome)}
            </span>
          </div>
          
          <div className="space-y-2">
            {summary.topIncomeCategories.map(category => (
              <div key={category.categoryId} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm">{category.categoryName}</span>
                </div>
                <span className="text-sm">{formatCurrency(category.total)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Expense Summary */}
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Total Expenses</h3>
            <span className="text-red-600 text-lg font-semibold">
              {formatCurrency(summary.totalExpenses)}
            </span>
          </div>
          
          <div className="space-y-2">
            {summary.topExpenseCategories.map(category => (
              <div key={category.categoryId} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm">{category.categoryName}</span>
                </div>
                <span className="text-sm">{formatCurrency(category.total)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Balance Summary */}
        <div className={`${summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'} p-4 rounded-lg`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Balance</h3>
            <span className={`${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'} text-lg font-semibold`}>
              {formatCurrency(summary.balance)}
            </span>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (summary.totalIncome / (summary.totalExpenses || 1)) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Income vs Expenses</span>
              <span>
                {summary.totalExpenses > 0 
                  ? `${Math.round((summary.totalIncome / summary.totalExpenses) * 100)}%` 
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}