const fetch = require('node-fetch');

// Test PayPal IPN data
const testIPNData = {
  // Standard PayPal IPN fields
  payment_status: 'Completed',
  txn_id: 'TEST_TXN_' + Date.now(),
  receiver_email: 'test@uoking.com',
  custom: 'test-order-123', // This should be a valid order ID from your database
  mc_gross: '25.00',
  mc_currency: 'USD',
  
  // Additional PayPal fields
  payment_date: new Date().toISOString(),
  payer_email: 'testpayer@example.com',
  payer_id: 'TEST_PAYER_ID',
  payment_type: 'instant',
  notify_version: '3.9',
  verify_sign: 'TEST_SIGNATURE',
  
  // Item details
  item_name: 'Test Product',
  item_number: 'PROD_001',
  quantity: '1',
  mc_fee: '1.25',
  mc_handling: '0.00',
  mc_shipping: '0.00',
  tax: '0.00',
  
  // Address info
  address_city: 'Test City',
  address_country: 'US',
  address_name: 'Test User',
  address_state: 'CA',
  address_street: '123 Test St',
  address_zip: '12345'
};

// Convert to URL-encoded form data
const formData = new URLSearchParams();
for (const [key, value] of Object.entries(testIPNData)) {
  formData.append(key, value);
}

async function sendTestIPN() {
  try {
    console.log('🚀 Sending test PayPal IPN...');
    console.log('📋 IPN Data:', testIPNData);
    
    const response = await fetch('http://localhost:3000/api/paypal/ipn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Test-IPN-Sender/1.0'
      },
      body: formData.toString()
    });

    const result = await response.text();
    
    console.log('📤 Response Status:', response.status);
    console.log('📤 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📤 Response Body:', result);
    
    if (response.ok) {
      console.log('✅ IPN sent successfully!');
      console.log('🔍 Check your IPN logs at: http://localhost:3000/admin/ipn-logs');
    } else {
      console.log('❌ IPN failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error sending IPN:', error.message);
  }
}

// Send multiple test IPNs with different scenarios
async function runTests() {
  console.log('🧪 Starting PayPal IPN Tests...\n');
  
  // Test 1: Successful payment
  console.log('=== Test 1: Successful Payment ===');
  testIPNData.payment_status = 'Completed';
  testIPNData.txn_id = 'SUCCESS_TXN_' + Date.now();
  await sendTestIPN();
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  // Test 2: Pending payment
  console.log('\n=== Test 2: Pending Payment ===');
  testIPNData.payment_status = 'Pending';
  testIPNData.txn_id = 'PENDING_TXN_' + Date.now();
  await sendTestIPN();
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  // Test 3: Failed payment
  console.log('\n=== Test 3: Failed Payment ===');
  testIPNData.payment_status = 'Failed';
  testIPNData.txn_id = 'FAILED_TXN_' + Date.now();
  await sendTestIPN();
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  // Test 4: Invalid order ID (should cause an error)
  console.log('\n=== Test 4: Invalid Order ID ===');
  testIPNData.payment_status = 'Completed';
  testIPNData.txn_id = 'INVALID_ORDER_TXN_' + Date.now();
  testIPNData.custom = 'non-existent-order-id';
  await sendTestIPN();
  
  console.log('\n🎉 All tests completed!');
  console.log('🔍 Check your IPN logs at: http://localhost:3000/admin/ipn-logs');
}

// Run the tests
runTests();
