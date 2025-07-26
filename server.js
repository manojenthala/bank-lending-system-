const express = require('express');
const app = express();
const loanRoutes = require('./routes/loanRoutes');

app.use(express.json());
app.use('/api/loans', loanRoutes); // Route will be /api/loans/lend

const PORT = process.env.PORT || 3000;
app.listen(3001, () => console.log('Server running on port 3001'));
