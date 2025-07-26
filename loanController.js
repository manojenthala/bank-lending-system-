const db = require('../config/db');

exports.getLoanLedger = async (req, res) => {
  try {
    const loan_id = req.params.loan_id;
    // Get loan details
    const [loanResult] = await db.query(
      'SELECT * FROM loans WHERE loan_id = ?',
      [loan_id]
    );
    if (loanResult.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    const loan = loanResult[0];
    const totalAmount = parseFloat(loan.total_amount);
    const totalEMIs = loan.loan_period * 12;
    const emiAmount = parseFloat(loan.emi);

    // Get payments made
    const [paymentResult] = await db.query(
      'SELECT SUM(amount) AS total_paid, COUNT(*) AS emis_paid FROM payments WHERE loan_id = ?',
      [loan_id]
    );
    const total_paid = parseFloat(paymentResult[0].total_paid) || 0;
    const emis_paid = paymentResult[0].emis_paid || 0;
    const remaining_balance = totalAmount - total_paid;
    const emis_left = totalEMIs - emis_paid;

    res.json({
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: parseFloat(loan.principal),
      interest: parseFloat(loan.interest),
      total_amount: totalAmount,
      emi_amount: emiAmount,
      emis_paid,
      total_paid,
      remaining_balance,
      emis_left
    });
  } catch (err) {
    console.error('Error getting loan ledger:', err);
    res.status(500).json({ error: 'Database error getting loan ledger', details: err.message });
  }
};

// LEND: Create a new loan
exports.lendMoney = async (req, res) => {
  try {
    const { customer_id, principal, loan_period, rate_of_interest } = req.body;
    if (!customer_id || !principal || !loan_period || !rate_of_interest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Calculations
    const P = parseFloat(principal);
    const N = parseFloat(loan_period); // in years
    const R = parseFloat(rate_of_interest);
    const interest = P * N * R / 100;
    const total_amount = P + interest;
    const emi = total_amount / (N * 12);
    const loan_id = require('crypto').randomUUID();
    const issued_date = new Date();

    // Insert into loans
    await db.query(
      `INSERT INTO loans (loan_id, customer_id, principal, interest, total_amount, emi, loan_period, rate_of_interest, issued_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [loan_id, customer_id, P, interest, total_amount, emi, N, R, issued_date]
    );
    res.json({
      loan_id,
      total_amount,
      emi,
      interest
    });
  } catch (err) {
    console.error('Error lending money:', err);
    res.status(500).json({ error: 'Database error lending money', details: err.message });
  }
};

// PAYMENT: Make a payment (EMI or lump sum)
exports.makePayment = async (req, res) => {
  try {
    const { loan_id, amount } = req.body;
    if (!loan_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await db.query(
      `INSERT INTO payments (loan_id, amount, payment_date) VALUES (?, ?, NOW())`,
      [loan_id, amount]
    );
    res.json({ message: 'Payment recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error making payment', details: err.message });
  }
};

// ACCOUNT OVERVIEW: List all loans for a customer
exports.getAccountOverview = async (req, res) => {
  try {
    const { customer_id } = req.params;
    // Get all loans for customer
    const [loans] = await db.query(
      `SELECT * FROM loans WHERE customer_id = ?`,
      [customer_id]
    );
    if (loans.length === 0) {
      return res.json({ loans: [] });
    }
    // For each loan, get payments
    const loanIds = loans.map(l => l.loan_id);
    let payments = [];
    if (loanIds.length > 0) {
      const [payRows] = await db.query(
        `SELECT loan_id, SUM(amount) as paid FROM payments WHERE loan_id IN (${loanIds.map(() => '?').join(',')}) GROUP BY loan_id`,
        loanIds
      );
      payments = payRows;
    }
    // Map payments to loans
    const overview = loans.map(loan => {
      const paid = payments.find(p => p.loan_id === loan.loan_id)?.paid || 0;
      const emis_total = loan.loan_period * 12;
      const emis_left = Math.ceil((loan.total_amount - paid) / loan.emi);
      return {
        loan_id: loan.loan_id,
        principal: loan.principal,
        total_amount: loan.total_amount,
        emi: loan.emi,
        total_interest: loan.interest,
        amount_paid: paid,
        emis_left: emis_left < 0 ? 0 : emis_left
      };
    });
    res.json({ loans: overview });
  } catch (err) {
    res.status(500).json({ error: 'Database error getting account overview', details: err.message });
  }
};
