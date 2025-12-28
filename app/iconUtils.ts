import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

// Map icon names to Lucide React components
export function getIcon(iconName: string, props?: LucideProps) {
    const IconComponent = (LucideIcons as any)[iconName];

    if (!IconComponent) {
        const HelpCircle = LucideIcons.HelpCircle;
        return HelpCircle;
    }

    return IconComponent;
}

// Popular icons for finance app
export const iconNames = [
    // Money & Finance
    'DollarSign',
    'Wallet',
    'CreditCard',
    'Banknote',
    'Coins',
    'PiggyBank',
    'TrendingUp',
    'TrendingDown',
    'PieChart',
    'BarChart3',

    // Income Sources
    'Briefcase',
    'Zap',
    'Gift',
    'Star',
    'Award',
    'Target',

    // Expenses
    'ShoppingCart',
    'UtensilsCrossed',
    'Car',
    'Home',
    'Smartphone',
    'Shirt',
    'Gamepad2',
    'Film',
    'Music',
    'Heart',
    'GraduationCap',
    'Plane',
    'Coffee',
    'Pizza',

    // Utilities
    'Receipt',
    'Wifi',
    'Phone',

    // Other
    'MoreHorizontal',
    'HelpCircle',
    'Tag',
    'Calendar',
    'Clock',
    'MapPin',
    'User',
    'Users',
    'Settings',
    'Shield',
    'Sparkles',
];

// Get all available icons
export function getAllIcons() {
    return iconNames.map((name) => ({
        name,
        component: getIcon(name),
    }));
}