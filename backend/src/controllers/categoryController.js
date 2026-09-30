const pool = require('../config/db');

// Get all categories
async function getAllCategories(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
}

// Get single category by ID
async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Category not found' },
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

// Create a new category
async function createCategory(req, res, next) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: 'Category name is required and cannot be empty' },
      });
    }

    const trimmedName = name.trim();

    // Check for duplicate name
    const [existing] = await pool.query('SELECT id FROM categories WHERE name = ?', [trimmedName]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'A category with this name already exists' },
      });
    }

    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [trimmedName]);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: result.insertId,
        name: trimmedName,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Update existing category
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: 'Category name is required' },
      });
    }

    const trimmedName = name.trim();

    // Check if category exists
    const [existingCategory] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Category not found' },
      });
    }

    // Check duplicate name on another category
    const [duplicate] = await pool.query('SELECT id FROM categories WHERE name = ? AND id != ?', [
      trimmedName,
      id,
    ]);
    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Another category with this name already exists' },
      });
    }

    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [trimmedName, id]);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        id: Number(id),
        name: trimmedName,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Delete a category
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Category not found' },
      });
    }

    // Check associated expenses
    const [expenses] = await pool.query('SELECT id FROM expenses WHERE category_id = ? LIMIT 1', [
      id,
    ]);
    if (expenses.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            'Cannot delete category because it has associated expenses. Please delete or reassign those expenses first.',
        },
      });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
