// Test Settings API
// Simple script to test the settings API endpoints

const fetch = require('node-fetch');

async function testSettingsAPI() {
  const baseURL = 'http://localhost:3000/api/admin/settings';
  
  try {
    console.log('🧪 Testing Settings API...\n');
    
    // Test GET - Fetch current settings
    console.log('1. Testing GET /api/admin/settings...');
    const getResponse = await fetch(baseURL);
    const getData = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ GET successful!');
      console.log(`📋 Found ${Object.keys(getData).length} settings`);
      console.log('Sample settings:', {
        site_title: getData.site_title,
        site_email: getData.site_email,
        enable_reviews: getData.enable_reviews
      });
    } else {
      console.log('❌ GET failed:', getData);
    }
    
    console.log('\n2. Testing PUT /api/admin/settings...');
    
    // Test PUT - Update some settings
    const testSettings = {
      site_title: 'UOKing - Test Title',
      support_phone: '+1 (555) 123-4567',
      enable_reviews: false
    };
    
    const putResponse = await fetch(baseURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSettings),
    });
    
    const putData = await putResponse.json();
    
    if (putResponse.ok) {
      console.log('✅ PUT successful!');
      console.log('Response:', putData);
    } else {
      console.log('❌ PUT failed:', putData);
    }
    
    // Test GET again to verify changes were saved
    console.log('\n3. Testing GET again to verify changes...');
    const getResponse2 = await fetch(baseURL);
    const getData2 = await getResponse2.json();
    
    if (getResponse2.ok) {
      console.log('✅ GET successful!');
      console.log('Updated settings:', {
        site_title: getData2.site_title,
        support_phone: getData2.support_phone,
        enable_reviews: getData2.enable_reviews
      });
      
      // Verify the changes were actually saved
      if (getData2.site_title === testSettings.site_title &&
          getData2.support_phone === testSettings.support_phone &&
          getData2.enable_reviews === testSettings.enable_reviews) {
        console.log('✅ All changes verified successfully!');
      } else {
        console.log('❌ Changes not properly saved');
      }
    } else {
      console.log('❌ GET failed:', getData2);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testSettingsAPI(); 