const pool = require('../config/db');

// Get overall dashboard summary (monthly budget, total spent, remaining, transaction count, spending by category, recent transactions)
async function getDashboardSummary(req, res, next) {
  try {
    const now = new Date();
    const month = Number(req.query.month || now.getMonth() + 1);
    const year = Number(req.query.year || now.getFullYear());

    // 1. Get Total Monthly Budget (sum of all category budgets)
    const [[budgetRow]] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_budget FROM budgets'
    );
    const monthlyBudget = Number(budgetRow.total_budget);

    // 2. Get Total Spent & Transaction Count for the month
    const [[spendingSummary]] = await pool.query(
      `SELECT 
        COALESCE(SUM(amount), 0) AS total_spent,
        COUNT(*) AS transaction_count
       FROM expenses
       WHERE MONTH(expense_date) = ? AND YEAR(expense_date) = ?`,
      [month, year]
    );

    const totalSpent = Number(spendingSummary.total_spent);
    const transactionCount = Number(spendingSummary.transaction_count);
    const remainingBudget = monthlyBudget - totalSpent;
    const percentageUsed = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0;

    // 3. Spending by Category
    const [categoryBreakdown] = await pool.query(
      `SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COALESCE(SUM(e.amount), 0) AS total_spent,
        COUNT(e.id) AS transaction_count
       FROM categories c
       LEFT JOIN expenses e ON e.category_id = c.id 
         AND MONTH(e.expense_date) = ? 
         AND YEAR(e.expense_date) = ?
       GROUP BY c.id, c.name
       ORDER BY total_spent DESC`,
      [month, year]
    );

    // Format percentages for categories
    const categorySpending = categoryBreakdown.map((cat) => ({
      category_id: cat.category_id,
      category_name: cat.category_name,
      total_spent: Number(cat.total_spent),
      transaction_count: Number(cat.transaction_count),
      percentage_of_total:
        totalSpent > 0 ? Number(((Number(cat.total_spent) / totalSpent) * 100).toFixed(1)) : 0,
    }));

    // 4. Recent Transactions (last 5 entries for this month)
    const [recentTransactions] = await pool.query(
      `SELECT 
        e.id,
        e.category_id,
        c.name AS category_name,
        e.description,
        e.amount,
        e.payment_method,
        DATE_FORMAT(e.expense_date, '%Y-%m-%d') AS expense_date
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE MONTH(e.expense_date) = ? AND YEAR(e.expense_date) = ?
       ORDER BY e.expense_date DESC, e.id DESC
       LIMIT 5`,
      [month, year]
    );

    res.json({
      success: true,
      data: {
        total_expense: totalSpent,
        total_budget: monthlyBudget,
        all_time_remaining_budget: remainingBudget,
        recent_transactions: recentTransactions,
        month,
        year,
        monthly_budget: monthlyBudget,
        total_spent: totalSpent,
        remaining_budget: remainingBudget,
        transaction_count: transactionCount,
        percentage_used: percentageUsed,
        category_spending: categorySpending,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardSummary,
};
