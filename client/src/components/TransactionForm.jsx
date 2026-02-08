import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PlusCircle, Calendar } from 'lucide-react';

const TransactionForm = ({ onAddTransaction }) => {
    const todayISO = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        party: '',
        date: todayISO
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;
        onAddTransaction(formData);
        // Reset form but keep date
        setFormData({ ...formData, amount: '', category: '', description: '', party: '', date: todayISO });
    };

    return (
        <div className="card h-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                    <button
                        type="button"
                        className={`py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${formData.type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-black/20'}`}
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-black/20'}`}
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                    >
                        Expense
                    </button>
                    {/* Debt Group */}
                    <button
                        type="button"
                        className={`py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${formData.type === 'lent' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-black/20'}`}
                        onClick={() => setFormData({ ...formData, type: 'lent' })}
                    >
                        Lend
                    </button>
                    <button
                        type="button"
                        className={`py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${formData.type === 'borrowed' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-black/20'}`}
                        onClick={() => setFormData({ ...formData, type: 'borrowed' })}
                    >
                        Borrow
                    </button>
                </div>

                {/* Party Name (Conditional) */}
                {(['lent', 'borrowed'].includes(formData.type)) && (
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">
                            {formData.type === 'lent' ? 'Lending to:' : 'Borrowing from:'}
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Alice, Bob"
                            className="input-field"
                            value={formData.party || ''}
                            onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                            required
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Amount (₹)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Category</label>
                    <input
                        type="text"
                        placeholder="e.g. Food, Rent, Salary"
                        className="input-field"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Date</label>
                    <input
                        type="date"
                        className="input-field"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Description (Optional)</label>
                    <input
                        type="text"
                        className="input-field"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button type="submit" className="w-full btn-primary mt-2">Add Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;
