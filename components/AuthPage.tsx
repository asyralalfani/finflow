'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        fullName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    fullName: formData.fullName || undefined,
                });
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Finance Manager
                    </h1>
                    <p className="text-gray-400">
                        Manage your money wisely
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl animate-fade-in">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${isLogin
                                    ? 'bg-purple-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${!isLogin
                                    ? 'bg-purple-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* Username (Register only) */}
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required={!isLogin}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="johndoe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name (Optional)
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {!isLogin && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Minimum 6 characters
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isLogin ? 'Logging in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>{isLogin ? 'Login' : 'Create Account'}</>
                            )}
                        </button>
                    </form>

                    {/* Demo Account Info */}
                    {isLogin && (
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-200 font-medium mb-1">
                                Demo Account
                            </p>
                            <p className="text-xs text-blue-300">
                                Email: demo@finance.app
                            </p>
                            <p className="text-xs text-blue-300">
                                Password: demo123456
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Built with Next.js, Prisma & PostgreSQL
                </p>
            </div>
        </div>
    );
}