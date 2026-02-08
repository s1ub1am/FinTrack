import { Download, Save, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/axiosHelper';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import DashboardCharts from '../components/DashboardCharts';
import Filters from '../components/Filters';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState({ monthlyData: [], pieData: [] });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: '',
        year: new Date().getFullYear().toString()
    });

    const [activeTab, setActiveTab] = useState('overview');

    const [budget, setBudget] = useState(localStorage.getItem('budget') || 20000);
    const [isEditingBudget, setIsEditingBudget] = useState(false);

    useEffect(() => {
        localStorage.setItem('budget', budget);
    }, [budget]);

    const handleExportCSV = () => {
        if (transactions.length === 0) return;

        const headers = ["Date,Type,Category,Amount,Description"];
        const rows = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.type,
            t.category,
            t.amount,
            `"${t.description || ''}"`
        ].join(','));

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchData();
    }, [filters]); // Re-fetch when filters change

    const fetchData = async () => {
        setLoading(true);
        try {
            // Calculate start and end date based on filters
            let startDate, endDate;
            if (filters.month) {
                startDate = new Date(filters.year, filters.month, 1).toISOString();
                endDate = new Date(filters.year, parseInt(filters.month) + 1, 0).toISOString();
            } else {
                startDate = new Date(filters.year, 0, 1).toISOString();
                endDate = new Date(filters.year, 11, 31).toISOString();
            }

            const [transRes, summaryRes] = await Promise.all([
                api.get('/transactions', { params: { startDate, endDate } }),
                api.get('/transactions/summary', { params: { year: filters.year } })
            ]);

            setTransactions(transRes.data);
            if (summaryRes.data) {
                setChartData(summaryRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (formData) => {
        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                date: new Date(formData.date)
            };
            const res = await api.post('/transactions', payload);
            // Refresh data
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter(t => t._id !== id));
            // Should ideally refetch summary too
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const calculateStats = () => {
        const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const lent = transactions.filter(t => t.type === 'lent').reduce((acc, t) => acc + t.amount, 0);
        const repaid = transactions.filter(t => t.type === 'repayment').reduce((acc, t) => acc + t.amount, 0);
        const borrowed = transactions.filter(t => t.type === 'borrowed').reduce((acc, t) => acc + t.amount, 0);
        const payback = transactions.filter(t => t.type === 'payback').reduce((acc, t) => acc + t.amount, 0);

        // Balance logic:
        // + Income
        // - Expense
        // - Lent (Money left wallet)
        // + Repaid (Money entered wallet)
        // + Borrowed (Money entered wallet)
        // - Payback (Money left wallet)
        const balance = income - expense - lent + repaid + borrowed - payback;

        // Budget progress
        const budgetProgress = Math.min((expense / budget) * 100, 100);

        return {
            income: round(income),
            expense: round(expense),
            balance: round(balance),
            budgetProgress: round(budgetProgress),
            lent: round(lent),
            repaid: round(repaid),
            borrowed: round(borrowed),
            payback: round(payback)
        };
    };

    const { income, expense, balance, budgetProgress, lent, repaid, borrowed, payback } = calculateStats();

    if (loading && transactions.length === 0) return <div className="text-center mt-10 text-gray-400">Loading...</div>;

    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-500">
                        Financial Overview
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your wealth wisely</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium shadow-sm hover:shadow active:scale-95 transition-transform"
                        title="Download CSV"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <div className="flex-1 overflow-x-auto pb-1 sm:pb-0">
                        {activeTab === 'overview' && <Filters filters={filters} onFilterChange={setFilters} />}
                    </div>
                </div>
            </div>

            {/* Budget Progress Section */}
            <div className="card mb-8 !p-4 border-l-4 border-emerald-500 relative overflow-hidden group">
                <div className="flex justify-between items-end mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Budget Goal</h3>
                        {!isEditingBudget && (
                            <button onClick={() => setIsEditingBudget(true)} className="text-gray-400 hover:text-emerald-500 transition-colors p-1" title="Edit Budget">
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        {isEditingBudget ? (
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">₹</span>
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="bg-transparent border-b border-emerald-500 text-2xl font-bold text-gray-800 dark:text-white w-32 focus:outline-none"
                                    autoFocus
                                    onBlur={() => setIsEditingBudget(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingBudget(false)}
                                />
                                <button onClick={() => setIsEditingBudget(false)} className="text-emerald-500"><Save className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">₹{Number(budget).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <span className={`text-sm font-bold ${budgetProgress > 100 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {Math.round(budgetProgress)}% Used
                        </span>
                        <p className="text-xs text-gray-400">₹{expense.toLocaleString()} spent</p>
                    </div>
                </div>
                {/* Progress Bar Background */}
                <div className="w-full bg-gray-200 dark:bg-stone-700 h-3 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${budgetProgress > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                        style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-700 pb-1">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Analytics
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'transactions' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Transactions
                </button>
                <button
                    onClick={() => setActiveTab('debts')}
                    className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'debts' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Debts
                </button>
            </div>

            <SummaryCards income={income} expense={expense} balance={balance} />

            <div>
                {activeTab === 'overview' && (
                    <>
                        <DashboardCharts monthlyData={chartData.monthlyData} pieData={chartData.pieData} />
                        {/* Optional: Show recent transactions in overview too? Maybe just a few. */}
                    </>
                )}

                {activeTab === 'transactions' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <TransactionForm onAddTransaction={handleAddTransaction} />
                        </div>
                        <div className="lg:col-span-2">
                            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                        </div>
                    </div>
                )}

                {activeTab === 'debts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            {/* Debt Summary Card - Net Worth */}
                            <div className="card bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
                                <h3 className="text-lg font-medium text-indigo-100 mb-2">Net Outstanding</h3>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-300">Total Owed to You:</span>
                                        <span>₹{(lent - repaid).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-red-300">Total You Owe:</span>
                                        <span>₹{(borrowed - payback).toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-white/20 my-2"></div>
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Net:</span>
                                        <span className={(lent - repaid - (borrowed - payback)) >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                            ₹{((lent - repaid) - (borrowed - payback)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active Debts Logic</h3>
                                <div className="space-y-3">
                                    {(() => {
                                        // Group by party
                                        const partyCalculations = {};
                                        transactions.forEach(t => {
                                            const party = t.party;
                                            if (!party) return;

                                            if (!partyCalculations[party]) partyCalculations[party] = 0;
                                            // Positive means THEY owe ME
                                            // Negative means I owe THEM

                                            if (t.type === 'lent') partyCalculations[party] += t.amount;
                                            if (t.type === 'repayment') partyCalculations[party] -= t.amount;
                                            if (t.type === 'borrowed') partyCalculations[party] -= t.amount;
                                            if (t.type === 'payback') partyCalculations[party] += t.amount;
                                        });

                                        const parties = Object.entries(partyCalculations).filter(([_, amount]) => Math.abs(amount) > 0);

                                        if (parties.length === 0) return <p className="text-gray-500 text-center py-4">No active debts.</p>;

                                        return parties.map(([party, amount]) => (
                                            <div key={party} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-white">{party}</p>
                                                    <p className="text-xs text-gray-500">{amount > 0 ? 'Owes you' : 'You owe'}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-bold ${amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        ₹{Math.abs(amount).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const settleAmountStr = window.prompt(`Settle amount for ${party}? (Max: ${Math.abs(amount)})`, Math.abs(amount));
                                                            if (!settleAmountStr) return;

                                                            const settleAmount = parseFloat(settleAmountStr);
                                                            if (isNaN(settleAmount) || settleAmount <= 0) {
                                                                alert('Invalid amount entered');
                                                                return;
                                                            }

                                                            const type = amount > 0 ? 'repayment' : 'payback';
                                                            const payload = {
                                                                type,
                                                                amount: settleAmount,
                                                                category: 'Debt Settlement',
                                                                description: 'Settled via Dashboard',
                                                                party,
                                                                date: new Date().toISOString().split('T')[0]
                                                            };
                                                            api.post('/transactions', payload).then(() => fetchData()).catch(console.error);
                                                        }}
                                                        className={`px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 ${amount > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                                                    >
                                                        {amount > 0 ? 'Collect' : 'Pay'}
                                                    </button>
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

