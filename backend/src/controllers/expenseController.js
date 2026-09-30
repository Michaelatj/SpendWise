const pool = require('../config/db');

// Get expenses with optional filtering (month, year, category_id, search, limit, offset)
async function getAllExpenses(req, res, next) {
  try {
    const { month, year, category_id, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        e.id,
        e.category_id,
        c.name AS category_name,
        e.description,
        e.amount,
        e.payment_method,
        DATE_FORMAT(e.expense_date, '%Y-%m-%d') AS expense_date
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (month) {
      query += ' AND MONTH(e.expense_date) = ?';
      params.push(Number(month));
    }

    if (year) {
      query += ' AND YEAR(e.expense_date) = ?';
      params.push(Number(year));
    }

    if (category_id) {
      query += ' AND e.category_id = ?';
      params.push(Number(category_id));
    }

    if (search) {
      query += ' AND e.description LIKE ?';
      params.push(`%${search.trim()}%`);
    }

    query += ' ORDER BY e.expense_date DESC, e.id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);

    // Get total count for pagination metadata
    let countQuery = 'SELECT COUNT(*) as total FROM expenses e WHERE 1=1';
    const countParams = [];

    if (month) {
      countQuery += ' AND MONTH(e.expense_date) = ?';
      countParams.push(Number(month));
    }
    if (year) {
      countQuery += ' AND YEAR(e.expense_date) = ?';
      countParams.push(Number(year));
    }
    if (category_id) {
      countQuery += ' AND e.category_id = ?';
      countParams.push(Number(category_id));
    }
    if (search) {
      countQuery += ' AND e.description LIKE ?';
      countParams.push(`%${search.trim()}%`);
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get single expense by ID
async function getExpenseById(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        e.id,
        e.category_id,
        c.name AS category_name,
        e.description,
        e.amount,
        e.payment_method,
        DATE_FORMAT(e.expense_date, '%Y-%m-%d') AS expense_date
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
    `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Expense not found' },
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
}

// Create a new expense
async function createExpense(req, res, next) {
  try {
    const { category_id, description, amount, payment_method, expense_date } = req.body;

    // Validation
    if (!category_id) {
      return res.status(400).json({ success: false, error: { message: 'Category ID is required' } });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ success: false, error: { message: 'Description is required' } });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Amount must be a positive number' } });
    }
    if (!payment_method || payment_method.trim() === '') {
      return res.status(400).json({ success: false, error: { message: 'Payment method is required' } });
    }
    if (!expense_date) {
      return res.status(400).json({ success: false, error: { message: 'Expense date is required (YYYY-MM-DD)' } });
    }

    // Verify category exists
    const [category] = await pool.query('SELECT id, name FROM categories WHERE id = ?', [category_id]);
    if (category.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'Invalid category ID' } });
    }

    const [result] = await pool.query(
      `INSERT INTO expenses (category_id, description, amount, payment_method, expense_date)
       VALUES (?, ?, ?, ?, ?)`,
      [category_id, description.trim(), Number(amount), payment_method.trim(), expense_date]
    );

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: {
        id: result.insertId,
        category_id: Number(category_id),
        category_name: category[0].name,
        description: description.trim(),
        amount: Number(amount),
        payment_method: payment_method.trim(),
        expense_date,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Update existing expense
async function updateExpense(req, res, next) {
  try {
    const { id } = req.params;
    const { category_id, description, amount, payment_method, expense_date } = req.body;

    // Check if expense exists
    const [existing] = await pool.query('SELECT id FROM expenses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Expense not found' } });
    }

    // Validation
    if (!category_id) {
      return res.status(400).json({ success: false, error: { message: 'Category ID is required' } });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ success: false, error: { message: 'Description is required' } });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Amount must be a positive number' } });
    }
    if (!payment_method || payment_method.trim() === '') {
      return res.status(400).json({ success: false, error: { message: 'Payment method is required' } });
    }
    if (!expense_date) {
      return res.status(400).json({ success: false, error: { message: 'Expense date is required' } });
    }

    // Verify category exists
    const [category] = await pool.query('SELECT id, name FROM categories WHERE id = ?', [category_id]);
    if (category.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'Invalid category ID' } });
    }

    await pool.query(
      `UPDATE expenses 
       SET category_id = ?, description = ?, amount = ?, payment_method = ?, expense_date = ?
       WHERE id = ?`,
      [category_id, description.trim(), Number(amount), payment_method.trim(), expense_date, id]
    );

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        id: Number(id),
        category_id: Number(category_id),
        category_name: category[0].name,
        description: description.trim(),
        amount: Number(amount),
        payment_method: payment_method.trim(),
        expense_date,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Delete an expense
async function deleteExpense(req, res, next) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM expenses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'Expense not found' } });
    }

    await pool.query('DELETE FROM expenses WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
