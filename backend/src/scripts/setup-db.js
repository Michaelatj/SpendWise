const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function setupDatabase() {
  let connection;

  try {
    console.log(`[SpendWise DB Setup] Connecting to MySQL at ${config.host}:${config.port}...`);
    connection = await mysql.createConnection(config);

    // Schema file lookup
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
    console.error('❌ Database setup failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error(`   Connection refused at ${config.host}:${config.port}.`);
      console.error('   👉 Please make sure MySQL / MariaDB / XAMPP service is STARTED and running on your system!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`   Access denied for user '${config.user}'.`);
      console.error('   👉 Please check DB_USER and DB_PASSWORD in backend/.env');
    } else {
      console.error('  ', error.message || error);
    }
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
