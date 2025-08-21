const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./atlanticeventrares.html', 'utf8');

// Test different regex patterns
console.log('Testing regex patterns...\n');

// Pattern 1: Correct pattern
const pattern1 = /<h2><span class="mw-headline" id="[^"]+">[^<]+<\/span><\/h2>/g;
const matches1 = htmlContent.match(pattern1);
console.log('Pattern 1 matches:', matches1 ? matches1.length : 0);
if (matches1) {
  console.log('First match:', matches1[0]);
  console.log('All matches:');
  matches1.forEach((match, index) => {
    console.log(`  ${index + 1}: ${match}`);
  });
}

// Pattern 2: Simpler pattern
const pattern2 = /<h2><span class="mw-headline"[^>]*>[^<]+<\/span><\/h2>/g;
const matches2 = htmlContent.match(pattern2);
console.log('\nPattern 2 matches:', matches2 ? matches2.length : 0);
if (matches2) {
  console.log('First match:', matches2[0]);
}

// Pattern 3: Even simpler
const pattern3 = /<h2>[^<]*<span[^>]*>[^<]+<\/span>[^<]*<\/h2>/g;
const matches3 = htmlContent.match(pattern3);
console.log('\nPattern 3 matches:', matches3 ? matches3.length : 0);
if (matches3) {
  console.log('First match:', matches3[0]);
}

// Pattern 4: Just find h2 tags
const pattern4 = /<h2[^>]*>[^<]*<span[^>]*>[^<]+<\/span>[^<]*<\/h2>/g;
const matches4 = htmlContent.match(pattern4);
console.log('\nPattern 4 matches:', matches4 ? matches4.length : 0);
if (matches4) {
  console.log('First match:', matches4[0]);
}

// Let's also check what's around line 170
console.log('\nContent around line 170:');
const lines = htmlContent.split('\n');
for (let i = 165; i <= 175; i++) {
  if (lines[i]) {
    console.log(`Line ${i}: ${lines[i].trim()}`);
  }
}
