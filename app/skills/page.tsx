import { Metadata } from 'next';
import { getSkills, getSkillCategories } from '@/lib/db';
import SkillsGrid from '@/components/skills-grid';
import SkillsFilters from '@/components/skills-filters';

export const metadata: Metadata = {
  title: 'Ultima Online Skills Guide | UO King',
  description: 'Complete guide to all Ultima Online skills including training methods, tips, and recommended templates.',
  keywords: 'ultima online, skills, training, guide, UO, mmorpg',
};

export default async function SkillsPage() {
  const [skills, categories] = await Promise.all([
    getSkills(),
    getSkillCategories()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Ultima Online
            </span>
            <br />
            <span className="text-white">Skills Guide</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master every skill in Britannia with our comprehensive training guides, 
            tips, and recommended templates for all character builds.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SkillsFilters categories={categories} />
        </div>

        {/* Skills Grid */}
        <SkillsGrid skills={skills} />
      </div>
    </div>
  );
}
