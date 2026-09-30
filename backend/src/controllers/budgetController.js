const pool = require('../config/db');

// Get monthly budget for specified month/year (or current month if omitted)
async function getBudget(req, res, next) {
  try {
    const now = new Date();
    const month = Number(req.query.month || now.getMonth() + 1);
    const year = Number(req.query.year || now.getFullYear());

    if (month < 1 || month > 12) {
      return res.status(400).json({ success: false, error: { message: 'Month must be between 1 and 12' } });
    }

    const [budgetRows] = await pool.query(
      'SELECT id, month, year, amount FROM budgets WHERE month = ? AND year = ?',
      [month, year]
    );

    // Calculate spent for this month
    const [[spentRow]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_spent 
       FROM expenses 
       WHERE MONTH(expense_date) = ? AND YEAR(expense_date) = ?`,
      [month, year]
    );

    const budgetAmount = budgetRows.length > 0 ? Number(budgetRows[0].amount) : 0;
    const totalSpent = Number(spentRow.total_spent);
    const remaining = budgetAmount - totalSpent;

    res.json({
      success: true,
      data: {
        budget: budgetRows.length > 0 ? budgetRows[0] : null,
        month,
        year,
        amount: budgetAmount,
        total_spent: totalSpent,
        remaining,
        percentage_used: budgetAmount > 0 ? Math.min(100, Math.round((totalSpent / budgetAmount) * 100)) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Set or update (upsert) monthly budget
async function setBudget(req, res, next) {
  try {
    const { month, year, amount } = req.body;

    if (!month || Number(month) < 1 || Number(month) > 12) {
      return res.status(400).json({ success: false, error: { message: 'Month must be between 1 and 12' } });
    }
    if (!year || Number(year) < 2000) {
      return res.status(400).json({ success: false, error: { message: 'Valid year is required' } });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Amount must be a positive number' } });
    }

    await pool.query(
      `INSERT INTO budgets (month, year, amount)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
      [Number(month), Number(year), Number(amount)]
    );

    const [budgetRows] = await pool.query(
      'SELECT id, month, year, amount FROM budgets WHERE month = ? AND year = ?',
      [Number(month), Number(year)]
    );

    res.status(200).json({
      success: true,
      message: 'Monthly budget saved successfully',
      data: budgetRows[0],
    });
  } catch (error) {
    next(error);
  }
}

// Update existing budget by ID
async function updateBudgetById(req, res, next) {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Amount must be a positive number' } });
    }

    const [existing] = await pool.query('SELECT id FROM budgets WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Budget not found' } });
    }

    await pool.query('UPDATE budgets SET amount = ? WHERE id = ?', [Number(amount), id]);

    const [updated] = await pool.query('SELECT id, month, year, amount FROM budgets WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBudget,
  setBudget,
  updateBudgetById,
};
