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
            const res = await api.post('/transactions', formData);
            // Optimistic update or refetch
            fetchData();
            setActiveTab('overview'); // Switch to overview to see impact or stay? User preference. Let's stay.
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
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const balance = income - expense;
        // Budget progress
        const budgetProgress = Math.min((expense / budget) * 100, 100);

        return { income, expense, balance, budgetProgress };
    };

    const { income, expense, balance, budgetProgress } = calculateStats();

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
            </div>

            <SummaryCards income={income} expense={expense} balance={balance} />

            {activeTab === 'overview' ? (
                <div>
                    <DashboardCharts monthlyData={chartData.monthlyData} pieData={chartData.pieData} />
                    {/* Optional: Show recent transactions in overview too? Maybe just a few. */}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <TransactionForm onAddTransaction={handleAddTransaction} />
                    </div>
                    <div className="lg:col-span-2">
                        <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

