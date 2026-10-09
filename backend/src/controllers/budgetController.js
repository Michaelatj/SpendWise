const pool = require('../config/db');

// Get all category budgets with spent calculation for current month
async function getBudgets(req, res, next) {
  try {
    const now = new Date();
    const currentMonth = Number(req.query.month || now.getMonth() + 1);
    const currentYear = Number(req.query.year || now.getFullYear());

    const [rows] = await pool.query(
      `SELECT 
        b.id,
        b.category_id,
        c.name AS category_name,
        b.amount,
        COALESCE(SUM(e.amount), 0) AS total_spent,
        (b.amount - COALESCE(SUM(e.amount), 0)) AS remaining
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       LEFT JOIN expenses e ON e.category_id = b.category_id 
         AND MONTH(e.expense_date) = ? 
         AND YEAR(e.expense_date) = ?
       GROUP BY b.id, b.category_id, c.name, b.amount
       ORDER BY c.name ASC`,
      [currentMonth, currentYear]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
}

// Create or update (upsert) budget for a category
async function setBudget(req, res, next) {
  try {
    const { category_id, amount } = req.body;

    if (!category_id) {
      return res.status(400).json({ success: false, error: { message: 'Category ID is required' } });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Amount must be a positive number' } });
    }

    await pool.query(
      `INSERT INTO budgets (category_id, amount)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
      [Number(category_id), Number(amount)]
    );

    const [rows] = await pool.query(
      `SELECT b.id, b.category_id, c.name AS category_name, b.amount
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.category_id = ?`,
      [Number(category_id)]
    );

    res.status(200).json({
      success: true,
      message: 'Category budget saved successfully',
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
}

// Update existing budget by ID
async function updateBudgetById(req, res, next) {
  try {
    const { id } = req.params;
    const { category_id, amount } = req.body;

    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Amount must be a positive number' } });
    }

    const [existing] = await pool.query('SELECT id FROM budgets WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Budget not found' } });
    }

    if (category_id) {
      await pool.query('UPDATE budgets SET category_id = ?, amount = ? WHERE id = ?', [
        Number(category_id),
        Number(amount),
        id,
      ]);
    } else {
      await pool.query('UPDATE budgets SET amount = ? WHERE id = ?', [Number(amount), id]);
    }

    const [updated] = await pool.query(
      `SELECT b.id, b.category_id, c.name AS category_name, b.amount
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
}

// Delete budget by ID
async function deleteBudgetById(req, res, next) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM budgets WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Budget not found' } });
    }

    await pool.query('DELETE FROM budgets WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBudgets,
  setBudget,
  updateBudgetById,
  deleteBudgetById,
};
