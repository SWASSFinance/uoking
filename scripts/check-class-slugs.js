#!/usr/bin/env node

/**
 * Check which class slugs exist in the database
 * Helps debug 404 errors on class pages
 */

const { Pool } = require('pg');

async function checkClassSlugs() {
  console.log('🔍 Checking class slugs in database...\n');

  // Get connection string from environment variable or command line argument
  let connectionString = process.env.POSTGRES_URL;
  
  // If not in env, check command line args
  if (!connectionString) {
    const args = process.argv.slice(2);
    if (args.length > 0) {
      connectionString = args[0];
    }
  }
   
  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL not provided');
    console.error('\nUsage:');
    console.error('  node scripts/check-class-slugs.js');
    console.error('  (with POSTGRES_URL in environment)');
    console.error('\nOR:');
    console.error('  node scripts/check-class-slugs.js "postgres://..."');
    console.error('  (with connection string as argument)');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        slug,
        is_active,
        created_at
      FROM classes
      ORDER BY name
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No classes found in database!');
    } else {
      console.log(`✅ Found ${result.rows.length} classes:\n`);
      
      result.rows.forEach((cls, i) => {
        const status = cls.is_active ? '✅ ACTIVE' : '❌ INACTIVE';
        console.log(`${i + 1}. ${cls.name}`);
        console.log(`   Slug: "${cls.slug}"`);
        console.log(`   Status: ${status}`);
        console.log(`   URL: /Class/${cls.slug}`);
        console.log('');
      });

      // Check for "Bard" specifically
      const bardClass = result.rows.find(cls => 
        cls.name.toLowerCase() === 'bard' || cls.slug.toLowerCase() === 'bard'
      );

      if (bardClass) {
        console.log('\n🎯 Bard class found:');
        console.log(`   Name: ${bardClass.name}`);
        console.log(`   Slug: "${bardClass.slug}"`);
        console.log(`   Active: ${bardClass.is_active}`);
        console.log(`   URL should be: /Class/${bardClass.slug}`);
      } else {
        console.log('\n⚠️  "Bard" class NOT found in database!');
        console.log('   You need to create a class with slug "bard" in the admin panel.');
      }
    }

  } catch (error) {
    console.error('❌ Error checking classes:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
checkClassSlugs().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

