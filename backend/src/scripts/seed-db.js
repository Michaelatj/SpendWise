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
    console.log('[SpendWise DB Seed] Seeding default categories...');
    for (const category of DEFAULT_CATEGORIES) {
      await pool.query(
        'INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name',
        [category]
      );
    }
    console.log('✅ Default categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
