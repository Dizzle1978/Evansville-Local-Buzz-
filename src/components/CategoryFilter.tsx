import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  countsByCategory: Record<CategoryId, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  countsByCategory,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <div className="hidden lg:flex items-center gap-1 text-xs text-stone-500 mr-1 shrink-0">
        <Layers className="w-3.5 h-3.5" />
        <span className="font-medium">Filter:</span>
      </div>

      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        const count = countsByCategory[category.id] || 0;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              isSelected
                ? 'bg-amber-800 text-white shadow-sm'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <span>{category.label}</span>
            <span
              className={`text-[10px] font-mono px-1 rounded ${
                isSelected ? 'bg-amber-900 text-amber-100' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
