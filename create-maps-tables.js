const { createMapTable } = require('./lib/db.ts');

async function initializeMapsTables() {
  try {
    console.log('🚀 Initializing maps and plots tables...');
    
    await createMapTable();
    
    console.log('✅ Maps and plots tables created successfully!');
    console.log('📋 Tables created:');
    console.log('   - maps (for storing map files and metadata)');
    console.log('   - plots (for storing map markers/plots)');
    console.log('   - Indexes for performance optimization');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating maps tables:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeMapsTables();
