import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/skills" className="hover:text-white transition-colors">
              Skills
            </Link>
            <span>/</span>
            <span className="text-white">{skill.name}</span>
          </div>
        </nav>

        {/* Skill Detail */}
        <SkillDetail skill={skill} />
      </div>
    </div>
  );
}
