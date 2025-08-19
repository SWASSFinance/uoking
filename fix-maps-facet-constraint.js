const { query } = require('./lib/db.ts');

async function fixMapsFacetConstraint() {
  try {
    console.log('🔧 Fixing maps table facet_id constraint...');
    
    // Check if facets table exists and has any data
    console.log('\n📋 Checking facets table...');
    const facetsExist = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'facets'
      )
    `);
    
    if (facetsExist.rows[0].exists) {
      const facets = await query('SELECT id, name FROM facets LIMIT 5');
      console.log('Available facets:', facets.rows);
    } else {
      console.log('No facets table found');
    }
    
    // Check current constraint on facet_id
    console.log('\n🔍 Checking current facet_id constraint...');
    const constraintInfo = await query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'maps' AND column_name = 'facet_id'
    `);
    
    console.log('Current facet_id constraint:', constraintInfo.rows[0]);
    
    // Make facet_id nullable since the new map system doesn't use facets
    console.log('\n🔧 Making facet_id nullable...');
    await query('ALTER TABLE maps ALTER COLUMN facet_id DROP NOT NULL');
    
    console.log('✅ facet_id is now nullable!');
    
    // Also make slug nullable since we don't need it for the new system
    console.log('\n🔧 Making slug nullable...');
    await query('ALTER TABLE maps ALTER COLUMN slug DROP NOT NULL');
    
    console.log('✅ slug is now nullable!');
    
    // Verify the changes
    console.log('\n📋 Verifying changes...');
    const updatedInfo = await query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'maps' AND column_name IN ('facet_id', 'slug')
      ORDER BY column_name
    `);
    
    console.log('Updated constraints:');
    updatedInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name}: nullable = ${col.is_nullable}`);
    });
    
    console.log('\n✅ Maps table constraints fixed successfully!');
    console.log('You can now upload maps without providing facet_id or slug.');
    
  } catch (error) {
    console.error('❌ Error fixing maps table constraints:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  }
}

fixMapsFacetConstraint();
