import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PlusCircle, Calendar } from 'lucide-react';

const TransactionForm = ({ onAddTransaction }) => {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date()
    });

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;
        onAddTransaction(formData);
        setFormData({ ...formData, amount: '', category: '', description: '', date: new Date() });
    };

    return (
        <div className="card h-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Type Selection */}
                <div className="flex gap-4 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${formData.type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                    >
                        Expense
                    </button>
                </div>

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
