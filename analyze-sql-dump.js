// SQL Dump Analyzer
// Analyzes your 60MB SQL file to understand structure and data

const fs = require('fs');
const readline = require('readline');

class SQLDumpAnalyzer {
  constructor(sqlFilePath) {
    this.sqlFilePath = sqlFilePath;
    this.tables = new Map();
    this.insertCounts = new Map();
    this.sampleData = new Map();
    this.currentTable = null;
    this.lineCount = 0;
  }

  async analyze() {
    console.log('🔍 Analyzing SQL dump file...');
    console.log(`📁 File: ${this.sqlFilePath}`);
    
    const fileStream = fs.createReadStream(this.sqlFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      this.lineCount++;
      this.processLine(line.trim());
      
      // Progress indicator for large files
      if (this.lineCount % 10000 === 0) {
        console.log(`📊 Processed ${this.lineCount} lines...`);
      }
    }

    console.log('✅ Analysis complete!');
    this.printReport();
  }

  processLine(line) {
    // Skip comments and empty lines
    if (!line || line.startsWith('--') || line.startsWith('/*') || line.startsWith('#')) {
      return;
    }

    // Detect CREATE TABLE statements
    if (line.toUpperCase().startsWith('CREATE TABLE')) {
      this.parseCreateTable(line);
    }
    
    // Detect INSERT statements
    else if (line.toUpperCase().startsWith('INSERT INTO')) {
      this.parseInsertStatement(line);
    }
    
    // Detect column definitions (continuation of CREATE TABLE)
    else if (this.currentTable && line.includes('(') && !line.toUpperCase().includes('INSERT')) {
      this.parseColumnDefinition(line);
    }
    
    // End of CREATE TABLE
    else if (this.currentTable && line.includes(');')) {
      this.currentTable = null;
    }
  }

  parseCreateTable(line) {
    // Extract table name from CREATE TABLE statement
    const match = line.match(/CREATE TABLE\s+(?:`?(\w+)`?)/i);
    if (match) {
      const tableName = match[1];
      this.currentTable = tableName;
      this.tables.set(tableName, {
        name: tableName,
        columns: [],
        constraints: [],
        engine: null,
        charset: null
      });
      console.log(`📋 Found table: ${tableName}`);
    }
  }

  parseColumnDefinition(line) {
    if (!this.currentTable) return;
    
    const table = this.tables.get(this.currentTable);
    
    // Parse column definitions
    // Look for patterns like: `column_name` TYPE [NULL|NOT NULL] [DEFAULT value]
    const columnMatch = line.match(/`?(\w+)`?\s+(\w+(?:\(\d+(?:,\d+)?\))?)\s*(.*)/);
    if (columnMatch) {
      const [, columnName, dataType, modifiers] = columnMatch;
      
      table.columns.push({
        name: columnName,
        type: dataType,
        nullable: !modifiers.includes('NOT NULL'),
        isPrimaryKey: modifiers.includes('PRIMARY KEY') || modifiers.includes('AUTO_INCREMENT'),
        isAutoIncrement: modifiers.includes('AUTO_INCREMENT'),
        defaultValue: this.extractDefault(modifiers)
      });
    }
    
    // Parse constraints and keys
    if (line.includes('PRIMARY KEY') || line.includes('UNIQUE KEY') || line.includes('KEY ')) {
      table.constraints.push(line.trim());
    }
    
    // Parse engine and charset
    if (line.includes('ENGINE=')) {
      const engineMatch = line.match(/ENGINE=(\w+)/);
      if (engineMatch) table.engine = engineMatch[1];
    }
    
    if (line.includes('CHARSET=') || line.includes('CHARACTER SET')) {
      const charsetMatch = line.match(/(?:CHARSET|CHARACTER SET)=?(\w+)/);
      if (charsetMatch) table.charset = charsetMatch[1];
    }
  }

  parseInsertStatement(line) {
    // Extract table name from INSERT statement
    const match = line.match(/INSERT INTO\s+(?:`?(\w+)`?)/i);
    if (match) {
      const tableName = match[1];
      
      // Count inserts
      const currentCount = this.insertCounts.get(tableName) || 0;
      this.insertCounts.set(tableName, currentCount + 1);
      
      // Store sample data (first few inserts only)
      if (!this.sampleData.has(tableName)) {
        this.sampleData.set(tableName, []);
      }
      
      const samples = this.sampleData.get(tableName);
      if (samples.length < 3) {
        // Extract VALUES part
        const valuesMatch = line.match(/VALUES\s*\((.*)\)/i);
        if (valuesMatch) {
          samples.push(valuesMatch[1]);
        }
      }
    }
  }

  extractDefault(modifiers) {
    const defaultMatch = modifiers.match(/DEFAULT\s+([^,\s]+)/i);
    return defaultMatch ? defaultMatch[1] : null;
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SQL DUMP ANALYSIS REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📁 File Information:`);
    console.log(`   Total Lines Processed: ${this.lineCount.toLocaleString()}`);
    console.log(`   Tables Found: ${this.tables.size}`);
    
    console.log(`\n📋 Tables Overview:`);
    for (const [tableName, table] of this.tables) {
      const insertCount = this.insertCounts.get(tableName) || 0;
      console.log(`   📄 ${tableName}`);
      console.log(`      Columns: ${table.columns.length}`);
      console.log(`      Records: ~${insertCount.toLocaleString()}`);
      console.log(`      Engine: ${table.engine || 'Unknown'}`);
    }

    console.log(`\n🔍 Detailed Table Structures:`);
    for (const [tableName, table] of this.tables) {
      console.log(`\n   📋 ${tableName.toUpperCase()}`);
      console.log(`   ${'─'.repeat(40)}`);
      
      if (table.columns.length > 0) {
        console.log('   Columns:');
        table.columns.forEach(col => {
          const flags = [];
          if (col.isPrimaryKey) flags.push('PK');
          if (col.isAutoIncrement) flags.push('AI');
          if (!col.nullable) flags.push('NOT NULL');
          if (col.defaultValue) flags.push(`DEFAULT ${col.defaultValue}`);
          
          console.log(`     • ${col.name} (${col.type}) ${flags.join(', ')}`);
        });
      }
      
      if (table.constraints.length > 0) {
        console.log('   Constraints:');
        table.constraints.forEach(constraint => {
          console.log(`     • ${constraint}`);
        });
      }
      
      // Show sample data
      const samples = this.sampleData.get(tableName);
      if (samples && samples.length > 0) {
        console.log('   Sample Data:');
        samples.slice(0, 2).forEach((sample, i) => {
          const truncated = sample.length > 100 ? sample.substring(0, 100) + '...' : sample;
          console.log(`     ${i + 1}. ${truncated}`);
        });
      }
    }

    console.log(`\n📊 Data Volume Summary:`);
    let totalRecords = 0;
    for (const [tableName, count] of this.insertCounts) {
      console.log(`   ${tableName}: ${count.toLocaleString()} records`);
      totalRecords += count;
    }
    console.log(`   TOTAL: ~${totalRecords.toLocaleString()} records`);

    // Generate migration hints
    this.generateMigrationHints();
    
    // Save detailed analysis to file
    this.saveAnalysisToFile();
  }

  generateMigrationHints() {
    console.log(`\n💡 Migration Hints:`);
    
    // Look for user-related tables
    const userTables = Array.from(this.tables.keys()).filter(name => 
      name.toLowerCase().includes('user') || 
      name.toLowerCase().includes('member') || 
      name.toLowerCase().includes('customer') ||
      name.toLowerCase().includes('account')
    );
    
    if (userTables.length > 0) {
      console.log(`   👤 Potential User Tables: ${userTables.join(', ')}`);
    }
    
    // Look for transaction-related tables
    const transactionTables = Array.from(this.tables.keys()).filter(name => 
      name.toLowerCase().includes('transaction') || 
      name.toLowerCase().includes('order') || 
      name.toLowerCase().includes('payment') ||
      name.toLowerCase().includes('purchase') ||
      name.toLowerCase().includes('sale')
    );
    
    if (transactionTables.length > 0) {
      console.log(`   💰 Potential Transaction Tables: ${transactionTables.join(', ')}`);
    }

    // Look for password fields that might need hashing
    const tablesWithPasswords = [];
    for (const [tableName, table] of this.tables) {
      const passwordCols = table.columns.filter(col => 
        col.name.toLowerCase().includes('password') || 
        col.name.toLowerCase().includes('pass')
      );
      if (passwordCols.length > 0) {
        tablesWithPasswords.push(`${tableName} (${passwordCols.map(c => c.name).join(', ')})`);
      }
    }
    
    if (tablesWithPasswords.length > 0) {
      console.log(`   🔒 Tables with passwords (need hashing): ${tablesWithPasswords.join(', ')}`);
    }
  }

  saveAnalysisToFile() {
    const analysis = {
      fileInfo: {
        path: this.sqlFilePath,
        totalLines: this.lineCount,
        tablesFound: this.tables.size
      },
      tables: Object.fromEntries(this.tables),
      insertCounts: Object.fromEntries(this.insertCounts),
      sampleData: Object.fromEntries(this.sampleData)
    };

    fs.writeFileSync('sql-dump-analysis.json', JSON.stringify(analysis, null, 2));
    console.log('\n💾 Detailed analysis saved to: sql-dump-analysis.json');
  }
}

// Usage
async function analyzeSQLDump() {
  // Look for SQL files in current directory, excluding our schema file
  const files = fs.readdirSync('.');
  const sqlFiles = files.filter(file => 
    file.endsWith('.sql') && 
    file !== 'schema.sql' // Exclude our new schema file
  );
  
  if (sqlFiles.length === 0) {
    console.log('❌ No database dump .sql files found in current directory');
    console.log('💡 Please place your SQL dump file in this directory and run again');
    console.log('   Expected file: your-database-dump.sql');
    return;
  }
  
  if (sqlFiles.length === 1) {
    console.log(`📁 Found database dump: ${sqlFiles[0]}`);
    const stats = fs.statSync(sqlFiles[0]);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📊 File size: ${sizeMB} MB`);
    
    const analyzer = new SQLDumpAnalyzer(sqlFiles[0]);
    await analyzer.analyze();
  } else {
    // Multiple dump files - use the largest one (most likely the main dump)
    console.log('📁 Multiple database dump files found:');
    const filesWithSize = sqlFiles.map(file => {
      const stats = fs.statSync(file);
      const sizeMB = stats.size / 1024 / 1024;
      return { file, sizeMB };
    }).sort((a, b) => b.sizeMB - a.sizeMB); // Sort by size, largest first
    
    filesWithSize.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.file} (${item.sizeMB.toFixed(2)} MB)`);
    });
    
    // Automatically use the largest file
    const largestFile = filesWithSize[0];
    console.log(`\n🎯 Using largest file: ${largestFile.file} (${largestFile.sizeMB.toFixed(2)} MB)`);
    
    const analyzer = new SQLDumpAnalyzer(largestFile.file);
    await analyzer.analyze();
  }
}

if (require.main === module) {
  analyzeSQLDump().catch(console.error);
}

module.exports = { SQLDumpAnalyzer }; 