import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSkillBySlug, getSkills } from '@/lib/db';
import SkillDetail from '@/components/skill-detail';
import Link from 'next/link';

interface SkillPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug);
  
  if (!skill) {
    return {
      title: 'Skill Not Found | UO King',
    };
  }

  return {
    title: `${skill.name} Skill Guide | UO King`,
    description: skill.meta_description || skill.description || `Complete guide to training ${skill.name} in Ultima Online.`,
    keywords: `ultima online, ${skill.name}, skill, training, guide, UO, ${skill.category}`,
    openGraph: {
      title: `${skill.name} Skill Guide | UO King`,
      description: skill.meta_description || skill.description || `Complete guide to training ${skill.name} in Ultima Online.`,
      url: `https://www.uoking.com/skills/${params.slug}`,
      siteName: 'UO King',
      type: 'article',
      images: [
        {
          url: '/uo-king-logo.png',
          width: 1200,
          height: 630,
          alt: `${skill.name} Skill Guide - UO King`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${skill.name} Skill Guide | UO King`,
      description: skill.meta_description || skill.description || `Complete guide to training ${skill.name} in Ultima Online.`,
      images: ['/uo-king-logo.png'],
    },
  };
}

export async function generateStaticParams() {
  const skills = await getSkills();
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}

export default async function SkillPage({ params }: SkillPageProps) {
  const skill = await getSkillBySlug(params.slug);

  if (!skill) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/skills" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Skills
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">{skill.name}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkillDetail skill={skill} />
      </main>

      <Footer />
    </div>
  );
}
