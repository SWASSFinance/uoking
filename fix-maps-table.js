const { query } = require('./lib/db.ts');

async function fixMapsTable() {
  try {
    console.log('🔧 Fixing maps table structure...');
    
    // Check if the maps table exists and what columns it has
    const tableInfo = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'maps' 
      ORDER BY ordinal_position
    `);
    
    console.log('Current maps table columns:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Add missing columns if they don't exist
    const columnsToAdd = [
      { name: 'map_file_url', type: 'TEXT' },
      { name: 'map_file_size', type: 'BIGINT' },
      { name: 'created_by', type: 'UUID REFERENCES users(id)' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ];
    
    for (const column of columnsToAdd) {
      const columnExists = tableInfo.rows.some(col => col.column_name === column.name);
      
      if (!columnExists) {
        console.log(`Adding column: ${column.name}`);
        await query(`ALTER TABLE maps ADD COLUMN ${column.name} ${column.type}`);
      } else {
        console.log(`Column ${column.name} already exists`);
      }
    }
    
    // Check if plots table exists
    const plotsTableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'plots'
      )
    `);
    
    if (!plotsTableExists.rows[0].exists) {
      console.log('Creating plots table...');
      await query(`
        CREATE TABLE plots (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          points_price INTEGER DEFAULT 0,
          is_available BOOLEAN DEFAULT true,
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      
      // Create indexes for performance
      await query(`CREATE INDEX idx_plots_map_id ON plots(map_id)`);
      await query(`CREATE INDEX idx_plots_location ON plots(latitude, longitude)`);
    } else {
      console.log('Plots table already exists');
    }
    
    // Create index for maps if it doesn't exist
    const indexExists = await query(`
      SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE indexname = 'idx_maps_active'
      )
    `);
    
    if (!indexExists.rows[0].exists) {
      console.log('Creating maps index...');
      await query(`CREATE INDEX idx_maps_active ON maps(is_active) WHERE is_active = true`);
    }
    
    console.log('✅ Maps table structure fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing maps table:', error);
    process.exit(1);
  }
}

// Run the fix
fixMapsTable();
