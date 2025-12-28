'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTheme } from '@/app/themes';
import { api } from '@/lib/api-client';
import AddTransactionModal from '@/components/AddTransactionModal';
import SettingsModal from '@/components/SettingsModal';
import {
    Loader2,
    LogOut,
    Wallet,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Plus,
    Settings,
    RefreshCw,
} from 'lucide-react';
import type { Transaction, BankAccount, Summary } from '@/app/types';

export default function Dashboard() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [summary, setSummary] = useState<Summary>({
        income: 0,
        expense: 0,
        balance: 0,
        count: 0,
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        } else if (user) {
            loadData();
        }
    }, [user, authLoading, router]);

    const loadData = async () => {
        try {
            const [transactionsRes, accountsRes] = await Promise.all([
                api.getTransactions({ limit: 10 }),
                api.getAccounts(),
            ]);

            setTransactions(transactionsRes.transactions);
            setSummary(transactionsRes.summary);
            setAccounts(accountsRes.accounts);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleTransactionAdded = () => {
        handleRefresh();
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const theme = getTheme(user.themeId || 'purple-dark');

    return (
        <div
            className="min-h-screen"
            style={{
                background: `linear-gradient(135deg, ${theme.colors.background.start}, ${theme.colors.background.end})`,
            }}
        >
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Finance Manager</h1>
                                <p className="text-sm text-gray-400">Welcome, {user.username}!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Settings className="w-5 h-5 text-gray-300" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Income Card */}
                    <div
                        className="rounded-2xl p-6 border backdrop-blur-xl"
                        style={{
                            backgroundColor: theme.colors.card.bg,
                            borderColor: theme.colors.card.border,
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/20">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Total Income</p>
                        <p className="text-3xl font-bold text-white">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: user.currency || 'IDR',
                            }).format(summary.income)}
                        </p>
                    </div>

                    {/* Expense Card */}
                    <div
                        className="rounded-2xl p-6 border backdrop-blur-xl"
                        style={{
                            backgroundColor: theme.colors.card.bg,
                            borderColor: theme.colors.card.border,
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/20">
                                <TrendingDown className="w-6 h-6 text-red-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Total Expense</p>
                        <p className="text-3xl font-bold text-white">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: user.currency || 'IDR',
                            }).format(summary.expense)}
                        </p>
                    </div>

                    {/* Balance Card */}
                    <div
                        className="rounded-2xl p-6 border backdrop-blur-xl"
                        style={{
                            backgroundColor: theme.colors.card.bg,
                            borderColor: theme.colors.card.border,
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/20">
                                <DollarSign className="w-6 h-6 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Balance</p>
                        <p className="text-3xl font-bold text-white">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: user.currency || 'IDR',
                            }).format(summary.balance)}
                        </p>
                    </div>
                </div>

                {/* Transactions List */}
                <div
                    className="rounded-2xl p-6 border backdrop-blur-xl mb-8"
                    style={{
                        backgroundColor: theme.colors.card.bg,
                        borderColor: theme.colors.card.border,
                    }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all transform hover:scale-105"
                        >
                            <Plus className="w-4 h-4" />
                            Add Transaction
                        </button>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No transactions yet</p>
                            <p className="text-sm text-gray-500 mt-2">Click "Add Transaction" to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income'
                                                ? 'bg-green-500/20'
                                                : 'bg-red-500/20'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? (
                                                <TrendingUp className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <TrendingDown className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {transaction.description ||
                                                    (transaction.type === 'income'
                                                        ? transaction.incomeType?.name
                                                        : transaction.expenseCategory?.name
                                                    )}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(transaction.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-bold text-lg ${transaction.type === 'income'
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: user.currency || 'IDR',
                                            }).format(Number(transaction.amount))}
                                        </p>
                                        {transaction.bankAccount && (
                                            <p className="text-xs text-gray-500">
                                                {transaction.bankAccount.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bank Accounts */}
                <div
                    className="rounded-2xl p-6 border backdrop-blur-xl"
                    style={{
                        backgroundColor: theme.colors.card.bg,
                        borderColor: theme.colors.card.border,
                    }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Bank Accounts</h2>
                    </div>

                    {accounts.length === 0 ? (
                        <div className="text-center py-12">
                            <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No accounts yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${account.color}20` }}
                                        >
                                            <Wallet className="w-5 h-5" style={{ color: account.color }} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{account.name}</p>
                                            <p className="text-xs text-gray-400 capitalize">{account.type}</p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-bold text-white">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: account.currency,
                                        }).format(Number(account.balance))}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleTransactionAdded}
                themeColors={theme.colors}
            />

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                themeColors={theme.colors}
            />
        </div>
    );
}