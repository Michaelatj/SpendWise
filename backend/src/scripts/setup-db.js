const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function setupDatabase() {
  let connection;

  try {
    console.log('[SpendWise DB Setup] Connecting to MySQL...');
    connection = await mysql.createConnection(config);

    // Try finding schema.sql in root database folder or backend scripts
    let schemaPath = path.join(__dirname, '../../../database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      schemaPath = path.join(__dirname, '../config/schema.sql');
    }

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[SpendWise DB Setup] Executing database schema script...');
    await connection.query(schemaSql);

    console.log('✅ SpendWise database setup successful!');
    console.log(`   Database: ${process.env.DB_NAME || 'spendwise'}`);
    console.log('   Tables: categories, expenses, budgets');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
