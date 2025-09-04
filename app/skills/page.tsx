import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSkills, getSkillCategories } from '@/lib/db';
import SkillsGrid from '@/components/skills-grid';
import SkillsFilters from '@/components/skills-filters';

export const metadata: Metadata = {
  title: 'Ultima Online Skills Guide | UO King',
  description: 'Complete guide to all Ultima Online skills including training methods, tips, and recommended templates.',
  keywords: 'ultima online, skills, training, guide, UO, mmorpg',
  openGraph: {
    title: 'Ultima Online Skills Guide | UO King',
    description: 'Complete guide to all Ultima Online skills including training methods, tips, and recommended templates.',
    url: 'https://www.uoking.com/skills',
    siteName: 'UO King',
    type: 'website',
    images: [
      {
        url: '/uo-king-logo.png',
        width: 1200,
        height: 630,
        alt: 'Ultima Online Skills Guide - UO King',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultima Online Skills Guide | UO King',
    description: 'Complete guide to all Ultima Online skills including training methods, tips, and recommended templates.',
    images: ['/uo-king-logo.png'],
  },
};

export default async function SkillsPage() {
  const [skills, categories] = await Promise.all([
    getSkills(),
    getSkillCategories()
  ]);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Ultima Online Skills Guide
          </h1>
          <p className="text-xl text-amber-100 dark:text-amber-200 max-w-3xl mx-auto">
            Master every skill in Britannia with our comprehensive training guides, 
            tips, and recommended templates for all character builds.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <SkillsFilters categories={categories} />
        </div>

        {/* Skills Grid */}
        <SkillsGrid skills={skills} />
      </main>

      <Footer />
    </div>
  );
}
