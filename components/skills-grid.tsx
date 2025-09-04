'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: number;
  training_range_count: number;
}

interface SkillsGridProps {
  skills: Skill[];
}

const difficultyLabels = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Expert'
};

const difficultyColors = {
  1: 'bg-green-500',
  2: 'bg-yellow-500',
  3: 'bg-orange-500',
  4: 'bg-red-500',
  5: 'bg-purple-500'
};

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Get unique categories
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || skill.difficulty_level.toString() === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-amber-500 focus:ring-amber-500">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-amber-500 focus:ring-amber-500">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {Object.entries(difficultyLabels).map(([level, label]) => (
              <SelectItem key={level} value={level}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-gray-600 mb-6">
        Showing {filteredSkills.length} of {skills.length} skills
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSkills.map((skill) => (
          <Link key={skill.id} href={`/skills/${skill.slug}`}>
            <Card className="bg-white border-gray-200 hover:border-amber-500 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-gray-900 group-hover:text-amber-600 transition-colors">
                    {skill.name}
                  </CardTitle>
                  <Badge 
                    className={`${difficultyColors[skill.difficulty_level as keyof typeof difficultyColors]} text-white text-xs`}
                  >
                    {difficultyLabels[skill.difficulty_level as keyof typeof difficultyLabels]}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-gray-600 border-gray-400 w-fit">
                  {skill.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {skill.description}
                </CardDescription>
                <div className="mt-3 text-sm text-gray-500">
                  {skill.training_range_count} training ranges
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg">No skills found matching your criteria.</div>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            variant="outline"
            className="mt-4 border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
