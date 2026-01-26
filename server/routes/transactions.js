const router = require('express').Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// GET ALL TRANSACTIONS (with filters)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, type, sort = 'desc' } = req.query;
        let query = { userId: req.user._id };

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        }

        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query).sort({ date: sort === 'desc' ? -1 : 1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET SUMMARY (for charts)
router.get('/summary', verifyToken, async (req, res) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31`);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: startOfYear, $lte: endOfYear }
        });

        const monthlyData = Array(12).fill(0).map((_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            income: 0,
            expense: 0
        }));

        const categoryData = {};

        transactions.forEach(t => {
            const monthIndex = new Date(t.date).getMonth();
            if (t.type === 'income') {
                monthlyData[monthIndex].income += t.amount;
            } else {
                monthlyData[monthIndex].expense += t.amount;
                // Category aggregation for expenses
                if (!categoryData[t.category]) {
                    categoryData[t.category] = 0;
                }
                categoryData[t.category] += t.amount;
            }
        });

        // Format category data for Recharts
        const pieData = Object.keys(categoryData).map(key => ({
            name: key,
            value: categoryData[key]
        }));

        res.json({ monthlyData, pieData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADD TRANSACTION
router.post('/', verifyToken, async (req, res) => {
    const { type, amount, category, description, date } = req.body;
    const newTransaction = new Transaction({
        userId: req.user._id,
        type,
        amount,
        category,
        description,
        date
    });

    try {
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE TRANSACTION
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found or not authorized' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
