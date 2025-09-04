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
      <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
          className={activeCategory === 'all' 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
          }
        >
          All Skills
          <Badge variant="secondary" className="ml-2 bg-slate-600 text-white">
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
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
            }
          >
            {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
            <Badge variant="secondary" className="ml-2 bg-slate-600 text-white">
              {category.skill_count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
