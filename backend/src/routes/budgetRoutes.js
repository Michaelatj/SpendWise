const express = require('express');
const router = express.Router();
const {
  getBudget,
  setBudget,
  updateBudgetById,
} = require('../controllers/budgetController');

router.get('/', getBudget);
router.post('/', setBudget);
router.put('/:id', updateBudgetById);

module.exports = router;
