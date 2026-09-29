# 💰 SpendWise — Expense & Budget Tracker

## 1. Project Overview

**SpendWise** is a web-based personal expense and budget management application designed to help users record, organize, and understand their daily spending.

Instead of simply recording transactions, SpendWise provides users with a centralized dashboard to monitor their expenses, manage spending categories, set monthly budgets, and understand their spending distribution.

The application will be developed as a **containerized web application** using Docker and Docker Compose, with PostgreSQL as the database.

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

Users can modify existing expense information.

### Delete

Users can delete an expense record.

---

## 4.2 Category Management

Users can organize their expenses into categories.

Default categories may include:

* Food
* Transportation
* Education
* Entertainment
* Shopping
* Bills
* Health
* Other

Users may also create, edit, and delete categories.

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

The system calculates the amount spent and the remaining budget based on recorded expenses.

---

## 4.4 Dashboard

The dashboard provides an overview of the user's financial activity.

The dashboard will display:

* Monthly budget
* Total spending
* Remaining budget
* Number of transactions
* Spending by category
* Recent transactions

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

The system may display an alert when the user's spending approaches or exceeds their monthly budget.

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

> These features are considered optional and will not block the completion of the core application.

---

# 6. Application Scope

The first version of SpendWise will focus on **personal expense management**.

### Included

* Expense CRUD
* Category CRUD
* Monthly budget
* Dashboard
* Spending visualization
* PostgreSQL database
* Docker containerization
* Basic validation
* Testing

### Not included in the first version

* Online banking integration
* Payment gateway
* Real financial transactions
* Investment management
* AI chatbot
* Machine learning prediction
* Mobile application
* Advanced financial planning

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
             │              FastAPI
             │                   │
             └────── HTTP ───────┘
                                 │
                                 ▼
                            PostgreSQL
```

The application will run inside Docker containers.

```text
                  Docker Compose
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   Application Container      PostgreSQL Container
          │                         │
          └───────── Network ───────┘
                                    │
                                    ▼
                              Persistent Volume
```

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

* Python
* FastAPI

The backend is responsible for:

* REST API.
* Business logic.
* Input validation.
* CRUD operations.
* Communication with PostgreSQL.
* Error handling.

---

## Database

Planned technology:

* PostgreSQL

The database is responsible for persistent storage of:

* Users
* Expenses
* Categories
* Budgets

---

## Containerization

Planned technologies:

* Docker
* Docker Compose

Docker will be used to package and run the application consistently across development environments.

Docker Compose will manage the application and database services.

---

## Version Control

* Git
* GitHub
* GitHub Projects

GitHub will be used for:

* Source code management.
* Issue tracking.
* Task management.
* Pull requests.
* Collaboration.
* Development progress tracking.

---

# 9. Database Design

The initial database will contain the following entities:

```text
Users
 │
 ├───────────────┐
 │               │
 ▼               ▼
Expenses       Budgets
 │
 ▼
Categories
```

### Users

| Field    | Description            |
| -------- | ---------------------- |
| id       | Unique user identifier |
| name     | User name              |
| email    | User email             |
| password | User password          |

### Categories

| Field | Description                |
| ----- | -------------------------- |
| id    | Unique category identifier |
| name  | Category name              |

### Expenses

| Field          | Description               |
| -------------- | ------------------------- |
| id             | Unique expense identifier |
| user_id        | Owner of the expense      |
| category_id    | Expense category          |
| description    | Expense description       |
| amount         | Expense amount            |
| payment_method | Payment method            |
| expense_date   | Date of expense           |

### Budgets

| Field   | Description              |
| ------- | ------------------------ |
| id      | Unique budget identifier |
| user_id | Budget owner             |
| month   | Budget month             |
| year    | Budget year              |
| amount  | Monthly budget amount    |

> The database schema may be adjusted during development if technical requirements change.

---

# 10. CRUD Requirements

The application must demonstrate complete CRUD functionality.

### Expense

```text
CREATE → Add expense
READ   → View expenses
UPDATE → Edit expense
DELETE → Delete expense
```

### Category

```text
CREATE → Add category
READ   → View categories
UPDATE → Edit category
DELETE → Delete category
```

The CRUD operations must interact with the PostgreSQL database rather than temporary in-memory data.

---

# 11. Docker & Containerization Plan

The application will be containerized using Docker.

The planned services are:

```text
app
└── SpendWise application

db
└── PostgreSQL database
```

Docker Compose will be used to run both services together.

Example:

```bash
docker compose up --build
```

The project must support:

* Application container.
* PostgreSQL container.
* Docker network.
* Environment variables.
* Persistent database volume.
* Reproducible application setup.

---

# 12. Testing Plan

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
* Set budget.

## API Testing

Verify backend endpoints and responses.

## Database Testing

Verify that:

* Data is correctly inserted.
* Data can be retrieved.
* Relationships work correctly.
* Updates are persisted.
* Deleted records are removed correctly.

## Integration Testing

Verify:

```text
Frontend
   ↓
Backend API
   ↓
PostgreSQL
```

works correctly as one system.

## Container Testing

Verify that the complete application can be started using:

```bash
docker compose up --build
```

and that the application continues to work after container recreation.

## Persistence Testing

Verify that PostgreSQL data remains available after containers are stopped and recreated.

---

# 13. Team Responsibilities

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
* PostgreSQL setup.
* Database schema.
* Migration.
* Seed data.
* Dockerfile.
* Docker Compose.
* PostgreSQL container.
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

* FastAPI setup.
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

# 14. Development Workflow

The project will use GitHub for collaborative development.

### Branching

Each feature should be developed using a separate branch.

Example:

```text
main
│
├── feature/database
├── feature/docker
├── feature/frontend
└── feature/backend
```

### Pull Request Workflow

```text
Create branch
      ↓
Implement feature
      ↓
Commit changes
      ↓
Push branch
      ↓
Create Pull Request
      ↓
Code Review
      ↓
Merge into main
```

The `main` branch should contain stable code.

---

# 15. Project Management Workflow

GitHub Projects will be used to track development progress.

### Status

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

### Priority

```text
Urgent
High
Medium
Low
```

### Main Work Areas

```text
Frontend
Backend
Database
Docker
Testing
Documentation
```

Each task should have:

* Assignee
* Priority
* Status
* Milestone
* Description
* Acceptance criteria

---

# 16. Development Roadmap

## Phase 1 — Planning & Foundation

**September 28–30, 2026**

* Finalize requirements.
* Finalize technology stack.
* Design system architecture.
* Design database ERD.
* Design UI wireframe.
* Initialize repositories and development environment.

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

---

## Phase 3 — Integration & Containerization

**October 5–6, 2026**

* Integrate frontend and backend.
* Configure Docker.
* Configure Docker Compose.
* Configure PostgreSQL container.
* Configure network.
* Configure persistent volume.
* Test complete application inside containers.

---

## Phase 4 — Testing & Finalization

**October 7–9, 2026**

* Functional testing.
* CRUD testing.
* Database testing.
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

# 17. Definition of Done

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

# 18. Project Deliverables

The final project will contain:

1. Working web application.
2. GitHub repository.
3. Docker configuration.
4. PostgreSQL database.
5. GitHub Project development board.
6. README documentation.
7. PDF project report.
8. Video documentation of the container implementation.

---

# 19. Success Criteria

The project will be considered successfully completed when:

* [ ] The web application can be accessed and used.
* [ ] Expense CRUD works correctly.
* [ ] Category CRUD works correctly.
* [ ] Budget management works.
* [ ] Data is stored in PostgreSQL.
* [ ] Frontend communicates with backend.
* [ ] Application can run using Docker Compose.
* [ ] Database uses persistent storage.
* [ ] Application passes functional and integration testing.
* [ ] GitHub repository contains the source code and documentation.
* [ ] Required video documentation is completed.
* [ ] Final PDF report is completed and submitted before the deadline.
