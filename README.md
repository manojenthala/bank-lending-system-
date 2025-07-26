# bank-lending-system-
A complete bank lending system with RESTful API and utility functions"
# Bank Lending System

A complete bank lending system with RESTful API and utility functions.

## Features

### Backend API
- **LEND:** Create loans for customers
- **PAYMENT:** Make EMI or lump sum payments  
- **LEDGER:** View loan transactions and status
- **ACCOUNT OVERVIEW:** List all loans for a customer

### Utility Functions
- Caesar Cipher (encode/decode)
- Indian Currency Formatter
- Combine Two Lists
- Minimize Loss

## Setup

1. Install dependencies: `npm install`
2. Set up MySQL database
3. Update database configuration in `config/db.js`
4. Start server: `node server.js`

## API Endpoints

- `POST /api/loans/lend` - Create a loan
- `POST /api/loans/payment` - Make a payment
- `GET /api/loans/loan/:loan_id/ledger` - View loan ledger
- `GET /api/loans/account-overview/:customer_id` - View account overview

## Testing

- Use Postman to test API endpoints
- Run `node testUtils.js` to test utility functions
