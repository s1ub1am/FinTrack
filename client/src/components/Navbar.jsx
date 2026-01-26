import { Link } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout }) => {
    return (
        <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0 flex justify-center pointer-events-none">
            <nav className="card !p-3 !rounded-full glass flex justify-between items-center w-full max-w-4xl pointer-events-auto">
                <Link to="/" className="flex items-center gap-2 pl-2">
                    <div className="bg-gradient-to-tr from-emerald-500 to-yellow-500 p-2 rounded-full text-white shadow-lg">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-800 dark:text-white">FinTrack</span>
                </Link>
                <div className="flex items-center gap-3 pr-1">
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden md:block">{user.username}</span>
                            <button
                                onClick={onLogout}
                                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all">Get Started</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
