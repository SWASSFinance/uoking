const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Start transaction
    await client.query('BEGIN');

    // Clear existing data (in correct order to avoid foreign key conflicts)
    console.log('🧹 Clearing existing data...');
    await client.query('TRUNCATE cart_items, order_items, orders, product_reviews, products, news, maps, facets, classes, categories, user_referrals, user_sessions, password_reset_tokens, users CASCADE');

    // Seed Users
    console.log('👥 Seeding users...');
    const usersResult = await client.query(`
      INSERT INTO users (email, username, password_hash, first_name, last_name, is_admin, main_shard, character_names, email_verified)
      VALUES 
        ('admin@uoking.com', 'admin', '$2b$10$example.hash.here', 'Admin', 'User', true, 'Arirang', ARRAY['AdminChar'], true),
        ('john@example.com', 'john_warrior', '$2b$10$example.hash.here', 'John', 'Smith', false, 'Arirang', ARRAY['JohnTheWarrior', 'JohnCrafter'], true),
        ('jane@example.com', 'jane_mage', '$2b$10$example.hash.here', 'Jane', 'Doe', false, 'Ultima', ARRAY['JaneTheMage'], true),
        ('bob@example.com', 'bob_tamer', '$2b$10$example.hash.here', 'Bob', 'Johnson', false, 'Arirang', ARRAY['BobTheTamer', 'BobAlt'], true)
      RETURNING id, username
    `);
    console.log(`✅ Created ${usersResult.rows.length} users`);

    // Seed Facets
    console.log('🌍 Seeding facets...');
    const facetsResult = await client.query(`
      INSERT INTO facets (name, slug, description, expansion)
      VALUES 
        ('Trammel', 'trammel', 'The safe lands where player vs player combat is restricted', 'Renaissance'),
        ('Felucca', 'felucca', 'The dangerous lands where anything goes', 'Original'),
        ('Ilshenar', 'ilshenar', 'Ancient lands filled with dungeons and monsters', 'Third Dawn'),
        ('Malas', 'malas', 'The shattered continent with Luna and Umbra', 'Age of Shadows'),
        ('Tokuno Islands', 'tokuno', 'The mystical islands of the ninja and samurai', 'Samurai Empire')
      RETURNING id, name
    `);
    console.log(`✅ Created ${facetsResult.rows.length} facets`);

    // Seed Maps
    console.log('🗺️ Seeding maps...');
    const mapsResult = await client.query(`
      INSERT INTO maps (facet_id, name, slug, description, coordinates_x, coordinates_y)
      VALUES 
        ((SELECT id FROM facets WHERE slug = 'trammel'), 'Britain', 'britain', 'The capital city of the realm', 1496, 1628),
        ((SELECT id FROM facets WHERE slug = 'trammel'), 'Trinsic', 'trinsic', 'The city of honor and paladins', 2002, 2840),
        ((SELECT id FROM facets WHERE slug = 'felucca'), 'Buccaneer''s Den', 'buccaneers-den', 'A lawless pirate haven', 2748, 2128),
        ((SELECT id FROM facets WHERE slug = 'malas'), 'Luna', 'luna', 'The white city of Malas', 997, 519),
        ((SELECT id FROM facets WHERE slug = 'tokuno'), 'Zento', 'zento', 'The main city of Tokuno Islands', 741, 1261)
      RETURNING id, name
    `);
    console.log(`✅ Created ${mapsResult.rows.length} maps`);

    // Seed Classes
    console.log('⚔️ Seeding classes...');
    const classesResult = await client.query(`
      INSERT INTO classes (name, slug, description, image_url, primary_stats, skills, playstyle, difficulty_level)
      VALUES 
        ('Warrior', 'warrior', 'Masters of combat with swords, maces, and bows. High health and physical damage.', '/uo/warrior.png', 
         ARRAY['Strength', 'Dexterity'], ARRAY['Swords', 'Tactics', 'Anatomy', 'Healing'], 
         'Melee combat specialist with high survivability', 2),
        ('Mage', 'mage', 'Wielders of arcane magic with powerful offensive and utility spells.', '/uo/mage.png',
         ARRAY['Intelligence'], ARRAY['Magery', 'Evaluate Intelligence', 'Meditation', 'Wrestling'],
         'Ranged magical damage dealer with utility spells', 3),
        ('Tamer', 'tamer', 'Masters of animal lore who fight alongside powerful creatures.', '/uo/tamer.png',
         ARRAY['Intelligence', 'Dexterity'], ARRAY['Animal Taming', 'Animal Lore', 'Veterinary', 'Magery'],
         'Pet-based combat with support magic', 4),
        ('Archer', 'archer', 'Ranged specialists with deadly accuracy and mobility.', '/uo/archer.png',
         ARRAY['Dexterity'], ARRAY['Archery', 'Tactics', 'Anatomy', 'Healing'],
         'Ranged physical damage with high mobility', 3),
        ('Paladin', 'paladin', 'Holy warriors combining martial prowess with divine magic.', '/uo/paladin.png',
         ARRAY['Strength', 'Intelligence'], ARRAY['Swords', 'Chivalry', 'Focus', 'Tactics'],
         'Balanced melee fighter with divine support', 3),
        ('Necromancer', 'necromancer', 'Dark mages who command death magic and undead minions.', '/uo/necromancer.png',
         ARRAY['Intelligence'], ARRAY['Necromancy', 'Spirit Speak', 'Magery', 'Meditation'],
         'Dark magic specialist with debuffs and minions', 4)
      RETURNING id, name
    `);
    console.log(`✅ Created ${classesResult.rows.length} classes`);

    // Seed Categories
    console.log('📦 Seeding categories...');
    const categoriesResult = await client.query(`
      INSERT INTO categories (name, slug, description, image_url, sort_order)
      VALUES 
        ('Weapons', 'weapons', 'Swords, maces, bows and all combat weapons', '/uo/weapons.png', 1),
        ('Armor', 'armor', 'Protective gear for all character types', '/uo/armor.png', 2),
        ('Jewelry', 'jewelry', 'Magical rings, bracelets, and necklaces', '/uo/jewelry.png', 3),
        ('Scrolls', 'scrolls', 'Power scrolls and skill enhancement items', '/uo/scrolls.png', 4),
        ('Gold', 'gold', 'In-game currency for all your needs', '/uo/gold.png', 5),
        ('Accounts', 'accounts', 'Character accounts and builds', '/uo/accounts.png', 6),
        ('Houses', 'houses', 'Player housing and real estate', '/uo/houses.png', 7),
        ('Rares', 'rares', 'Rare and collectible items', '/uo/rares.png', 8),
        ('Services', 'services', 'Professional gaming services', '/uo/services.png', 9)
      RETURNING id, name, slug
    `);
    console.log(`✅ Created ${categoriesResult.rows.length} categories`);

    // Create subcategories
    await client.query(`
      INSERT INTO categories (name, slug, description, parent_id, sort_order)
      VALUES 
        ('Swords', 'swords', 'All types of bladed weapons', (SELECT id FROM categories WHERE slug = 'weapons'), 1),
        ('Maces', 'maces', 'Blunt weapons and war hammers', (SELECT id FROM categories WHERE slug = 'weapons'), 2),
        ('Bows', 'bows', 'Ranged weapons and crossbows', (SELECT id FROM categories WHERE slug = 'weapons'), 3),
        ('Plate Armor', 'plate-armor', 'Heavy metal armor sets', (SELECT id FROM categories WHERE slug = 'armor'), 1),
        ('Leather Armor', 'leather-armor', 'Light armor for dexterity builds', (SELECT id FROM categories WHERE slug = 'armor'), 2),
        ('Robes', 'robes', 'Magical robes and cloth armor', (SELECT id FROM categories WHERE slug = 'armor'), 3),
        ('Rings', 'rings', 'Magical finger rings', (SELECT id FROM categories WHERE slug = 'jewelry'), 1),
        ('Necklaces', 'necklaces', 'Amulets and necklaces', (SELECT id FROM categories WHERE slug = 'jewelry'), 2)
    `);

    // Seed Sample Products
    console.log('🛍️ Seeding products...');
    
    // Get category and class IDs for reference
    const weaponsCat = categoriesResult.rows.find(c => c.slug === 'weapons').id;
    const armorCat = categoriesResult.rows.find(c => c.slug === 'armor').id;
    const scrollsCat = categoriesResult.rows.find(c => c.slug === 'scrolls').id;
    const mageClass = classesResult.rows.find(c => c.name === 'Mage').id;
    const warriorClass = classesResult.rows.find(c => c.name === 'Warrior').id;

    const productsResult = await client.query(`
      INSERT INTO products (
        name, slug, description, short_description, price, sale_price, 
        category_id, class_id, type, item_type, slot_type, 
        available_shards, spawn_location, drop_rate, featured,
        stats, image_url, meta_title, meta_description
      )
      VALUES 
        ('Hawkwinds Robe', 'hawkwinds-robe', 
         'The Hawkwind''s robe is an unreal new item in the Ultima Online game and offers players incredible magic bonuses when the robe is worn. Those who purchase the Ultima Online Hawkwind''s robe are given extra mana regeneration, spell damage increase, lower mana cost, and lower reagent cost. Buy a UO Hawkwind''s robe for the extra LRC stats. One of the best robes in the game right now. Only drops from Roof runs in Shadowguard. This item does not use up armor/jewelry/talisman slots, just the robe overlay slot.',
         'Legendary mage robe with incredible magic bonuses', 3.99, 2.99, '${armorCat}', '${mageClass}', 'item', 'Robe', 'Chest', 
         ARRAY['Arirang', 'Ultima'], 'Shadowguard Roof', '100%', true,
         '[{"name": "Mana Regeneration", "value": "2"}, {"name": "Spell Damage Increase", "value": "5%"}, {"name": "Lower Mana Cost", "value": "10%"}, {"name": "Lower Reagent Cost", "value": "10%"}]'::jsonb,
         '/medieval-robe.png', 'Hawkwinds Robe - Legendary UO Mage Item', 'Buy the legendary Hawkwinds Robe for Ultima Online with incredible mage bonuses'),

        ('Valorite Runic Hammer Katana', 'valorite-runic-katana',
         'Masterfully crafted katana made with a Valorite Runic Hammer. Features exceptional damage and hit chance with additional magical properties. Perfect for warriors and samurai builds.',
         'Exceptional katana crafted with Valorite Runic Hammer', 25.00, 20.00, '${weaponsCat}', '${warriorClass}', 'item', 'Weapon', 'Weapon',
         ARRAY['Arirang', 'Ultima', 'Tokuno'], 'Player Crafted', 'Crafted', true,
         '[{"name": "Damage Increase", "value": "50%"}, {"name": "Hit Chance Increase", "value": "15%"}, {"name": "Swing Speed Increase", "value": "10%"}]'::jsonb,
         '/medieval-sword.png', 'Valorite Runic Katana - Premium UO Weapon', 'Premium valorite runic katana with exceptional stats'),

        ('Power Scroll 120 Magery', 'power-scroll-120-magery',
         'Increases your Magery skill cap to 120. Essential for any serious mage build. These scrolls are rare drops from champion spawns and are highly sought after.',
         'Increases Magery skill cap to 120', 15.00, NULL, '${scrollsCat}', '${mageClass}', 'item', 'Scroll', 'Consumable',
         ARRAY['Arirang', 'Ultima'], 'Champion Spawns', 'Rare', true,
         '[{"name": "Skill Cap Increase", "value": "120 Magery"}]'::jsonb,
         '/scroll.png', '120 Magery Power Scroll - UO Skill Enhancement', 'Essential 120 Magery power scroll for mage builds'),

        ('SDI Suit 140 Atlantic', 'sdi-suit-140-atlantic',
         'Complete spell damage increase suit reaching 140 SDI. Includes all necessary pieces with perfect stats for maximum magical damage output.',
         'Complete 140 SDI suit for maximum spell damage', 45.00, 40.00, '${armorCat}', '${mageClass}', 'item', 'Suit', 'Multiple',
         ARRAY['Arirang'], 'Player Assembled', 'Custom', false,
         '[{"name": "Spell Damage Increase", "value": "140%"}, {"name": "Lower Reagent Cost", "value": "100%"}, {"name": "Mana Regeneration", "value": "18"}]'::jsonb,
         '/suit.png', 'SDI 140 Suit - Complete Mage Gear Set', 'Complete 140 SDI suit for ultimate mage performance'),

        ('UO Gold 1 Million', 'uo-gold-1m',
         'One million gold pieces delivered safely to your character. Fast and reliable delivery within 24 hours.',
         'One million UO gold pieces', 8.99, 7.99, (SELECT id FROM categories WHERE slug = 'gold'), NULL, 'gold', 'Currency', 'Gold',
         ARRAY['Arirang', 'Ultima', 'Tokuno'], 'Player Trade', '100%', true,
         '[{"name": "Amount", "value": "1,000,000 gold"}]'::jsonb,
         '/gold.png', 'UO Gold 1 Million - Fast Delivery', 'Buy 1 million UO gold with fast and safe delivery'),

        ('Pre-Built Mage Account', 'prebuild-mage-account',
         'Fully developed mage character with 120 Magery, Evaluate Intelligence, Meditation, and Wrestling. Includes starter equipment and gold.',
         'Complete mage character ready to play', 75.00, 65.00, (SELECT id FROM categories WHERE slug = 'accounts'), '${mageClass}', 'account', 'Character', 'Account',
         ARRAY['Arirang'], 'Player Created', 'Custom', false,
         '[{"name": "Magery", "value": "120"}, {"name": "Evaluate Intelligence", "value": "120"}, {"name": "Meditation", "value": "120"}, {"name": "Wrestling", "value": "120"}]'::jsonb,
         '/account.png', 'Pre-Built Mage Account - Ready to Play', 'Complete mage character with 120 skills and starter gear')
      RETURNING id, name
    `);
    console.log(`✅ Created ${productsResult.rows.length} products`);

    // Seed News
    console.log('📰 Seeding news...');
    const adminUser = usersResult.rows.find(u => u.username === 'admin');
    const newsResult = await client.query(`
      INSERT INTO news (title, slug, content, excerpt, author_id, category, status, featured, published_at)
      VALUES 
        ('Welcome to UO King - Your Premier UO Store', 'welcome-to-uo-king',
         'We are excited to announce the launch of UO King, your one-stop shop for all Ultima Online needs. From rare items to gold, power scrolls to complete character builds, we have everything you need to dominate the world of Britannia. Our team has years of experience in UO and we are committed to providing the best service and prices in the community.',
         'Welcome to UO King - your premier destination for Ultima Online items, gold, and services.',
         $1, 'announcement', 'published', true, NOW() - INTERVAL '7 days'),

        ('New Hawkwinds Robes in Stock', 'hawkwinds-robes-in-stock',
         'We have just received a fresh stock of the legendary Hawkwinds Robes! These incredible mage items are perfect for any spellcaster looking to maximize their potential. With bonuses to mana regeneration, spell damage increase, lower mana cost, and lower reagent cost, these robes are essential for serious mages. Limited quantity available - order now while supplies last!',
         'Fresh stock of legendary Hawkwinds Robes now available with incredible mage bonuses.',
         $1, 'inventory', 'published', true, NOW() - INTERVAL '3 days'),

        ('Power Scroll Sale - 20% Off All 120 Scrolls', 'power-scroll-sale-20-off',
         'For a limited time, we are offering 20% off all 120 power scrolls! Whether you need Magery, Swords, Taming, or any other skill, now is the perfect time to cap your character. This sale includes all shards and all skills. Use code POWER20 at checkout. Sale ends this Sunday!',
         'Limited time 20% off sale on all 120 power scrolls - use code POWER20.',
         $1, 'sale', 'published', false, NOW() - INTERVAL '1 day'),

        ('Server Maintenance Scheduled', 'server-maintenance-scheduled',
         'We will be performing routine server maintenance this weekend to improve our systems and add new features. Expect minimal downtime and improved performance afterward. All orders placed during maintenance will be processed as soon as systems are back online.',
         'Routine server maintenance scheduled for this weekend with minimal downtime.',
         $1, 'maintenance', 'published', false, NOW() + INTERVAL '2 days')
    `, [adminUser.id]);
    console.log(`✅ Created ${newsResult.rows.length} news articles`);

    // Seed Sample Reviews
    console.log('⭐ Seeding product reviews...');
    const regularUsers = usersResult.rows.filter(u => u.username !== 'admin');
    const hawkwindsProduct = await client.query('SELECT id FROM products WHERE slug = $1', ['hawkwinds-robe']);
    const katanaProduct = await client.query('SELECT id FROM products WHERE slug = $1', ['valorite-runic-katana']);
    
    await client.query(`
      INSERT INTO product_reviews (product_id, user_id, rating, title, content, verified_purchase, status)
      VALUES 
        ($1, $2, 5, 'Amazing robe!', 'This robe is incredible! The mana regeneration and SDI boost make a huge difference in PvP. Highly recommended for any mage.', true, 'approved'),
        ($1, $3, 4, 'Great item', 'Solid stats and looks great. Delivery was fast and the seller was very helpful.', true, 'approved'),
        ($4, $2, 5, 'Perfect weapon', 'This katana is exactly what I needed for my samurai build. Excellent damage and hit chance.', true, 'approved')
    `, [hawkwindsProduct.rows[0].id, regularUsers[0].id, regularUsers[1].id, katanaProduct.rows[0].id]);
    console.log(`✅ Created sample product reviews`);

    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`• ${usersResult.rows.length} users created`);
    console.log(`• ${facetsResult.rows.length} facets created`);
    console.log(`• ${mapsResult.rows.length} maps created`);
    console.log(`• ${classesResult.rows.length} classes created`);
    console.log(`• ${categoriesResult.rows.length} main categories created`);
    console.log(`• ${productsResult.rows.length} products created`);
    console.log(`• ${newsResult.rows.length} news articles created`);
    console.log('• Sample reviews and subcategories created');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase }; 