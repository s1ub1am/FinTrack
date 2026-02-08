const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense', 'lent', 'repayment', 'borrowed', 'payback'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., 'Food', 'Salary', 'Rent', 'Debt'
    description: { type: String },
    party: { type: String }, // For lending/borrowing: Person name
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
