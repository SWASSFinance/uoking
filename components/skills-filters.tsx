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
      <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
          className={activeCategory === 'all' 
            ? 'bg-amber-600 hover:bg-amber-700 text-white' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }
        >
          All Skills
          <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">
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
              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
            <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">
              {category.skill_count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
