const fs = require('fs');
const path = require('path');

// Find all API route files
function findApiFiles(dir, apiFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findApiFiles(filePath, apiFiles);
    } else if (file === 'route.ts' && filePath.includes('/api/')) {
      apiFiles.push(filePath);
    }
  }
  
  return apiFiles;
}

// Add cache-busting to a file
function fixApiFile(filePath) {
  console.log(`Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has our imports
  if (content.includes('createNoCacheResponse') || content.includes('addNoCacheHeaders')) {
    console.log(`  Already fixed: ${filePath}`);
    return;
  }
  
  // Add import if not present
  if (!content.includes("import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'")) {
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    if (importLines.length > 0) {
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, insertIndex) + 
        "import { addNoCacheHeaders, createNoCacheResponse } from '@/lib/api-utils'\n" + 
        content.slice(insertIndex);
    }
  }
  
  // Replace NextResponse.json with createNoCacheResponse
  content = content.replace(/return NextResponse\.json\(([^,]+)(?:,\s*\{\s*status:\s*(\d+)\s*\})?\)/g, (match, data, status) => {
    if (status) {
      return `return createNoCacheResponse(${data}, ${status})`;
    } else {
      return `return createNoCacheResponse(${data})`;
    }
  });
  
  // Replace NextResponse.json with addNoCacheHeaders for more complex cases
  content = content.replace(/return NextResponse\.json\(([^)]+)\)/g, (match, args) => {
    return `return createNoCacheResponse(${args})`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`  Fixed: ${filePath}`);
}

// Main execution
const apiDir = path.join(__dirname, '..', 'app', 'api');
const apiFiles = findApiFiles(apiDir);

console.log(`Found ${apiFiles.length} API files to fix`);

apiFiles.forEach(fixApiFile);

console.log('All API files have been updated with cache-busting!');
