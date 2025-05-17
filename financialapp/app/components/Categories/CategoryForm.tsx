
'use client';

import { useState } from 'react';
import { Category } from '../../types';
import { addCategory } from '../../types/storage';
import { generateId, generateRandomColor } from '../../types/utils';

interface CategoryFormProps {
  editCategory?: Category;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ 
  editCategory, 
  onComplete, 
  onCancel 
}: CategoryFormProps) {
  // Set initial values based on whether we're editing or creating
  const [name, setName] = useState(editCategory?.name || '');
  const [type, setType] = useState<'income' | 'expense'>(
    editCategory?.type || 'expense'
  );
  const [color, setColor] = useState(
    editCategory?.color || generateRandomColor()
  );
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      alert('Please enter a category name');
      return;
    }
    
    const categoryData: Category = {
      id: editCategory?.id || generateId(),
      name,
      type,
      color
    };
    
    try {
      // Use updateCategory if editing, otherwise addCategory
      addCategory(categoryData);
      onComplete();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };
  
  // Predefined colors for selection
  const colorOptions = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Type */}
      <div>
        <label className="form-label">Category Type</label>
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
      
      {/* Category Name */}
      <div>
        <label htmlFor="name" className="form-label">Category Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="e.g., Groceries, Salary"
          required
        />
      </div>
      
      {/* Color Selection */}
      <div>
        <label className="form-label">Category Color</label>
        <div className="grid grid-cols-8 gap-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-6 h-6 rounded-full ${
                color === colorOption ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>
      
      {/* Preview */}
      <div className="border border-gray-200 rounded p-3 flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <span className="text-xs font-medium">
            {name ? name.substring(0, 2).toUpperCase() : '--'}
          </span>
        </div>
        <div className="font-medium">
          {name || 'Category Preview'}
        </div>
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
          className="btn btn-primary"
        >
          {editCategory ? 'Update' : 'Save'} Category
        </button>
      </div>
    </form>
  );
}