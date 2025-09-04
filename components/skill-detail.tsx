'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TrainingRange {
  id: string;
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
  training_ranges: TrainingRange[];
}

interface SkillDetailProps {
  skill: Skill;
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

export default function SkillDetail({ skill }: SkillDetailProps) {
  const renderHtmlContent = (content: string) => {
    if (!content) return null;
    
    // Convert HTML to JSX safely
    const createMarkup = () => ({ __html: content });
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {skill.name}
          </h1>
          <Badge 
            className={`${difficultyColors[skill.difficulty_level as keyof typeof difficultyColors]} text-white text-sm px-3 py-1`}
          >
            {difficultyLabels[skill.difficulty_level as keyof typeof difficultyLabels]}
          </Badge>
        </div>
        <Badge variant="outline" className="text-gray-400 border-gray-600 mb-6">
          {skill.category}
        </Badge>
        {skill.description && (
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {skill.description}
          </p>
        )}
      </div>

      {/* Overview */}
      {skill.overview && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {renderHtmlContent(skill.overview)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Guide */}
      {skill.training_guide && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Training Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {renderHtmlContent(skill.training_guide)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Ranges */}
      {skill.training_ranges && skill.training_ranges.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Training Ranges</CardTitle>
            <CardDescription className="text-gray-400">
              Recommended training targets for different skill levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skill.training_ranges.map((range, index) => (
                <div key={range.id} className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      {range.skill_range}
                    </h4>
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      Range {index + 1}
                    </Badge>
                  </div>
                  <div className="text-gray-300 mb-2">
                    <strong className="text-white">Targets:</strong> {range.suggested_targets}
                  </div>
                  {range.training_notes && (
                    <div className="text-gray-400 text-sm">
                      <strong className="text-gray-300">Notes:</strong> {range.training_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Bonuses */}
      {skill.skill_bonuses && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Skill Bonuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {renderHtmlContent(skill.skill_bonuses)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Template */}
      {skill.recommended_template && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recommended Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {renderHtmlContent(skill.recommended_template)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Notes */}
      {skill.advanced_notes && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Advanced Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 prose prose-invert max-w-none">
              {renderHtmlContent(skill.advanced_notes)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
