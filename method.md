# 💻 IT Asset Management System (MERN)

## 📌 Project Overview

An IT Asset Management System helps organizations keep track of all hardware and software assets.

Instead of maintaining Excel sheets, companies use this system to:

- Store asset information
- Track who is using each asset
- Monitor asset status
- Maintain purchase and warranty details
- View reports

This project is designed for **beginners learning MERN**.

The goal is to understand backend development, authentication, CRUD operations, database relationships, and deployment—not to build an enterprise-level product.

---

# Tech Stack

## Frontend

- React
- React Router
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# Folder Structure

```
it-asset-management/

client/
    src/
        components/
        pages/
        services/
        App.jsx

server/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
    server.js

```

---

# Features

## Authentication

- Register
- Login
- JWT Authentication
- Password Hashing
- Protected Routes

---

## Asset Management

Admin can

- Add Asset
- Edit Asset
- Delete Asset
- View Asset

Employee can

- View Assigned Assets

---

## Employee Management

Admin can

- Add Employee
- Edit Employee
- Delete Employee
- View Employee List

---

## Asset Assignment

Admin can

Assign Laptop

Assign Monitor

Assign Mouse

Assign Keyboard

Assign Software License

Each asset can only belong to one employee at a time.

---

## Dashboard

Display

Total Assets

Available Assets

Assigned Assets

Employees

Broken Assets

---

## Search

Search by

- Asset Name
- Asset ID
- Employee Name

---

## Filters

Filter assets by

- Available
- Assigned
- Maintenance
- Broken

---

## Asset History (Simple)

Every assignment creates a history record.

Example

```
Laptop Dell 5410

Assigned to John

Assigned Date

Returned Date
```

---

# Database Design

## User

```
{
    name,
    email,
    password,
    role
}
```

role

```
Admin
Employee
```

---

## Employee

```
{
    employeeId,
    name,
    department,
    designation,
    email,
    phone
}
```

---

## Asset

```
{
    assetId,
    assetName,
    category,
    brand,
    model,
    serialNumber,
    purchaseDate,
    warrantyExpiry,
    price,
    status,
    assignedTo
}
```

Status

```
Available

Assigned

Maintenance

Broken
```

---

## Asset History

```
{
    asset,
    employee,
    assignedDate,
    returnedDate
}
```

---

# API Design

## Auth

```
POST /api/auth/register

POST /api/auth/login
```

---

## Employees

```
GET /api/employees

GET /api/employees/:id

POST /api/employees

PUT /api/employees/:id

DELETE /api/employees/:id
```

---

## Assets

```
GET /api/assets

GET /api/assets/:id

POST /api/assets

PUT /api/assets/:id

DELETE /api/assets/:id
```

---

## Assignment

```
POST /api/assets/assign

POST /api/assets/return
```

---

## Dashboard

```
GET /api/dashboard
```

Returns

```
{
totalAssets,
availableAssets,
assignedAssets,
brokenAssets,
employees
}
```

---

# Learning Roadmap

## Phase 1

Node

Express

MongoDB

Mongoose

REST API

CRUD

---

Mini Goal

Employee CRUD

---

## Phase 2

Authentication

JWT

bcrypt

Middleware

Protected Routes

---

Mini Goal

Login System

---

## Phase 3

Asset CRUD

Relationships

Validation

---

Mini Goal

Asset Module

---

## Phase 4

Assign Assets

Populate()

References

Business Logic

---

Mini Goal

Asset Assignment

---

## Phase 5

Dashboard APIs

Aggregation

Counts

Statistics

---

Mini Goal

Dashboard Cards

---

## Phase 6

React

Axios

Authentication

Protected Routes

Role Based UI

---

# Project Flow

```
Admin Login

↓

Dashboard

↓

Add Employee

↓

Add Asset

↓

Assign Asset

↓

Employee Logs In

↓

View Assigned Assets

↓

Return Asset

↓

Asset becomes Available
```

---

# Business Logic

## While Assigning

Check

Asset exists

Employee exists

Asset status must be Available

Update asset

Create history record

Return Success

---

## While Returning

Check asset

Status should be Assigned

Update status

Remove assigned employee

Update history

Return Success

---

# Middleware

Authentication

```
verifyToken
```

Authorization

```
isAdmin
```

Error Handling

```
errorHandler
```

---

# Validation

Asset Name required

Asset ID unique

Employee Email unique

Price positive

Purchase Date valid

Warranty Date valid

---

# Environment Variables

```
PORT=5000

MONGO_URI=

JWT_SECRET=
```

---

# Easy Mongoose Relationships

Asset

```
assignedTo

↓

ObjectId

↓

Employee
```

History

```
asset

↓

ObjectId

↓

Asset
```

```
employee

↓

ObjectId

↓

Employee
```

---

# Backend Concepts You'll Learn

✔ Express Routing

✔ Controllers

✔ Services (optional)

✔ Middleware

✔ JWT

✔ Password Hashing

✔ CRUD

✔ MongoDB Relationships

✔ populate()

✔ Error Handling

✔ Validation

✔ REST API Design

✔ Authentication

✔ Authorization

✔ Business Logic

✔ MVC Pattern

---

# Future Improvements

Email Notifications

QR Code for Assets

Barcode Scanner

Excel Import

Excel Export

PDF Reports

Image Upload

Department Management

Vendor Management

Purchase Orders

Audit Logs

Role Permissions

Asset Depreciation

Maintenance Scheduler

Search Pagination

Dark Mode

Docker

Redis

CI/CD

AWS Deployment

---

# Project Development Order

Step 1

Authentication

↓

Step 2

Employee CRUD

↓

Step 3

Asset CRUD

↓

Step 4

Assignment Module

↓

Step 5

History Module

↓

Step 6

Dashboard

↓

Step 7

Frontend

↓

Step 8

Deployment

---

# Main Learning Goal

This project is **not about writing the shortest code**.

Instead, focus on writing code that is:

- Easy to read
- Well organized
- Beginner friendly
- One responsibility per function
- Properly separated into routes, controllers, models, and middleware
- Easy to extend with new features

If you understand this project completely, you'll gain practical experience with:
- Full-stack MERN development
- Authentication & authorization
- REST API design
- MongoDB data modeling
- Business logic implementation
- Real-world project structure
- Clean backend architecture