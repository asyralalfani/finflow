'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { getIcon } from '@/app/iconUtils';
import type { IncomeType, ExpenseCategory, BankAccount } from '@/app/types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    themeColors: any;
}

export default function AddTransactionModal({
    isOpen,
    onClose,
    onSuccess,
    themeColors,
}: AddTransactionModalProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');

    const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        incomeTypeId: '',
        expenseCategoryId: '',
        bankAccountId: '',
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

            // Set default category
            if (type === 'income' && incomeRes.incomeTypes.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    incomeTypeId: incomeRes.incomeTypes[0].id,
                }));
            } else if (type === 'expense' && expenseRes.expenseCategories.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    expenseCategoryId: expenseRes.expenseCategories[0].id,
                }));
            }

            // Set default bank account
            if (accountsRes.accounts.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    bankAccountId: accountsRes.accounts[0].id,
                }));
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.createTransaction({
                type,
                amount: parseFloat(formData.amount),
                description: formData.description || undefined,
                date: formData.date,
                incomeTypeId: type === 'income' ? formData.incomeTypeId : undefined,
                expenseCategoryId: type === 'expense' ? formData.expenseCategoryId : undefined,
                bankAccountId: formData.bankAccountId || undefined,
            });

            // Reset form
            setFormData({
                amount: '',
                description: '',
                notes: '',
                date: new Date().toISOString().split('T')[0],
                incomeTypeId: incomeTypes[0]?.id || '',
                expenseCategoryId: expenseCategories[0]?.id || '',
                bankAccountId: bankAccounts[0]?.id || '',
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
                className="relative w-full max-w-lg rounded-2xl border p-6 animate-slide-up"
                style={{
                    backgroundColor: themeColors.card.bg,
                    borderColor: themeColors.card.border,
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Type Toggle */}
                <div className="flex gap-2 mb-6 bg-white/5 rounded-lg p-1">
                    <button
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${type === 'expense'
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Expense
                    </button>
                    <button
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${type === 'income'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Income
                    </button>
                </div>

                {loadingData ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name={type === 'income' ? 'incomeTypeId' : 'expenseCategoryId'}
                                    value={
                                        type === 'income'
                                            ? formData.incomeTypeId
                                            : formData.expenseCategoryId
                                    }
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {(type === 'income' ? incomeTypes : expenseCategories).map(
                                        (cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Bank Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Bank Account (Optional)
                            </label>
                            <select
                                name="bankAccountId"
                                value={formData.bankAccountId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">No account</option>
                                {bankAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} - {account.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Lunch at restaurant"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${type === 'income'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                    } text-white disabled:opacity-50`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    `Add ${type === 'income' ? 'Income' : 'Expense'}`
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}