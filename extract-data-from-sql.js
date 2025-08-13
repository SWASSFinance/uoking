// SQL Dump Data Extractor
// Extracts actual data from your SQL dump for migration

const fs = require('fs');
const readline = require('readline');

class SQLDataExtractor {
  constructor(sqlFilePath) {
    this.sqlFilePath = sqlFilePath;
    this.extractedData = {
      users: [],
      transactions: [],
      orders: [],
      payments: [],
      // Add other tables as needed
    };
    this.tableMapping = new Map();
    this.lineCount = 0;
  }

  async extract(targetTables = []) {
    console.log('🔄 Extracting data from SQL dump...');
    console.log(`📁 File: ${this.sqlFilePath}`);
    console.log(`🎯 Target tables: ${targetTables.length > 0 ? targetTables.join(', ') : 'All tables'}`);
    
    const fileStream = fs.createReadStream(this.sqlFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      this.lineCount++;
      this.processInsertLine(line.trim(), targetTables);
      
      // Progress indicator
      if (this.lineCount % 5000 === 0) {
        console.log(`📊 Processed ${this.lineCount} lines...`);
      }
    }

    console.log('✅ Data extraction complete!');
    this.printExtractionSummary();
    this.saveExtractedData();
    
    return this.extractedData;
  }

  processInsertLine(line, targetTables) {
    // Skip non-INSERT lines
    if (!line.toUpperCase().startsWith('INSERT INTO')) {
      return;
    }

    // Extract table name
    const tableMatch = line.match(/INSERT INTO\s+(?:`?(\w+)`?)/i);
    if (!tableMatch) return;
    
    const tableName = tableMatch[1].toLowerCase();
    
    // Skip if we have target tables and this isn't one of them
    if (targetTables.length > 0 && !targetTables.includes(tableName)) {
      return;
    }

    // Extract column names if available
    const columnsMatch = line.match(/INSERT INTO\s+`?\w+`?\s*\(([^)]+)\)/i);
    let columns = [];
    if (columnsMatch) {
      columns = columnsMatch[1].split(',').map(col => col.trim().replace(/`/g, ''));
    }

    // Extract values
    const valuesRegex = /VALUES\s*(.+)/i;
    const valuesMatch = line.match(valuesRegex);
    if (!valuesMatch) return;

    const valuesString = valuesMatch[1];
    const records = this.parseMultipleValueSets(valuesString);

    // Process each record
    records.forEach(values => {
      const record = this.createRecordObject(columns, values, tableName);
      if (record) {
        this.addRecordToCollection(tableName, record);
      }
    });
  }

  parseMultipleValueSets(valuesString) {
    const records = [];
    let current = '';
    let inString = false;
    let stringChar = null;
    let parenCount = 0;
    
    for (let i = 0; i < valuesString.length; i++) {
      const char = valuesString[i];
      
      if (!inString && (char === "'" || char === '"')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && valuesString[i-1] !== '\\') {
        inString = false;
        stringChar = null;
      } else if (!inString) {
        if (char === '(') {
          parenCount++;
        } else if (char === ')') {
          parenCount--;
          if (parenCount === 0) {
            // End of a record
            const recordValues = current + char;
            records.push(this.parseValues(recordValues));
            current = '';
            continue;
          }
        }
      }
      
      current += char;
    }
    
    return records;
  }

  parseValues(valuesString) {
    // Remove outer parentheses
    const clean = valuesString.replace(/^\s*\(\s*|\s*\)\s*$/g, '');
    
    const values = [];
    let current = '';
    let inString = false;
    let stringChar = null;
    
    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      
      if (!inString && (char === "'" || char === '"')) {
        inString = true;
        stringChar = char;
        current += char;
      } else if (inString && char === stringChar && clean[i-1] !== '\\') {
        inString = false;
        stringChar = null;
        current += char;
      } else if (!inString && char === ',') {
        values.push(this.cleanValue(current.trim()));
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last value
    if (current.trim()) {
      values.push(this.cleanValue(current.trim()));
    }
    
    return values;
  }

  cleanValue(value) {
    const trimmed = value.trim();
    
    // Handle NULL
    if (trimmed.toUpperCase() === 'NULL') {
      return null;
    }
    
    // Handle quoted strings
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      return trimmed.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    
    // Handle numbers
    if (/^\d+$/.test(trimmed)) {
      return parseInt(trimmed);
    }
    
    if (/^\d+\.\d+$/.test(trimmed)) {
      return parseFloat(trimmed);
    }
    
    return trimmed;
  }

  createRecordObject(columns, values, tableName) {
    if (columns.length === 0) {
      // No column names, create generic object
      return values.reduce((obj, value, index) => {
        obj[`field_${index}`] = value;
        return obj;
      }, { _table: tableName });
    }
    
    // Create object with column names
    const record = { _table: tableName };
    for (let i = 0; i < Math.min(columns.length, values.length); i++) {
      const columnName = columns[i].toLowerCase();
      record[columnName] = values[i];
    }
    
    return record;
  }

  addRecordToCollection(tableName, record) {
    const key = this.getCollectionKey(tableName);
    
    if (!this.extractedData[key]) {
      this.extractedData[key] = [];
    }
    
    this.extractedData[key].push(record);
  }

  getCollectionKey(tableName) {
    // Map various table names to standard collections
    const name = tableName.toLowerCase();
    
    if (name.includes('user') || name.includes('member') || name.includes('customer') || name.includes('account')) {
      return 'users';
    }
    
    if (name.includes('transaction') || name.includes('txn')) {
      return 'transactions';
    }
    
    if (name.includes('order')) {
      return 'orders';
    }
    
    if (name.includes('payment') || name.includes('pay')) {
      return 'payments';
    }
    
    // Create a key based on table name
    return name;
  }

  printExtractionSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 DATA EXTRACTION SUMMARY');
    console.log('='.repeat(50));
    
    let totalRecords = 0;
    for (const [collection, records] of Object.entries(this.extractedData)) {
      if (records.length > 0) {
        console.log(`📋 ${collection}: ${records.length.toLocaleString()} records`);
        totalRecords += records.length;
        
        // Show sample record structure
        if (records.length > 0) {
          const sample = records[0];
          const fields = Object.keys(sample).filter(k => k !== '_table').slice(0, 5);
          console.log(`   Sample fields: ${fields.join(', ')}${fields.length >= 5 ? '...' : ''}`);
        }
      }
    }
    
    console.log(`\n📊 Total records extracted: ${totalRecords.toLocaleString()}`);
  }

  saveExtractedData() {
    // Save each collection to separate files
    for (const [collection, records] of Object.entries(this.extractedData)) {
      if (records.length > 0) {
        const filename = `extracted-${collection}.json`;
        fs.writeFileSync(filename, JSON.stringify(records, null, 2));
        console.log(`💾 Saved ${records.length} ${collection} records to: ${filename}`);
      }
    }
    
    // Save summary
    const summary = {
      extractionDate: new Date().toISOString(),
      sourceFile: this.sqlFilePath,
      collections: Object.fromEntries(
        Object.entries(this.extractedData).map(([key, records]) => [key, records.length])
      )
    };
    
    fs.writeFileSync('extraction-summary.json', JSON.stringify(summary, null, 2));
    console.log('💾 Extraction summary saved to: extraction-summary.json');
  }

  // Helper method to get data for specific tables
  getDataForTables(tableNames) {
    const result = {};
    for (const tableName of tableNames) {
      const key = this.getCollectionKey(tableName);
      if (this.extractedData[key]) {
        result[tableName] = this.extractedData[key];
      }
    }
    return result;
  }
}

// Usage function
async function extractFromSQL() {
  // Look for SQL files, excluding our schema file
  const files = fs.readdirSync('.');
  const sqlFiles = files.filter(file => 
    file.endsWith('.sql') && 
    file !== 'schema.sql' // Exclude our new schema file
  );
  
  if (sqlFiles.length === 0) {
    console.log('❌ No database dump .sql files found in current directory');
    return;
  }
  
  // Use the largest SQL file (most likely the main dump)
  const filesWithSize = sqlFiles.map(file => {
    const stats = fs.statSync(file);
    const sizeMB = stats.size / 1024 / 1024;
    return { file, sizeMB };
  }).sort((a, b) => b.sizeMB - a.sizeMB);
  
  const sqlFile = filesWithSize[0].file;
  console.log(`🎯 Using database dump: ${sqlFile} (${filesWithSize[0].sizeMB.toFixed(2)} MB)`);
  
  const extractor = new SQLDataExtractor(sqlFile);
  
  // Extract data from specific tables (you can customize this)
  const targetTables = []; // Empty = extract all tables
  
  await extractor.extract(targetTables);
  
  return extractor.extractedData;
}

if (require.main === module) {
  extractFromSQL().catch(console.error);
}

module.exports = { SQLDataExtractor }; 