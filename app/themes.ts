export interface Theme {
    id: string;
    name: string;
    colors: {
        background: {
            start: string;
            end: string;
        };
        card: {
            bg: string;
            border: string;
        };
        text: {
            primary: string;
            secondary: string;
            muted: string;
        };
        accent: {
            primary: string;
            secondary: string;
        };
        income: string;
        expense: string;
    };
}

export const themes: Record<string, Theme> = {
    'purple-dark': {
        id: 'purple-dark',
        name: 'Purple Dark',
        colors: {
            background: {
                start: '#0f172a', // slate-900
                end: '#581c87',   // purple-900
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.05)',
                border: 'rgba(255, 255, 255, 0.1)',
            },
            text: {
                primary: '#f8fafc',   // slate-50
                secondary: '#cbd5e1', // slate-300
                muted: '#94a3b8',     // slate-400
            },
            accent: {
                primary: '#8b5cf6',   // violet-500
                secondary: '#a78bfa', // violet-400
            },
            income: '#10b981',  // green-500
            expense: '#ef4444', // red-500
        },
    },
    'ocean-blue': {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        colors: {
            background: {
                start: '#0c4a6e', // sky-900
                end: '#1e3a8a',   // blue-900
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.08)',
                border: 'rgba(255, 255, 255, 0.15)',
            },
            text: {
                primary: '#f0f9ff',
                secondary: '#bae6fd',
                muted: '#7dd3fc',
            },
            accent: {
                primary: '#0ea5e9',
                secondary: '#38bdf8',
            },
            income: '#34d399',
            expense: '#f87171',
        },
    },
    'forest-green': {
        id: 'forest-green',
        name: 'Forest Green',
        colors: {
            background: {
                start: '#14532d', // green-900
                end: '#1e3a8a',   // blue-900
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.06)',
                border: 'rgba(255, 255, 255, 0.12)',
            },
            text: {
                primary: '#f0fdf4',
                secondary: '#bbf7d0',
                muted: '#86efac',
            },
            accent: {
                primary: '#22c55e',
                secondary: '#4ade80',
            },
            income: '#10b981',
            expense: '#f59e0b',
        },
    },
    'sunset-orange': {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        colors: {
            background: {
                start: '#7c2d12', // orange-900
                end: '#991b1b',   // red-900
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.07)',
                border: 'rgba(255, 255, 255, 0.13)',
            },
            text: {
                primary: '#fff7ed',
                secondary: '#fed7aa',
                muted: '#fdba74',
            },
            accent: {
                primary: '#f97316',
                secondary: '#fb923c',
            },
            income: '#22c55e',
            expense: '#dc2626',
        },
    },
    'midnight-purple': {
        id: 'midnight-purple',
        name: 'Midnight Purple',
        colors: {
            background: {
                start: '#1e1b4b', // indigo-950
                end: '#4c1d95',   // violet-900
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.05)',
                border: 'rgba(255, 255, 255, 0.1)',
            },
            text: {
                primary: '#faf5ff',
                secondary: '#e9d5ff',
                muted: '#d8b4fe',
            },
            accent: {
                primary: '#a855f7',
                secondary: '#c084fc',
            },
            income: '#14b8a6',
            expense: '#f43f5e',
        },
    },
    'rose-pink': {
        id: 'rose-pink',
        name: 'Rose Pink',
        colors: {
            background: {
                start: '#881337', // rose-900
                end: '#4c0519',   // rose-950
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.08)',
                border: 'rgba(255, 255, 255, 0.15)',
            },
            text: {
                primary: '#fff1f2',
                secondary: '#fecdd3',
                muted: '#fda4af',
            },
            accent: {
                primary: '#f43f5e',
                secondary: '#fb7185',
            },
            income: '#10b981',
            expense: '#dc2626',
        },
    },
    'professional-gray': {
        id: 'professional-gray',
        name: 'Professional Gray',
        colors: {
            background: {
                start: '#1e293b', // slate-800
                end: '#334155',   // slate-700
            },
            card: {
                bg: 'rgba(255, 255, 255, 0.06)',
                border: 'rgba(255, 255, 255, 0.12)',
            },
            text: {
                primary: '#f8fafc',
                secondary: '#cbd5e1',
                muted: '#94a3b8',
            },
            accent: {
                primary: '#3b82f6',
                secondary: '#60a5fa',
            },
            income: '#10b981',
            expense: '#ef4444',
        },
    },
};

export function getTheme(themeId: string): Theme {
    return themes[themeId] || themes['purple-dark'];
}

export const themeList = Object.values(themes);