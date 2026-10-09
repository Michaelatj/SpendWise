const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const pool = require('../config/db');

const DEFAULT_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Other',
];

async function seedDatabase() {
  try {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 3306;
    console.log(`[SpendWise DB Seed] Connecting to database on ${host}:${port}...`);

    // 1. Seed Categories
    console.log('[SpendWise DB Seed] Seeding default categories...');
    const categoryMap = {};
    for (const categoryName of DEFAULT_CATEGORIES) {
      await pool.query(
        'INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name',
        [categoryName]
      );
      const [[row]] = await pool.query('SELECT id FROM categories WHERE name = ?', [categoryName]);
      categoryMap[categoryName] = row.id;
    }
    console.log('   ✅ Categories seeded successfully!');

    // 2. Seed Category Budgets
    console.log('[SpendWise DB Seed] Seeding initial category budget records...');
    const foodId = categoryMap['Food'];
    const transportId = categoryMap['Transportation'];
    const billsId = categoryMap['Bills'];

    if (foodId) {
      await pool.query(
        `INSERT INTO budgets (category_id, amount) VALUES (?, 1000000.00) ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
        [foodId]
      );
    }
    if (transportId) {
      await pool.query(
        `INSERT INTO budgets (category_id, amount) VALUES (?, 500000.00) ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
        [transportId]
      );
    }
    if (billsId) {
      await pool.query(
        `INSERT INTO budgets (category_id, amount) VALUES (?, 1500000.00) ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
        [billsId]
      );
    }
    console.log('   ✅ Category budgets seeded successfully!');

    // 3. Seed Sample Expenses
    console.log('[SpendWise DB Seed] Seeding sample expense entries...');
    const sampleExpenses = [
      {
        category: 'Food',
        description: 'Groceries shopping at supermarket',
        amount: 150000.00,
        payment_method: 'Debit Card',
        daysAgo: 1,
      },
      {
        category: 'Food',
        description: 'Lunch with colleagues',
        amount: 45000.00,
        payment_method: 'E-Wallet',
        daysAgo: 2,
      },
      {
        category: 'Bills',
        description: 'Electricity & Internet monthly bill',
        amount: 350000.00,
        payment_method: 'Bank Transfer',
        daysAgo: 5,
      },
      {
        category: 'Entertainment',
        description: 'Cinema tickets & snacks',
        amount: 85000.00,
        payment_method: 'E-Wallet',
        daysAgo: 8,
      },
      {
        category: 'Transportation',
        description: 'Gasoline refill for motorcycle',
        amount: 50000.00,
        payment_method: 'Cash',
        daysAgo: 10,
      },
      {
        category: 'Education',
        description: 'Online programming course textbook',
        amount: 120000.00,
        payment_method: 'Credit Card',
        daysAgo: 12,
      },
      {
        category: 'Shopping',
        description: 'New shoes and t-shirt',
        amount: 250000.00,
        payment_method: 'Debit Card',
        daysAgo: 15,
      },
      {
        category: 'Health',
        description: 'Vitamins & pharmacy prescription',
        amount: 65000.00,
        payment_method: 'Cash',
        daysAgo: 18,
      },
    ];

    for (const exp of sampleExpenses) {
      const categoryId = categoryMap[exp.category] || categoryMap['Other'];
      const expDate = new Date();
      expDate.setDate(expDate.getDate() - exp.daysAgo);
      const formattedDate = expDate.toISOString().split('T')[0];

      // Check if sample expense already exists
      const [existing] = await pool.query(
        'SELECT id FROM expenses WHERE description = ? AND expense_date = ?',
        [exp.description, formattedDate]
      );

      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO expenses (category_id, description, amount, payment_method, expense_date)
           VALUES (?, ?, ?, ?, ?)`,
          [categoryId, exp.description, exp.amount, exp.payment_method, formattedDate]
        );
      }
    }
    console.log('   ✅ Sample initial expense records seeded successfully!');

    console.log('🎉 Initial database field seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   Connection refused.');
      console.error('   👉 Please make sure MySQL / MariaDB / XAMPP service is STARTED and running!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Access denied.');
      console.error('   👉 Please check DB_USER and DB_PASSWORD in backend/.env');
    } else if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_DB_ERROR') {
      console.error(`   Database or table missing (${error.message}).`);
      console.error('   👉 Please run "npm run db:setup" FIRST before running db:seed!');
    } else {
      console.error('  ', error.message || error);
    }
    process.exit(1);
  }
}

seedDatabase();
