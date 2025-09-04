const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  try {
    console.log('Creating skills tables...');
    
    // Create skills table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        overview TEXT,
        training_guide TEXT,
        skill_bonuses TEXT,
        recommended_template TEXT,
        advanced_notes TEXT,
        category VARCHAR(100) DEFAULT 'general',
        difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Skills table created');

    // Create training ranges table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skill_training_ranges (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        skill_range VARCHAR(50) NOT NULL,
        suggested_targets TEXT NOT NULL,
        training_notes TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Training ranges table created');

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(is_active) WHERE is_active = true');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON skills(sort_order)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skill_training_ranges_skill_id ON skill_training_ranges(skill_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_skill_training_ranges_sort_order ON skill_training_ranges(sort_order)');
    console.log('✅ Indexes created');

    // Insert initial skills data
    const skillsData = [
      ['Animal Taming', 'animal-taming', 'Control wild creatures and powerful beasts for pet-based gameplay', 'taming', 4, 1],
      ['Archery', 'archery', 'Ranged weapon skill using bows and crossbows for safe damage at range', 'combat', 2, 2],
      ['Healing', 'healing', 'Essential support skill for restoring hit points and curing poison', 'support', 1, 3],
      ['Swordsmanship', 'swordsmanship', 'Melee combat skill specializing in sword weapons', 'combat', 2, 4],
      ['Stealth', 'stealth', 'Advanced stealth skill for moving while hidden', 'stealth', 3, 5],
      ['Stealing', 'stealing', 'Skill for taking items from other players and NPCs', 'stealth', 4, 6],
      ['Spirit Speak', 'spirit-speak', 'Necromancy skill for communicating with the dead', 'necromancy', 3, 7],
      ['Snooping', 'snooping', 'Skill for examining other players backpacks', 'stealth', 3, 8],
      ['Resisting Spells', 'resisting-spells', 'Defensive skill that reduces magical damage and effects', 'defense', 2, 9],
      ['Remove Trap', 'remove-trap', 'Skill for safely disarming traps on containers', 'utility', 3, 10],
      ['Provocation', 'provocation', 'Bard skill for making creatures fight each other', 'bard', 4, 11],
      ['Poisoning', 'poisoning', 'Skill for applying poison to weapons and items', 'combat', 3, 12],
      ['Peacemaking', 'peacemaking', 'Bard skill for calming aggressive creatures', 'bard', 3, 13],
      ['Parrying', 'parrying', 'Defensive skill that allows blocking attacks with shields', 'defense', 2, 14],
      ['Ninjitsu', 'ninjitsu', 'Ninja skill for stealth and assassination abilities', 'ninja', 4, 15],
      ['Necromancy', 'necromancy', 'Dark magic skill for summoning undead and curses', 'necromancy', 4, 16],
      ['Mysticism', 'mysticism', 'Gargoyle magic skill for teleportation and protection', 'mysticism', 3, 17],
      ['Musicianship', 'musicianship', 'Skill for playing musical instruments', 'entertainment', 1, 18],
      ['Mining', 'mining', 'Skill for extracting ore and gems from mountains', 'gathering', 1, 19],
      ['Meditation', 'meditation', 'Skill for faster mana regeneration', 'meditation', 1, 20],
      ['Lumberjacking', 'lumberjacking', 'Skill for cutting down trees and gathering wood', 'gathering', 1, 21],
      ['Lockpicking', 'lockpicking', 'Skill for opening locked containers and doors', 'utility', 2, 22],
      ['Item Identification', 'item-identification', 'Skill for identifying magical properties of items', 'utility', 1, 23],
      ['Inscription', 'inscription', 'Skill for creating spell scrolls and magical writings', 'crafting', 2, 24],
      ['Imbuing', 'imbuing', 'Skill for enhancing weapons and armor with magical properties', 'crafting', 4, 25],
      ['Hiding', 'hiding', 'Stealth skill that allows characters to become invisible', 'stealth', 2, 26],
      ['Forensic Evaluation', 'forensic-evaluation', 'Skill for investigating crimes and gathering evidence', 'utility', 3, 27],
      ['Focus', 'focus', 'Meditation skill for mana regeneration and concentration', 'meditation', 1, 28],
      ['Fishing', 'fishing', 'Skill for catching fish and other aquatic creatures', 'gathering', 1, 29],
      ['Evaluating Intelligence', 'evaluating-intelligence', 'Skill for assessing magical item properties', 'knowledge', 2, 30],
      ['Discordance', 'discordance', 'Bard skill for weakening enemy creatures', 'bard', 3, 31],
      ['Detect Hidden', 'detect-hidden', 'Skill for finding hidden players and creatures', 'utility', 2, 32],
      ['Cooking', 'cooking', 'Skill for preparing food and beverages', 'crafting', 1, 33],
      ['Cartography', 'cartography', 'Skill for creating and reading maps', 'utility', 2, 34],
      ['Carpentry', 'carpentry', 'Skill for crafting furniture and wooden items', 'crafting', 2, 35],
      ['Camping', 'camping', 'Skill for creating temporary shelters and fires', 'survival', 1, 36],
      ['Bushido', 'bushido', 'Samurai skill for honor-based combat abilities', 'samurai', 3, 37],
      ['Bowcraft/Fletching', 'bowcraft-fletching', 'Skill for crafting bows, crossbows, and arrows', 'crafting', 2, 38],
      ['Blacksmithy', 'blacksmithy', 'Skill for crafting weapons and armor from metal', 'crafting', 2, 39],
      ['Begging', 'begging', 'Skill for asking NPCs for money and items', 'social', 1, 40],
      ['Arms Lore', 'arms-lore', 'Knowledge skill for understanding weapon statistics', 'knowledge', 1, 41],
      ['Animal Lore', 'animal-lore', 'Knowledge skill for understanding animal statistics and abilities', 'taming', 1, 42],
      ['Anatomy', 'anatomy', 'Knowledge skill that increases damage and healing effectiveness', 'knowledge', 1, 43],
      ['Alchemy', 'alchemy', 'Skill for creating potions and magical reagents', 'crafting', 2, 44],
      ['Chivalry', 'chivalry', 'Paladin skill for holy magic and abilities', 'paladin', 3, 45],
      ['Tracking', 'tracking', 'Skill for following the trails of other players', 'utility', 2, 46],
      ['Tinkering', 'tinkering', 'Skill for crafting mechanical devices and tools', 'crafting', 2, 47],
      ['Tailoring', 'tailoring', 'Skill for crafting clothing and leather armor', 'crafting', 2, 48],
      ['Tactics', 'tactics', 'Combat skill that increases damage with all weapons', 'combat', 1, 49],
      ['Throwing', 'throwing', 'Ranged combat skill for throwing weapons and items', 'combat', 2, 50],
      ['Veterinary', 'veterinary', 'Skill for healing and caring for pets and animals', 'taming', 2, 51],
      ['Herding', 'herding', 'Skill for controlling and moving groups of animals', 'taming', 2, 52]
    ];

    for (const [name, slug, description, category, difficulty, sortOrder] of skillsData) {
      await pool.query(`
        INSERT INTO skills (name, slug, description, category, difficulty_level, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO NOTHING
      `, [name, slug, description, category, difficulty, sortOrder]);
    }
    console.log('✅ Initial skills data inserted');

    // Check results
    const skillsCount = await pool.query('SELECT COUNT(*) FROM skills');
    console.log(`📊 Total skills: ${skillsCount.rows[0].count}`);

    console.log('🎉 Skills database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the setup
createTables();
