import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosHelper';

const Register = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { username, email, password });
            // Auto login after register? Or just redirect?
            // For simplicity, let's call logic for login flow or just ask user to login.
            // Actually, my auth api returns user data but maybe not token on register?
            // Checking backend... Register returns 201 with savedUser. No token.
            // So user must login.
            // Let's redirect to login.
            // Or better, auto-login. But I don't have token.
            // I'll show success and ask to login.
            await api.post('/auth/login', { email, password }).then(loginRes => {
                onLogin(loginRes.data.user, loginRes.data.token);
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Account</h2>
                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-3 mt-4">Sign Up</button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
