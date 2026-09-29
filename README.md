# 💰 SpendWise — Expense & Budget Tracker

## 1. Project Overview

**SpendWise** is a web-based personal expense and budget management application designed to help users record, organize, and understand their daily spending.

Instead of simply recording transactions, SpendWise provides users with a centralized dashboard to monitor their expenses, manage spending categories, set monthly budgets, and understand their spending distribution.

The application will be developed as a **containerized web application** using Docker and Docker Compose, with **MySQL/MariaDB** as the database.

### Main Goal

The main goal of SpendWise is to provide a simple and structured way for users to:

* Record their daily expenses.
* Organize expenses into categories.
* Set and monitor monthly budgets.
* View their spending history.
* Understand how their money is distributed across different categories.
* Run the complete application through a containerized environment.

---

# 2. Problem Statement

People often make many small purchases throughout the day but may not have a clear overview of where their money is going.

Traditional expense recording methods such as notes or spreadsheets can become inconvenient when the number of transactions increases. Users may record their expenses but still have difficulty understanding their overall spending patterns.

Therefore, SpendWise aims to combine **expense recording, budget management, and spending visualization** into a single web application.

---

# 3. Target Users

SpendWise is primarily designed for individuals who want to manage their personal spending.

Potential users include:

* University students.
* Young professionals.
* Individuals who want to monitor their monthly expenses.
* People who want a simple alternative to manually tracking expenses through spreadsheets.

The first version of SpendWise uses a **single-user model**, meaning the application focuses on managing one user's personal financial data without requiring an account or authentication system.

---

# 4. Core Features

## 4.1 Expense Management

Users can manage their expense records through CRUD operations.

### Create

Users can add a new expense containing:

* Description
* Amount
* Category
* Payment method
* Date

### Read

Users can view their recorded expenses in a structured table.

### Update

Users can modify existing expense information, such as correcting an incorrect amount, category, description, or payment method.

### Delete

Users can delete an expense record when it was entered incorrectly or is no longer needed.

---

## 4.2 Category Management

Users can organize their expenses into categories.

Example categories include:

* Food
* Transportation
* Education
* Entertainment
* Shopping
* Bills
* Health
* Other

Users can:

* Create categories.
* View categories.
* Edit categories.
* Delete categories.

---

## 4.3 Monthly Budget

Users can define a monthly spending budget.

Example:

```text
Monthly Budget
Rp3.000.000

Total Spent
Rp1.850.000

Remaining
Rp1.150.000
```

The system calculates the amount spent and remaining budget based on recorded expenses.

---

## 4.4 Dashboard

The dashboard provides an overview of the user's financial activity.

The dashboard will display:

* Monthly budget.
* Total spending.
* Remaining budget.
* Number of transactions.
* Spending by category.
* Recent transactions.

---

## 4.5 Spending Visualization

SpendWise will provide simple visualizations to help users understand their spending distribution.

Examples:

* Spending by category.
* Spending over time.
* Monthly spending summary.

The visualization is intended to make expense data easier to understand than viewing raw transaction records.

---

# 5. Optional Features

These features will only be implemented if the core features are completed early.

### Spending Alert

The system may display an alert when spending approaches or exceeds the monthly budget.

Example:

```text
⚠️ You have used 85% of your monthly budget.
```

### Spending Insight

The application may provide simple descriptive insights based on existing expense data.

Example:

```text
Your highest spending category this month is Food.
```

> These features are optional and will not block completion of the core application.

---

# 6. Application Scope

The first version of SpendWise focuses on **single-user personal expense management**.

### Included

* Expense CRUD.
* Category CRUD.
* Monthly budget.
* Dashboard.
* Spending visualization.
* MySQL/MariaDB database.
* Docker containerization.
* Basic validation.
* Testing.

### Not included in the first version

* User authentication.
* Multiple user accounts.
* Online banking integration.
* Payment gateway.
* Real financial transactions.
* Investment management.
* AI chatbot.
* Machine learning prediction.
* Mobile application.
* Advanced financial planning.

The scope is intentionally limited so the team can focus on delivering a stable and fully containerized application within the project deadline.

---

# 7. System Architecture

The application will use a simple client-server architecture.

```text
                    SpendWise
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Frontend             Backend API
             │                   │
             │                Node.js
             │                   │
             └────── HTTP ───────┘
                                 │
                                 ▼
                           MySQL/MariaDB
```

The frontend communicates with the backend through HTTP requests.

The backend is responsible for processing requests and communicating with the database.

The frontend does **not** connect directly to the database.

---

# 8. Technology Stack

## Frontend

Planned technologies:

* HTML
* CSS
* JavaScript

The frontend is responsible for:

* User interface.
* Forms.
* Expense tables.
* Dashboard.
* Charts.
* Communication with the backend API.

---

## Backend

Planned technologies:

* Node.js
* Express.js

The backend is responsible for:

* REST API.
* Business logic.
* Input validation.
* CRUD operations.
* Communication with MySQL/MariaDB.
* Error handling.

---

## Database

Planned technology:

* MySQL/MariaDB

The database is responsible for persistent storage of:

* Expenses.
* Categories.
* Monthly budgets.

The application uses a single-user database design, so a separate users table is not required for the first version.

---

## Containerization

Planned technologies:

* Docker
* Docker Compose

Docker will be used to package and run the application consistently across development environments.

Docker Compose will manage the application and database services.

---

## Version Control & Project Management

The project uses:

* Git
* GitHub
* GitHub Projects
* GitHub Issues
* GitHub Pull Requests

GitHub will be used for:

* Source code management.
* Issue tracking.
* Task management.
* Pull requests.
* Collaboration.
* Development progress tracking.

---

# 9. Database Design

The current database uses three main entities:

```text
Categories
    │
    │ 1 : N
    ▼
Expenses


Budgets
```

Because SpendWise is currently designed as a **single-user application**, there is no `Users` table or `user_id` relationship.

## Categories

| Field | Description                |
| ----- | -------------------------- |
| id    | Unique category identifier |
| name  | Category name              |

Categories are used to organize expense records.

One category can be associated with multiple expenses.

---

## Expenses

| Field          | Description               |
| -------------- | ------------------------- |
| id             | Unique expense identifier |
| category_id    | Related category          |
| description    | Expense description       |
| amount         | Expense amount            |
| payment_method | Payment method used       |
| expense_date   | Date of the expense       |

Each expense belongs to a category.

---

## Budgets

| Field  | Description              |
| ------ | ------------------------ |
| id     | Unique budget identifier |
| month  | Budget month             |
| year   | Budget year              |
| amount | Monthly budget amount    |

The budget table stores the spending limit for a particular month and year.

---

## Database Relationship

```text
┌──────────────┐
│  Categories  │
├──────────────┤
│ id           │
│ name         │
└──────┬───────┘
       │
       │ 1 : N
       │
       ▼
┌──────────────┐
│   Expenses   │
├──────────────┤
│ id           │
│ category_id  │
│ description  │
│ amount       │
│ payment_method│
│ expense_date │
└──────────────┘


┌──────────────┐
│   Budgets    │
├──────────────┤
│ id           │
│ month        │
│ year         │
│ amount       │
└──────────────┘
```

The database schema is implemented using SQL and initialized through the Node.js database setup scripts.

> The database structure may be adjusted during development if technical requirements change.

---

# 10. CRUD Requirements

The application must demonstrate complete CRUD functionality.

## Expense

```text
CREATE → Add expense
READ   → View expenses
UPDATE → Edit expense
DELETE → Delete expense
```

## Category

```text
CREATE → Add category
READ   → View categories
UPDATE → Edit category
DELETE → Delete category
```

## Budget

Budget management will support creating and updating the monthly budget.

```text
CREATE → Set monthly budget
READ   → View monthly budget
UPDATE → Change monthly budget
```

The CRUD operations must interact with the MySQL/MariaDB database rather than temporary in-memory data.

---

# 11. Docker & Containerization Plan

The application will be containerized using Docker.

The planned services are:

```text
app
└── SpendWise application

db
└── MySQL/MariaDB database
```

Docker Compose will be used to run the application and database together.

Example:

```bash
docker compose up --build
```

The project must support:

* Application container.
* MySQL/MariaDB container.
* Docker network.
* Environment variables.
* Persistent database volume.
* Reproducible application setup.

The database must remain persistent when the containers are stopped and recreated.

---

# 12. Environment Configuration

Environment-specific configuration should not be stored directly in the source code.

A local `.env` file will be used during development.

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spendwise
```

The actual `.env` file must **not** be committed to GitHub.

Instead, the project provides:

```text
.env.example
```

as a template for team members.

---

# 13. Testing Plan

Testing will be performed throughout development rather than only at the end.

## Functional Testing

Verify that application features work as expected.

Examples:

* Add expense.
* View expense.
* Edit expense.
* Delete expense.
* Create category.
* Update category.
* Delete category.
* Set budget.
* Update budget.

## API Testing

Verify backend endpoints and responses.

Examples:

* Request status codes.
* Response data.
* Invalid input handling.
* Missing data handling.
* CRUD operations.

## Database Testing

Verify that:

* Data is correctly inserted.
* Data can be retrieved.
* Category relationships work correctly.
* Updates are persisted.
* Deleted records are removed correctly.
* Budget data is stored correctly.

## Integration Testing

Verify:

```text
Frontend
   ↓
Backend API
   ↓
MySQL/MariaDB
```

works correctly as one system.

## Container Testing

Verify that the complete application can be started using:

```bash
docker compose up --build
```

and that the application continues to work after container recreation.

## Persistence Testing

Verify that database data remains available after containers are stopped and recreated.

---

# 14. Team Responsibilities

Responsibilities are initially divided as follows and may be adjusted during development.

| Member      | Main Responsibility |
| ----------- | ------------------- |
| **Michael** | Database & Docker   |
| **Diwa**    | Frontend            |
| **Enjel**   | Backend & Testing   |

### Michael — Database & Docker

Responsibilities:

* Database design.
* ERD.
* SQL schema.
* MySQL/MariaDB setup.
* Database connection setup.
* Database testing.
* Docker configuration.
* Docker Compose.
* Database container.
* Network configuration.
* Persistent volume.
* Container testing support.

### Diwa — Frontend

Responsibilities:

* UI design.
* Frontend structure.
* Dashboard.
* Expense management interface.
* Category management interface.
* Budget interface.
* Charts/visualization.
* Frontend-backend integration.

### Enjel — Backend & Testing

Responsibilities:

* Node.js/Express setup.
* API development.
* CRUD endpoints.
* Business logic.
* Validation.
* Error handling.
* API testing.
* Integration testing.
* Final system testing.

> Responsibilities are not permanently fixed. Team members may assist one another when a task becomes blocked or workload becomes unbalanced.

---

# 15. Development Workflow

The project will use GitHub for collaborative development.

## Branching Strategy

`main` is the stable branch.

Feature branches are created for specific tasks.

Example:

```text
main
│
├── feature/database-schema
├── feature/docker
├── feature/frontend
├── feature/expense-api
└── feature/dashboard
```

Branches should represent **work or features**, not individual team members.

### Pull Request Workflow

```text
Create Issue
      ↓
Create feature branch
      ↓
Implement feature
      ↓
Commit changes
      ↓
Push branch
      ↓
Create Pull Request
      ↓
Code Review / Testing
      ↓
Merge into main
```

The `main` branch should contain stable code.

---

# 16. Project Management Workflow

GitHub Projects will be used to track development progress.

## Status

```text
Backlog
   ↓
Todo
   ↓
In Progress
   ↓
Review
   ↓
Done
```

## Priority

```text
Urgent
High
Medium
Low
```

## Main Work Areas

```text
Frontend
Backend
Database
Docker
Testing
Documentation
```

Each task should contain:

* Assignee.
* Priority.
* Status.
* Milestone.
* Description.
* Acceptance criteria.

---

# 17. Development Roadmap

## Phase 1 — Planning & Foundation

**September 28–30, 2026**

* Finalize requirements.
* Finalize technology stack.
* Design system architecture.
* Design database ERD.
* Design UI wireframe.
* Initialize repository and development environment.
* Set up database schema.

---

## Phase 2 — Core Development

**October 1–4, 2026**

* Implement database.
* Implement backend API.
* Implement frontend.
* Implement Expense CRUD.
* Implement Category CRUD.
* Implement Budget functionality.
* Implement dashboard.
* Implement spending visualization.

---

## Phase 3 — Integration & Containerization

**October 5–6, 2026**

* Integrate frontend and backend.
* Configure Docker.
* Configure Docker Compose.
* Configure MySQL/MariaDB container.
* Configure network.
* Configure persistent volume.
* Test complete application inside containers.

---

## Phase 4 — Testing & Finalization

**October 7–9, 2026**

* Functional testing.
* CRUD testing.
* Database testing.
* API testing.
* Integration testing.
* Container testing.
* Bug fixing.
* README documentation.
* Final report.
* Video documentation.
* Final review.

---

## Phase 5 — Submission

**October 10, 2026**

Final submission before:

**23:59 WIB**

---

# 18. Definition of Done

A feature is considered **Done** only when:

* [ ] Implementation is complete.
* [ ] Feature works as expected.
* [ ] Database interaction works correctly.
* [ ] Related API works correctly.
* [ ] Frontend integration works when applicable.
* [ ] Basic validation is implemented.
* [ ] Feature has been tested.
* [ ] Code has been reviewed.
* [ ] Changes are merged into `main`.

---

# 19. Project Deliverables

The final project will contain:

1. Working web application.
2. GitHub repository.
3. Docker configuration.
4. MySQL/MariaDB database.
5. GitHub Project development board.
6. README documentation.
7. PDF project report.
8. Video documentation of the complete container implementation.

---

# 20. Development Tools

The following tools are used or planned for the development of SpendWise.

## Development

* Visual Studio Code.
* Node.js.
* npm.
* HTML/CSS/JavaScript.
* Express.js.
* MySQL/MariaDB.
* MySQL Workbench.
* XAMPP/phpMyAdmin for local database administration when applicable.

## Version Control & Collaboration

* Git.
* GitHub.
* GitHub Projects.
* GitHub Issues.
* GitHub Pull Requests.

## API & Testing

* Postman or another API testing tool.
* Browser developer tools.

## Design & Documentation

* draw.io / diagrams.net for ERD and system diagrams.
* Microsoft Word or Google Docs for the project report.
* Screen recording software for the required project video.

> Tools may be adjusted during development if the team identifies a more suitable alternative.

---

# 21. Success Criteria

The project will be considered successfully completed when:

* [ ] The web application can be accessed and used.
* [ ] Expense CRUD works correctly.
* [ ] Category CRUD works correctly.
* [ ] Budget management works.
* [ ] Data is stored in MySQL/MariaDB.
* [ ] Frontend communicates with the backend.
* [ ] Application can run using Docker Compose.
* [ ] Database uses persistent storage.
* [ ] Application passes functional and integration testing.
* [ ] GitHub repository contains the source code and documentation.
* [ ] Required video documentation is completed.
* [ ] Final PDF report is completed and submitted before the deadline.
