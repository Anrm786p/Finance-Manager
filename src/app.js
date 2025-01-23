const express = require('express');
require('dotenv').config();
const connectDB = require('./config/mongoConfig');
const userRoutes = require('./routes/userRoutes');
const taxRoutes = require('./routes/taxRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();

app.use(express.json());


// User Routes
app.use('/api/user', userRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/account', accountRoutes);

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
