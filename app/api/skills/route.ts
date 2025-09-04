import { NextRequest, NextResponse } from 'next/server';
import { getSkills, getSkillCategories } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const filters: any = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = parseInt(difficulty);
    if (search) filters.search = search;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const skills = await getSkills(filters);
    const categories = await getSkillCategories();

    return NextResponse.json({
      success: true,
      data: {
        skills,
        categories
      }
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
