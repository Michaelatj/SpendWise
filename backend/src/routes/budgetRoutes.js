const express = require('express');
const router = express.Router();
const {
  getBudgets,
  setBudget,
  updateBudgetById,
  deleteBudgetById,
} = require('../controllers/budgetController');

router.get('/', getBudgets);
router.post('/', setBudget);
router.put('/:id', updateBudgetById);
router.delete('/:id', deleteBudgetById);

module.exports = router;
