'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Category {
  category: string;
  skill_count: number;
}

interface SkillsFiltersProps {
  categories: Category[];
}

export default function SkillsFilters({ categories }: SkillsFiltersProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
          className={activeCategory === 'all' 
            ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white' 
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        >
          All Skills
          <Badge variant="secondary" className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
            {categories.reduce((sum, cat) => sum + cat.skill_count, 0)}
          </Badge>
        </Button>
        {categories.map((category) => (
          <Button
            key={category.category}
            variant={activeCategory === category.category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category.category)}
            className={activeCategory === category.category 
              ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white' 
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }
          >
            {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
            <Badge variant="secondary" className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              {category.skill_count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
