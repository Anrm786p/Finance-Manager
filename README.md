# API Documentation

This README provides an overview of the APIs implemented for managing users, accounts, taxes, invoices, income, and expenses. Additionally, the application includes endpoints for generating quarterly reports and utilities for quarter-based calculations and comparisons.

---

## Overview of APIs

### **User APIs**
- **Register User**: `POST /register`  
  Registers a new user (requires token).
- **Login User**: `POST /login`  
  Authenticates a user and returns a token.
- **Get User**: `GET /get-user/:id`  
  Fetches details of a specific user by ID (requires token).

> *User type "freelancer" can be retrieved using the `Get User` endpoint.*

---

### **Report APIs**
These endpoints generate quarterly reports by leveraging utility functions for quarter calculations and comparisons:

- **Income Report**: `GET /income-report/:userId`  
  Retrieves income data for the current and last quarters.
- **Expense Report**: `GET /expense-report/:userId`  
  Retrieves expense data for the current and last quarters.
- **Invoice Report**: `GET /invoice-report/:userId`  
  Retrieves invoice data for the current and last quarters.
- **Tax Report**: `GET /tax-report/:userId`  
  Retrieves tax data for the current and last quarters.

> *These reports include total amounts and percentage comparisons between quarters.*

---

### **Account APIs**
- **Create Account**: `POST /`  
  Creates a new account (requires token).
- **Get Accounts**: `GET /`  
  Fetches all accounts (requires token).
- **Update Account**: `PUT /:id`  
  Updates account details by ID (requires token).
- **Delete Account**: `DELETE /:id`  
  Deletes an account by ID (requires token).

> *The `Get Accounts` endpoint can be used to retrieve all accounts.*

---

### **Tax APIs**
- **Create Tax**: `POST /`  
  Creates a new tax record (requires token).
- **Get Taxes**: `GET /`  
  Fetches all tax records (requires token).

---

### **Invoice APIs**
- **Create Invoice**: `POST /`  
  Creates a new invoice (requires token).
- **Get Invoices**: `GET /`  
  Fetches all invoices (requires token).

---

### **Income APIs**
- **Create Income**: `POST /`  
  Creates a new income record (requires token).
- **Get Incomes**: `GET /`  
  Fetches all income records (requires token).
- **Update Income**: `PUT /:id`  
  Updates an income record by ID (requires token).
- **Delete Income**: `DELETE /:id`  
  Deletes an income record by ID (requires token).

---

### **Expense APIs**
- **Create Expense**: `POST /`  
  Creates a new expense record (requires token).
- **Get Expenses**: `GET /`  
  Fetches all expense records (requires token).
- **Update Expense**: `PUT /:id`  
  Updates an expense record by ID (requires token).
- **Delete Expense**: `DELETE /:id`  
  Deletes an expense record by ID (requires token).

---

## Utilities for Quarter Calculations
Custom utility functions have been implemented to:
- Calculate the start and end dates of the current and last quarters.
- Compare data between quarters to provide insights, such as percentage increases or decreases.

These utilities ensure accurate aggregation and reporting for income, expenses, invoices, and taxes.

---

## Notes
- All routes requiring authentication use a middleware function (`verifyToken`) to validate the user token.
- The APIs are designed to handle CRUD operations for various entities and provide insights into financial data for specific users.

For any further clarification, feel free to reach out!

