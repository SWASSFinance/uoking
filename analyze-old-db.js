// Database Analysis Script
// This will help you understand your current schema before migration

const analyzeDatabase = {
  // For MySQL
  mysql: {
    showTables: "SHOW TABLES;",
    describeTable: (tableName) => `DESCRIBE ${tableName};`,
    sampleData: (tableName) => `SELECT * FROM ${tableName} LIMIT 5;`,
    rowCounts: (tableName) => `SELECT COUNT(*) as count FROM ${tableName};`
  },
  
  // For PostgreSQL
  postgresql: {
    showTables: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `,
    describeTable: (tableName) => `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = '${tableName}';
    `,
    sampleData: (tableName) => `SELECT * FROM ${tableName} LIMIT 5;`,
    rowCounts: (tableName) => `SELECT COUNT(*) as count FROM ${tableName};`
  },
  
  // For SQLite
  sqlite: {
    showTables: "SELECT name FROM sqlite_master WHERE type='table';",
    describeTable: (tableName) => `PRAGMA table_info(${tableName});`,
    sampleData: (tableName) => `SELECT * FROM ${tableName} LIMIT 5;`,
    rowCounts: (tableName) => `SELECT COUNT(*) as count FROM ${tableName};`
  }
};

console.log('🔍 Database Analysis Queries');
console.log('Copy and run these queries against your old database:');
console.log('\n1. First, show all tables:');
console.log('MySQL:', analyzeDatabase.mysql.showTables);
console.log('PostgreSQL:', analyzeDatabase.postgresql.showTables);
console.log('SQLite:', analyzeDatabase.sqlite.showTables);

console.log('\n2. For each table, describe its structure:');
console.log('Example for a "users" table:');
console.log('MySQL:', analyzeDatabase.mysql.describeTable('users'));
console.log('PostgreSQL:', analyzeDatabase.postgresql.describeTable('users'));
console.log('SQLite:', analyzeDatabase.sqlite.describeTable('users'));

console.log('\n3. Get sample data to understand the format:');
console.log('MySQL/PostgreSQL/SQLite:', analyzeDatabase.mysql.sampleData('users'));

console.log('\n4. Check data volume:');
console.log('MySQL/PostgreSQL/SQLite:', analyzeDatabase.mysql.rowCounts('users'));

// Template for documenting your current schema
const schemaTemplate = {
  tables: {
    users: {
      columns: [
        // { name: 'id', type: 'int', nullable: false, key: 'primary' },
        // { name: 'username', type: 'varchar(255)', nullable: false },
        // Add your actual columns here
      ],
      issues: [
        // "No foreign key constraints",
        // "Passwords stored in plain text",
        // "Duplicate data in multiple columns"
      ]
    },
    transactions: {
      columns: [
        // Document your transaction table structure
      ],
      issues: [
        // Document problems with current structure
      ]
    }
    // Add other tables as needed
  }
};

console.log('\n📝 After running the queries, document your schema like this:');
console.log(JSON.stringify(schemaTemplate, null, 2)); 