import React, { useState } from 'https://esm.sh/react@^19.1.0';
import { APP_NAME } from '../constants.tsx';
import { type User } from '../types.ts';

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && password.trim()) {
            const namePart = email.split('@')[0];
            const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            
            const user: User = {
                name: name,
                email: email,
                picture: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`,
            };
            onLogin(user);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white p-4">
            <div className="text-center mb-6">
                <span className="block text-4xl font-light tracking-[0.15em] text-gray-800 dark:text-gray-200">SAVANT</span>
                <span className="block -mt-2 text-6xl font-black tracking-tighter text-gray-900 dark:text-white">SEEKER</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">Welcome back</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 text-center">Sign in to continue to your AI assistant.</p>
            
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                </div>
                 <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!email.trim() || !password.trim()}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default LoginScreen;
