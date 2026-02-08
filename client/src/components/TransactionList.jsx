import { Trash2 } from 'lucide-react';

const TransactionList = ({ transactions, onDelete }) => {
    return (
        <div className="card flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h3>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No transactions found.</p>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((t) => (
                            <div key={t._id} className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center group hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">{t.category}</p>
                                        {t.party && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-stone-300">
                                                {t.party}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{t.description} • {new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className={`font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' :
                                            t.type === 'expense' ? 'text-red-500 dark:text-red-400' :
                                                t.type === 'lent' ? 'text-amber-500 dark:text-amber-400' : 'text-cyan-500 dark:text-cyan-400'
                                        }`}>
                                        {t.type === 'income' || t.type === 'repayment' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => onDelete(t._id)}
                                        className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
