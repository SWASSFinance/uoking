import { query } from './lib/db.ts';

async function checkTriggerStatus() {
  try {
    console.log('🔍 Checking trigger status...\n');

    // Check if the trigger exists
    const triggerResult = await query(`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_statement
      FROM information_schema.triggers 
      WHERE trigger_name = 'trigger_update_user_review_counts'
    `);

    if (triggerResult.rows.length === 0) {
      console.log('❌ Trigger "trigger_update_user_review_counts" does not exist!');
      console.log('   This means review counts are not being updated automatically.');
      return;
    }

    console.log('✅ Trigger exists:');
    for (const trigger of triggerResult.rows) {
      console.log(`   - Name: ${trigger.trigger_name}`);
      console.log(`   - Event: ${trigger.event_manipulation}`);
      console.log(`   - Table: ${trigger.event_object_table}`);
      console.log(`   - Action: ${trigger.action_statement}`);
      console.log('');
    }

    // Check if the function exists
    const functionResult = await query(`
      SELECT 
        routine_name,
        routine_type
      FROM information_schema.routines 
      WHERE routine_name = 'update_user_review_counts'
    `);

    if (functionResult.rows.length === 0) {
      console.log('❌ Function "update_user_review_counts" does not exist!');
      return;
    }

    console.log('✅ Function exists:');
    for (const func of functionResult.rows) {
      console.log(`   - Name: ${func.routine_name}`);
      console.log(`   - Type: ${func.routine_type}`);
      console.log('');
    }

    console.log('🎉 Trigger system appears to be properly set up!');

  } catch (error) {
    console.error('❌ Error checking trigger status:', error);
  }
}

// Run the check
checkTriggerStatus()
  .then(() => {
    console.log('✅ Trigger status check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 