-- =========================================================
-- SpendWise Database Initialization Script
-- Automatically loaded on MySQL Container first boot
-- =========================================================

CREATE DATABASE IF NOT EXISTS spendwise
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spendwise;

-- ---------------------------------------------------------
-- Table: categories
-- Stores expense categories (Food, Transport, etc.)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Table: expenses
-- Stores expense records linked to categories
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT UNSIGNED NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    PRIMARY KEY (id),
    KEY idx_expenses_category_id (category_id),
    KEY idx_expenses_date (expense_date),
    CONSTRAINT fk_expenses_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_expenses_amount_positive CHECK (amount > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Table: budgets
-- Stores budget allocations by category
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS budgets (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id INT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_budgets_category_id (category_id),
    CONSTRAINT fk_budgets_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_budgets_amount_positive CHECK (amount > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Initial Seed Data: Categories
-- ---------------------------------------------------------
INSERT INTO categories (id, name) VALUES
(1, 'Food'),
(2, 'Transportation'),
(3, 'Education'),
(4, 'Entertainment'),
(5, 'Shopping'),
(6, 'Bills'),
(7, 'Health'),
(8, 'Other')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---------------------------------------------------------
-- Initial Seed Data: Category Budgets
-- ---------------------------------------------------------
INSERT INTO budgets (category_id, amount) VALUES
(1, 1000000.00),
(2, 500000.00),
(6, 1500000.00)
ON DUPLICATE KEY UPDATE amount=VALUES(amount);

-- ---------------------------------------------------------
-- Initial Seed Data: Sample Expenses
-- ---------------------------------------------------------
INSERT INTO expenses (category_id, description, amount, payment_method, expense_date) VALUES
(1, 'Groceries shopping at supermarket', 150000.00, 'Debit Card', CURRENT_DATE - INTERVAL 1 DAY),
(1, 'Lunch with colleagues', 45000.00, 'E-Wallet', CURRENT_DATE - INTERVAL 2 DAY),
(6, 'Electricity & Internet monthly bill', 350000.00, 'Bank Transfer', CURRENT_DATE - INTERVAL 5 DAY),
(4, 'Cinema tickets & snacks', 85000.00, 'E-Wallet', CURRENT_DATE - INTERVAL 8 DAY),
(2, 'Gasoline refill for motorcycle', 50000.00, 'Cash', CURRENT_DATE - INTERVAL 10 DAY),
(3, 'Online programming course textbook', 120000.00, 'Credit Card', CURRENT_DATE - INTERVAL 12 DAY),
(5, 'New shoes and t-shirt', 250000.00, 'Debit Card', CURRENT_DATE - INTERVAL 15 DAY),
(7, 'Vitamins & pharmacy prescription', 65000.00, 'Cash', CURRENT_DATE - INTERVAL 18 DAY);
