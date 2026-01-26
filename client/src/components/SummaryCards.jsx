import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const SummaryCards = ({ income, expense, balance }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card flex items-center gap-4 border-l-4 border-primary overflow-hidden">
                <div className="p-3 bg-indigo-500/20 rounded-full text-primary shrink-0">
                    <Wallet className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Balance</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate" title={`₹${balance.toFixed(2)}`}>₹{balance.toFixed(2)}</h3>
                </div>
            </div>

            <div className="card flex items-center gap-4 border-l-4 border-emerald-500 overflow-hidden">
                <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500 shrink-0">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
                    <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400 truncate" title={`+₹${income.toFixed(2)}`}>+₹{income.toFixed(2)}</h3>
                </div>
            </div>

            <div className="card flex items-center gap-4 border-l-4 border-red-500 overflow-hidden">
                <div className="p-3 bg-red-500/20 rounded-full text-red-500 shrink-0">
                    <TrendingDown className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expense</p>
                    <h3 className="text-2xl font-bold text-red-500 dark:text-red-400 truncate" title={`-₹${expense.toFixed(2)}`}>-₹{expense.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
