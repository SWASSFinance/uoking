'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface TrainingRange {
  id?: string;
  skill_range: string;
  suggested_targets: string;
  training_notes?: string;
}

interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  overview: string;
  training_guide: string;
  skill_bonuses: string;
  recommended_template: string;
  advanced_notes: string;
  category: string;
  difficulty_level: number;
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  training_ranges?: TrainingRange[];
}

const categories = [
  'combat', 'magic', 'taming', 'crafting', 'gathering', 'utility', 
  'stealth', 'bard', 'necromancy', 'paladin', 'samurai', 'ninja', 
  'mysticism', 'meditation', 'knowledge', 'defense', 'support', 
  'entertainment', 'social', 'survival', 'general'
];

const difficultyLevels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Easy' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'Hard' },
  { value: 5, label: 'Expert' }
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    slug: '',
    description: '',
    overview: '',
    training_guide: '',
    skill_bonuses: '',
    recommended_template: '',
    advanced_notes: '',
    category: 'general',
    difficulty_level: 1,
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    training_ranges: []
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      const data = await response.json();
      if (data.success) {
        setSkills(data.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSkill ? `/api/admin/skills/${editingSkill.id}` : '/api/admin/skills';
      const method = editingSkill ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSkills();
        setIsDialogOpen(false);
        setEditingSkill(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchSkills();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      overview: '',
      training_guide: '',
      skill_bonuses: '',
      recommended_template: '',
      advanced_notes: '',
      category: 'general',
      difficulty_level: 1,
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
      training_ranges: []
    });
  };

  const addTrainingRange = () => {
    setFormData(prev => ({
      ...prev,
      training_ranges: [
        ...(prev.training_ranges || []),
        { skill_range: '', suggested_targets: '', training_notes: '' }
      ]
    }));
  };

  const updateTrainingRange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      training_ranges: prev.training_ranges?.map((range, i) => 
        i === index ? { ...range, [field]: value } : range
      ) || []
    }));
  };

  const removeTrainingRange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      training_ranges: prev.training_ranges?.filter((_, i) => i !== index) || []
    }));
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingSkill(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </DialogTitle>
              <DialogDescription>
                {editingSkill ? 'Update the skill information' : 'Create a new skill guide'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty_level?.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div>
                <Label htmlFor="overview">Overview (HTML)</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="training_guide">Training Guide (HTML)</Label>
                <Textarea
                  id="training_guide"
                  value={formData.training_guide}
                  onChange={(e) => setFormData(prev => ({ ...prev, training_guide: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="skill_bonuses">Skill Bonuses (HTML)</Label>
                <Textarea
                  id="skill_bonuses"
                  value={formData.skill_bonuses}
                  onChange={(e) => setFormData(prev => ({ ...prev, skill_bonuses: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="recommended_template">Recommended Template (HTML)</Label>
                <Textarea
                  id="recommended_template"
                  value={formData.recommended_template}
                  onChange={(e) => setFormData(prev => ({ ...prev, recommended_template: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="advanced_notes">Advanced Notes (HTML)</Label>
                <Textarea
                  id="advanced_notes"
                  value={formData.advanced_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, advanced_notes: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Training Ranges */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Training Ranges</Label>
                  <Button type="button" onClick={addTrainingRange} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Range
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.training_ranges?.map((range, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Training Range {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTrainingRange(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Skill Range</Label>
                          <Input
                            value={range.skill_range}
                            onChange={(e) => updateTrainingRange(index, 'skill_range', e.target.value)}
                            placeholder="e.g., 0.0 - 30.0"
                          />
                        </div>
                        <div>
                          <Label>Suggested Targets</Label>
                          <Input
                            value={range.suggested_targets}
                            onChange={(e) => updateTrainingRange(index, 'suggested_targets', e.target.value)}
                            placeholder="e.g., Rabbits, Cats, Dogs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Training Notes</Label>
                        <Textarea
                          value={range.training_notes || ''}
                          onChange={(e) => updateTrainingRange(index, 'training_notes', e.target.value)}
                          placeholder="Additional training tips..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSkill ? 'Update Skill' : 'Create Skill'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
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
      </div>

      {/* Skills List */}
      <div className="grid gap-4">
        {filteredSkills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {skill.name}
                    {!skill.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{skill.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href={`/skills/${skill.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(skill.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Category: <Badge variant="outline">{skill.category}</Badge></span>
                <span>Difficulty: <Badge variant="outline">{difficultyLevels.find(l => l.value === skill.difficulty_level)?.label}</Badge></span>
                <span>Sort: {skill.sort_order}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No skills found matching your criteria.
        </div>
      )}
    </div>
  );
}

