const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Skill categories mapping
const skillCategories = {
  'animal_taming': 'taming',
  'archery': 'combat',
  'healing': 'support',
  'swordsmanship': 'combat',
  'stealth': 'stealth',
  'stealing': 'stealth',
  'spirit_speak': 'necromancy',
  'snooping': 'stealth',
  'resisting_spells': 'defense',
  'remove_trap': 'utility',
  'provocation': 'bard',
  'poisoning': 'combat',
  'peacemaking': 'bard',
  'parrying': 'defense',
  'ninjitsu': 'ninja',
  'necromancy': 'necromancy',
  'mysticism': 'mysticism',
  'musicianship': 'entertainment',
  'mining': 'gathering',
  'meditation': 'meditation',
  'lumberjacking': 'gathering',
  'lockpicking': 'utility',
  'item_identification': 'utility',
  'inscription': 'crafting',
  'imbuing': 'crafting',
  'hiding': 'stealth',
  'forensic_evaluation': 'utility',
  'focus': 'meditation',
  'fishing': 'gathering',
  'evaluating_intelligence': 'knowledge',
  'discordance': 'bard',
  'detect_hidden': 'utility',
  'cooking': 'crafting',
  'cartography': 'utility',
  'carpentry': 'crafting',
  'camping': 'survival',
  'bushido': 'samurai',
  'bowcraft_fletching': 'crafting',
  'blacksmithy': 'crafting',
  'begging': 'social',
  'arms_lore': 'knowledge',
  'animal_lore': 'taming',
  'anatomy': 'knowledge',
  'alchemy': 'crafting',
  'chivalry': 'paladin',
  'tracking': 'utility',
  'tinkering': 'crafting',
  'tailoring': 'crafting',
  'tactics': 'combat',
  'throwing': 'combat',
  'veterinary': 'taming',
  'herding': 'taming'
};

// Difficulty levels mapping
const skillDifficulties = {
  'animal_taming': 4,
  'archery': 2,
  'healing': 1,
  'swordsmanship': 2,
  'stealth': 2,
  'stealing': 4,
  'spirit_speak': 3,
  'snooping': 3,
  'resisting_spells': 2,
  'remove_trap': 3,
  'provocation': 4,
  'poisoning': 3,
  'peacemaking': 3,
  'parrying': 2,
  'ninjitsu': 4,
  'necromancy': 4,
  'mysticism': 3,
  'musicianship': 1,
  'mining': 1,
  'meditation': 1,
  'lumberjacking': 1,
  'lockpicking': 2,
  'item_identification': 1,
  'inscription': 2,
  'imbuing': 4,
  'hiding': 2,
  'forensic_evaluation': 3,
  'focus': 1,
  'fishing': 1,
  'evaluating_intelligence': 2,
  'discordance': 3,
  'detect_hidden': 2,
  'cooking': 1,
  'cartography': 2,
  'carpentry': 2,
  'camping': 1,
  'bushido': 3,
  'bowcraft_fletching': 2,
  'blacksmithy': 2,
  'begging': 1,
  'arms_lore': 1,
  'animal_lore': 1,
  'anatomy': 1,
  'alchemy': 2,
  'chivalry': 3,
  'tracking': 2,
  'tinkering': 2,
  'tailoring': 2,
  'tactics': 1,
  'throwing': 2,
  'veterinary': 2,
  'herding': 2
};

function parseHtmlContent(htmlContent) {
  // Remove the h1 title since we'll use the filename
  const content = htmlContent.replace(/<h1>.*?<\/h1>\s*/, '');
  
  // Split content into sections
  const sections = {
    overview: '',
    training_guide: '',
    skill_bonuses: '',
    recommended_template: '',
    advanced_notes: ''
  };

  // Extract overview (first paragraph after title)
  const overviewMatch = content.match(/<p><strong>Overview:<\/strong><br>\s*(.*?)<\/p>/s);
  if (overviewMatch) {
    sections.overview = overviewMatch[1];
  }

  // Extract training guide
  const trainingMatch = content.match(/<h2>Training.*?<\/h2>\s*(.*?)(?=<h2>|$)/s);
  if (trainingMatch) {
    sections.training_guide = trainingMatch[1];
  }

  // Extract skill bonuses
  const bonusesMatch = content.match(/<h2>Skill Bonuses<\/h2>\s*(.*?)(?=<h2>|$)/s);
  if (bonusesMatch) {
    sections.skill_bonuses = bonusesMatch[1];
  }

  // Extract recommended template
  const templateMatch = content.match(/<h2>Recommended Template<\/h2>\s*(.*?)(?=<h2>|$)/s);
  if (templateMatch) {
    sections.recommended_template = templateMatch[1];
  }

  // Extract advanced notes
  const advancedMatch = content.match(/<h2>Advanced Notes<\/h2>\s*(.*?)(?=<h2>|$)/s);
  if (advancedMatch) {
    sections.advanced_notes = advancedMatch[1];
  }

  // Extract training ranges from tables
  const trainingRanges = [];
  const tableMatch = content.match(/<table[^>]*>(.*?)<\/table>/s);
  if (tableMatch) {
    const tableContent = tableMatch[1];
    const rowMatches = tableContent.match(/<tr[^>]*>(.*?)<\/tr>/gs);
    if (rowMatches) {
      // Skip header row
      for (let i = 1; i < rowMatches.length; i++) {
        const row = rowMatches[i];
        const cellMatches = row.match(/<td[^>]*>(.*?)<\/td>/gs);
        if (cellMatches && cellMatches.length >= 2) {
          const skillRange = cellMatches[0].replace(/<[^>]*>/g, '').trim();
          const suggestedTargets = cellMatches[1].replace(/<[^>]*>/g, '').trim();
          
          if (skillRange && suggestedTargets) {
            trainingRanges.push({
              skill_range: skillRange,
              suggested_targets: suggestedTargets,
              training_notes: ''
            });
          }
        }
      }
    }
  }

  return { ...sections, training_ranges: trainingRanges };
}

function getSkillNameFromFilename(filename) {
  // Convert filename to proper skill name
  const nameMap = {
    'animal_taming': 'Animal Taming',
    'archery': 'Archery',
    'healing': 'Healing',
    'swordsmanship': 'Swordsmanship',
    'stealth': 'Stealth',
    'stealing': 'Stealing',
    'spirit_speak': 'Spirit Speak',
    'snooping': 'Snooping',
    'resisting_spells': 'Resisting Spells',
    'remove_trap': 'Remove Trap',
    'provocation': 'Provocation',
    'poisoning': 'Poisoning',
    'peacemaking': 'Peacemaking',
    'parrying': 'Parrying',
    'ninjitsu': 'Ninjitsu',
    'necromancy': 'Necromancy',
    'mysticism': 'Mysticism',
    'musicianship': 'Musicianship',
    'mining': 'Mining',
    'meditation': 'Meditation',
    'lumberjacking': 'Lumberjacking',
    'lockpicking': 'Lockpicking',
    'item_identification': 'Item Identification',
    'inscription': 'Inscription',
    'imbuing': 'Imbuing',
    'hiding': 'Hiding',
    'forensic_evaluation': 'Forensic Evaluation',
    'focus': 'Focus',
    'fishing': 'Fishing',
    'evaluating_intelligence': 'Evaluating Intelligence',
    'discordance': 'Discordance',
    'detect_hidden': 'Detect Hidden',
    'cooking': 'Cooking',
    'cartography': 'Cartography',
    'carpentry': 'Carpentry',
    'camping': 'Camping',
    'bushido': 'Bushido',
    'bowcraft_fletching': 'Bowcraft/Fletching',
    'blacksmithy': 'Blacksmithy',
    'begging': 'Begging',
    'arms_lore': 'Arms Lore',
    'animal_lore': 'Animal Lore',
    'anatomy': 'Anatomy',
    'alchemy': 'Alchemy',
    'chivalry': 'Chivalry',
    'tracking': 'Tracking',
    'tinkering': 'Tinkering',
    'tailoring': 'Tailoring',
    'tactics': 'Tactics',
    'throwing': 'Throwing',
    'veterinary': 'Veterinary',
    'herding': 'Herding'
  };

  const baseName = path.basename(filename, '.html');
  return nameMap[baseName] || baseName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function importSkills() {
  const skillsDir = path.join(__dirname, '..', 'public', 'skills');
  
  try {
    const files = fs.readdirSync(skillsDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    console.log(`Found ${htmlFiles.length} HTML skill files`);

    for (const file of htmlFiles) {
      const filePath = path.join(skillsDir, file);
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      
      const baseName = path.basename(file, '.html');
      const skillName = getSkillNameFromFilename(file);
      const slug = baseName.replace(/_/g, '-');
      const category = skillCategories[baseName] || 'general';
      const difficulty = skillDifficulties[baseName] || 1;

      console.log(`Processing ${skillName}...`);

      const { overview, training_guide, skill_bonuses, recommended_template, advanced_notes, training_ranges } = parseHtmlContent(htmlContent);

      // Insert or update skill
      const skillResult = await pool.query(`
        INSERT INTO skills (
          name, slug, description, overview, training_guide, skill_bonuses,
          recommended_template, advanced_notes, category, difficulty_level,
          is_active, sort_order, meta_title, meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          overview = EXCLUDED.overview,
          training_guide = EXCLUDED.training_guide,
          skill_bonuses = EXCLUDED.skill_bonuses,
          recommended_template = EXCLUDED.recommended_template,
          advanced_notes = EXCLUDED.advanced_notes,
          category = EXCLUDED.category,
          difficulty_level = EXCLUDED.difficulty_level,
          updated_at = NOW()
        RETURNING id
      `, [
        skillName,
        slug,
        overview.substring(0, 500), // Truncate description
        overview,
        training_guide,
        skill_bonuses,
        recommended_template,
        advanced_notes,
        category,
        difficulty,
        true,
        0,
        `${skillName} Skill Guide`,
        `Complete guide to training ${skillName} in Ultima Online`
      ]);

      const skillId = skillResult.rows[0].id;

      // Insert training ranges
      if (training_ranges.length > 0) {
        // Delete existing training ranges
        await pool.query('DELETE FROM skill_training_ranges WHERE skill_id = $1', [skillId]);

        // Insert new training ranges
        for (let i = 0; i < training_ranges.length; i++) {
          const range = training_ranges[i];
          await pool.query(`
            INSERT INTO skill_training_ranges (
              skill_id, skill_range, suggested_targets, training_notes, sort_order
            ) VALUES ($1, $2, $3, $4, $5)
          `, [skillId, range.skill_range, range.suggested_targets, range.training_notes, i]);
        }
      }

      console.log(`✓ Imported ${skillName} with ${training_ranges.length} training ranges`);
    }

    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error importing skills:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
importSkills();
