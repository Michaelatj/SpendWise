# 🚀 SpendWise Backend API

The backend API service for **SpendWise — Expense & Budget Tracker**, built using Node.js, Express.js, and MySQL.

---

## 🛠️ Requirements & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/) (running locally or via Docker/XAMPP)

---

## 🚀 Quick Start Commands

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and adjust the database credentials if necessary:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spendwise
```

### 4. Setup & Seed Database
Ensure your MySQL server is running, then run:

```bash
# Create database and tables (categories, expenses, budgets)
npm run db:setup

# Seed default categories (Food, Transportation, Bills, etc.)
npm run db:seed
```

### 5. Run the Server

#### Development Mode (Auto-restarts on code changes using nodemon)
```bash
npm run dev
```

#### Production / Standard Mode
```bash
npm start
```

The server will start listening at `http://localhost:5000`.

---

# 📘 SpendWise API Documentation

Base URL: `http://localhost:5000`

All request payloads should use `Content-Type: application/json`.

---

## 1. Health & Server Status

### GET `/api/health`
Checks backend API service status and database connectivity.

**Response `200 OK`**:
```json
{
  "status": "OK",
  "timestamp": "2026-09-30T15:00:00.000Z",
  "service": "SpendWise API",
  "database": "Connected"
}
```

---

## 2. Category API

### GET `/api/categories`
Retrieve all expense categories ordered alphabetically.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Bills" },
    { "id": 2, "name": "Education" },
    { "id": 3, "name": "Entertainment" },
    { "id": 4, "name": "Food" },
    { "id": 5, "name": "Health" },
    { "id": 6, "name": "Other" },
    { "id": 7, "name": "Shopping" },
    { "id": 8, "name": "Transportation" }
  ]
}
```

---

### GET `/api/categories/:id`
Retrieve details of a single category by its ID.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Food"
  }
}
```

**Response `404 Not Found`**:
```json
{
  "success": false,
  "error": {
    "message": "Category not found"
  }
}
```

---

### POST `/api/categories`
Create a new category.

**Request Body**:
```json
{
  "name": "Subscriptions"
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 9,
    "name": "Subscriptions"
  }
}
```

**Response `400 Bad Request`**:
```json
{
  "success": false,
  "error": {
    "message": "A category with this name already exists"
  }
}
```

---

### PUT `/api/categories/:id`
Update an existing category.

**Request Body**:
```json
{
  "name": "Utilities & Bills"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Utilities & Bills"
  }
}
```

---

### DELETE `/api/categories/:id`
Delete a category. Cannot delete if expenses are linked to this category.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Response `400 Bad Request`**:
```json
{
  "success": false,
  "error": {
    "message": "Cannot delete category because it has associated expenses. Please delete or reassign those expenses first."
  }
}
```

---

## 3. Expense API

### GET `/api/expenses`
Retrieve expense records with optional filters.

**Query Parameters**:
| Parameter | Type | Description | Example |
| --- | --- | --- | --- |
| `month` | integer | Filter by month (1 - 12) | `9` |
| `year` | integer | Filter by year | `2026` |
| `category_id` | integer | Filter by category ID | `4` |
| `search` | string | Search description | `lunch` |
| `limit` | integer | Items per page (default: 50) | `10` |
| `offset` | integer | Pagination offset (default: 0) | `0` |

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category_id": 4,
      "category_name": "Food",
      "description": "Lunch at restaurant",
      "amount": 45000.00,
      "payment_method": "E-Wallet",
      "expense_date": "2026-09-30"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

---

### GET `/api/expenses/:id`
Retrieve details of a single expense.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "category_id": 4,
    "category_name": "Food",
    "description": "Lunch at restaurant",
    "amount": 45000.00,
    "payment_method": "E-Wallet",
    "expense_date": "2026-09-30"
  }
}
```

---

### POST `/api/expenses`
Create a new expense entry.

**Request Body**:
```json
{
  "category_id": 4,
  "description": "Groceries shopping",
  "amount": 150000.00,
  "payment_method": "Debit Card",
  "expense_date": "2026-09-30"
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "id": 2,
    "category_id": 4,
    "category_name": "Food",
    "description": "Groceries shopping",
    "amount": 150000,
    "payment_method": "Debit Card",
    "expense_date": "2026-09-30"
  }
}
```

---

### PUT `/api/expenses/:id`
Update an existing expense entry.

**Request Body**:
```json
{
  "category_id": 4,
  "description": "Groceries shopping (discount applied)",
  "amount": 135000.00,
  "payment_method": "Debit Card",
  "expense_date": "2026-09-30"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "id": 2,
    "category_id": 4,
    "category_name": "Food",
    "description": "Groceries shopping (discount applied)",
    "amount": 135000,
    "payment_method": "Debit Card",
    "expense_date": "2026-09-30"
  }
}
```

---

### DELETE `/api/expenses/:id`
Delete an expense entry.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

## 4. Budget API

### GET `/api/budgets`
Retrieve budget information for a specific month and year along with total spent and remaining amount.

**Query Parameters**:
- `month` (optional, default: current month)
- `year` (optional, default: current year)

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "budget": {
      "id": 1,
      "month": 9,
      "year": 2026,
      "amount": 3000000.00
    },
    "month": 9,
    "year": 2026,
    "amount": 3000000.00,
    "total_spent": 1850000.00,
    "remaining": 1150000.00,
    "percentage_used": 62
  }
}
```

---

### POST `/api/budgets`
Create or update (upsert) a monthly budget.

**Request Body**:
```json
{
  "month": 9,
  "year": 2026,
  "amount": 3000000.00
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Monthly budget saved successfully",
  "data": {
    "id": 1,
    "month": 9,
    "year": 2026,
    "amount": 3000000.00
  }
}
```

---

### PUT `/api/budgets/:id`
Update an existing budget amount by budget ID.

**Request Body**:
```json
{
  "amount": 3500000.00
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Budget updated successfully",
  "data": {
    "id": 1,
    "month": 9,
    "year": 2026,
    "amount": 3500000.00
  }
}
```

---

## 5. Dashboard API

### GET `/api/dashboard`
Retrieve complete dashboard metrics, category breakdown, and recent transactions.

**Query Parameters**:
- `month` (optional, default: current month)
- `year` (optional, default: current year)

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "month": 9,
    "year": 2026,
    "monthly_budget": 3000000,
    "total_spent": 1850000,
    "remaining_budget": 1150000,
    "transaction_count": 12,
    "percentage_used": 62,
    "category_spending": [
      {
        "category_id": 4,
        "category_name": "Food",
        "total_spent": 850000,
        "transaction_count": 6,
        "percentage_of_total": 45.9
      },
      {
        "category_id": 1,
        "category_name": "Bills",
        "total_spent": 500000,
        "transaction_count": 2,
        "percentage_of_total": 27.0
      }
    ],
    "recent_transactions": [
      {
        "id": 12,
        "category_id": 4,
        "category_name": "Food",
        "description": "Dinner",
        "amount": 75000.00,
        "payment_method": "Cash",
        "expense_date": "2026-09-30"
      }
    ]
  }
}
```
