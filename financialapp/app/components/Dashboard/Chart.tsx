'use client';

import { useState } from 'react';
import { Transaction, Category } from '../../types';
import { formatCurrency } from '../../types/utils';

interface ChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function Chart({ transactions, categories }: ChartProps) {
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');
  
  // Prepare data for the chart
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');
  
  const categoryTotals: Record<string, number> = {};
  
  // Calculate totals by category
  transactions.forEach(transaction => {
    if (!categoryTotals[transaction.categoryId]) {
      categoryTotals[transaction.categoryId] = 0;
    }
    categoryTotals[transaction.categoryId] += transaction.amount;
  });
  
  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Prepare the chart data
  const displayCategories = chartType === 'expense' ? expenseCategories : incomeCategories;
  const total = chartType === 'expense' ? totalExpense : totalIncome;
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Distribution</h2>
        
        <div className="inline-flex rounded-md">
          <button
            className={`px-4 py-1 text-sm font-medium rounded-l-md ${
              chartType === 'expense' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setChartType('expense')}
          >
            Expenses
          </button>
          <button
            className={`px-4 py-1 text-sm font-medium rounded-r-md ${
              chartType === 'income' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setChartType('income')}
          >
            Income
          </button>
        </div>
      </div>
      
      {/* SVG Pie Chart */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2">
          <svg viewBox="0 0 100 100" className="w-full max-w-xs mx-auto">
            {displayCategories.map((category, index) => {
              const amount = categoryTotals[category.id] || 0;
              if (amount === 0) return null;
              
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              
              // Calculate the pie chart segments
              let startAngle = 0;
              let endAngle = 0;
              
              // Find the starting angle by summing up previous percentages
              for (let i = 0; i < index; i++) {
                const prevCat = displayCategories[i];
                const prevAmount = categoryTotals[prevCat.id] || 0;
                const prevPercentage = total > 0 ? (prevAmount / total) * 100 : 0;
                startAngle += (prevPercentage / 100) * 360;
              }
              
              endAngle = startAngle + (percentage / 100) * 360;
              
              // Convert angles to radians for SVG path
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Determine if the arc should use the large-arc-flag
              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
              
              return (
                <path
                  key={category.id}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={category.color}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
            })}
            {/* Center circle for donut effect */}
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
        </div>
        
        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <h3 className="text-lg font-medium mb-2">
            {chartType === 'expense' ? 'Expense Categories' : 'Income Categories'}
          </h3>
          
          <div className="space-y-3">
            {displayCategories.map(category => {
              const amount = categoryTotals[category.id] || 0;
              if (amount === 0) return null;
              
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(amount)}</div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}