// assets
import {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconSettings,
    IconUser,
    IconPaperBag,
    IconCurrencyRupee,
    IconCertificate,
    IconAd2,
    IconEye
} from '@tabler/icons-react';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconSettings,
    IconUser,
    IconCurrencyRupee,
    IconCertificate,
    IconAd2,
    IconEye
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    children: [
        {
            id: 'ads',
            title: 'Ads',
            type: 'collapse',
            icon: icons.IconAd2,
            url: null,
            children: [
                {
                    id: 'banner',
                    title: 'Banner',
                    type: 'item',
                    url: '/dashboard/banner',
                    breadcrumbs: false
                }
            ]
        },
        // {
        //     id: 'company_masters',
        //     title: 'Masters',
        //     type: 'collapse',
        //     icon: icons.IconWindmill,
        //     children: [
               
        //     ]
        // },

        {
            id: 'payments',
            title: 'Payments',
            type: 'item',
            url: '/dashboard/payments',
            icon: icons.IconCurrencyRupee,
            breadcrumbs: false
        },
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/dashboard/users',
            icon: icons.IconUser,
            breadcrumbs: false
        },
        {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/dashboard/settings',
            icon: icons.IconSettings,
            breadcrumbs: false
        }
    ]
};

export default utilities;
