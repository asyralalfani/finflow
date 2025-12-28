'use client';

import { useState, useEffect } from 'react';
import { X, Palette, DollarSign, ShoppingCart, Wallet, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { themeList } from '@/app/themes';
import { api } from '@/lib/api-client';
import { getIcon } from '@/app/iconUtils';
import { bankAccountTypes, bankAccountColors } from '@/app/defaultSettings';
import type { IncomeType, ExpenseCategory, BankAccount } from '@/app/types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    themeColors: any;
}

type Tab = 'theme' | 'income' | 'expense' | 'accounts';

export default function SettingsModal({ isOpen, onClose, themeColors }: SettingsModalProps) {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('theme');
    const [loading, setLoading] = useState(false);

    // Data
    const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    // Add forms
    const [showAddIncome, setShowAddIncome] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddAccount, setShowAddAccount] = useState(false);

    const [newIncome, setNewIncome] = useState({ name: '', icon: 'DollarSign', color: '#10B981' });
    const [newExpense, setNewExpense] = useState({ name: '', icon: 'ShoppingCart', color: '#EF4444' });
    const [newAccount, setNewAccount] = useState({
        name: '',
        type: 'checking',
        balance: 0,
        color: '#6366F1'
    });

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            const [incomeRes, expenseRes, accountsRes] = await Promise.all([
                api.getIncomeTypes(),
                api.getExpenseCategories(),
                api.getAccounts(),
            ]);
            setIncomeTypes(incomeRes.incomeTypes);
            setExpenseCategories(expenseRes.expenseCategories);
            setBankAccounts(accountsRes.accounts);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleThemeChange = async (themeId: string) => {
        try {
            setLoading(true);
            await api.updateProfile({ themeId });
            updateUser({ themeId });
            window.location.reload(); // Reload to apply theme
        } catch (error) {
            console.error('Failed to update theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIncome = async () => {
        if (!newIncome.name.trim()) return;

        try {
            await api.createIncomeType(newIncome);
            setNewIncome({ name: '', icon: 'DollarSign', color: '#10B981' });
            setShowAddIncome(false);
            loadData();
        } catch (error) {
            console.error('Failed to add income type:', error);
        }
    };

    const handleAddExpense = async () => {
        if (!newExpense.name.trim()) return;

        try {
            await api.createExpenseCategory(newExpense);
            setNewExpense({ name: '', icon: 'ShoppingCart', color: '#EF4444' });
            setShowAddExpense(false);
            loadData();
        } catch (error) {
            console.error('Failed to add expense category:', error);
        }
    };

    const handleAddAccount = async () => {
        if (!newAccount.name.trim()) return;

        try {
            await api.createAccount(newAccount);
            setNewAccount({ name: '', type: 'checking', balance: 0, color: '#6366F1' });
            setShowAddAccount(false);
            loadData();
        } catch (error) {
            console.error('Failed to add account:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border overflow-hidden flex flex-col animate-slide-up"
                style={{
                    backgroundColor: themeColors.card.bg,
                    borderColor: themeColors.card.border,
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('theme')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'theme'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        <Palette className="w-4 h-4" />
                        Theme
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'income'
                                ? 'bg-green-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        <DollarSign className="w-4 h-4" />
                        Income Types
                    </button>
                    <button
                        onClick={() => setActiveTab('expense')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'expense'
                                ? 'bg-red-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Expense Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'accounts'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        <Wallet className="w-4 h-4" />
                        Bank Accounts
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {/* Theme Tab */}
                    {activeTab === 'theme' && (
                        <div className="space-y-4">
                            <p className="text-gray-400 mb-4">Choose your preferred color theme</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {themeList.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeChange(theme.id)}
                                        disabled={loading}
                                        className={`p-4 rounded-xl border-2 transition-all ${user?.themeId === theme.id
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-white">{theme.name}</span>
                                            {user?.themeId === theme.id && (
                                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="h-20 rounded-lg"
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.colors.background.start}, ${theme.colors.background.end})`,
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Income Types Tab */}
                    {activeTab === 'income' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400">Manage your income categories</p>
                                <button
                                    onClick={() => setShowAddIncome(!showAddIncome)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Type
                                </button>
                            </div>

                            {/* Add Form */}
                            {showAddIncome && (
                                <div className="p-4 bg-white/5 rounded-lg mb-4">
                                    <input
                                        type="text"
                                        value={newIncome.name}
                                        onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                                        placeholder="Type name (e.g., Salary)"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddIncome}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setShowAddIncome(false)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {incomeTypes.map((type) => {
                                    const IconComponent = getIcon(type.icon);
                                    return (
                                        <div
                                            key={type.id}
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${type.color}20` }}
                                            >
                                                <IconComponent className="w-5 h-5" style={{ color: type.color }} />
                                            </div>
                                            <span className="flex-1 text-white">{type.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Expense Categories Tab */}
                    {activeTab === 'expense' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400">Manage your expense categories</p>
                                <button
                                    onClick={() => setShowAddExpense(!showAddExpense)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Category
                                </button>
                            </div>

                            {/* Add Form */}
                            {showAddExpense && (
                                <div className="p-4 bg-white/5 rounded-lg mb-4">
                                    <input
                                        type="text"
                                        value={newExpense.name}
                                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                                        placeholder="Category name (e.g., Food)"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddExpense}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setShowAddExpense(false)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {expenseCategories.map((category) => {
                                    const IconComponent = getIcon(category.icon);
                                    return (
                                        <div
                                            key={category.id}
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${category.color}20` }}
                                            >
                                                <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                                            </div>
                                            <span className="flex-1 text-white">{category.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Bank Accounts Tab */}
                    {activeTab === 'accounts' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400">Manage your bank accounts</p>
                                <button
                                    onClick={() => setShowAddAccount(!showAddAccount)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Account
                                </button>
                            </div>

                            {/* Add Form */}
                            {showAddAccount && (
                                <div className="p-4 bg-white/5 rounded-lg mb-4 space-y-3">
                                    <input
                                        type="text"
                                        value={newAccount.name}
                                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                                        placeholder="Account name (e.g., BCA Savings)"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={newAccount.type}
                                        onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {bankAccountTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={newAccount.balance}
                                        onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                                        placeholder="Initial balance"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddAccount}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setShowAddAccount(false)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {bankAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${account.color}20` }}
                                            >
                                                <Wallet className="w-5 h-5" style={{ color: account.color }} />
                                            </div>
                                            <div className="flex-1">
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}