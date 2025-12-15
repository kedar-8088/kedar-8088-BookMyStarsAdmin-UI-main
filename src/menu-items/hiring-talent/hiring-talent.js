// assets
import { IconDashboard, IconLayoutDashboard } from '@tabler/icons-react';
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
    IconUsers,
    IconEye
} from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard, IconDashboard };
const pageIcons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconSettings,
    IconUser,
    IconCurrencyRupee,
    IconCertificate,
    IconAd2,
    IconUsers,
    IconEye
};

// ==============================|| HIRING TALENT DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'hiring_talent_dashboard',
    title: 'Hiring Talent',
    type: 'group',
    children: [
        {
            id: 'hiring_talent_default',
            title: 'Dashboard',
            type: 'item',
            url: '/hiring-talent',
            icon: icons.IconLayoutDashboard,
            breadcrumbs: false
        }
    ]
};

// ==============================|| HIRING TALENT PAGES MENU ITEMS ||============================== //

const hiringTalent = {
    id: 'hiring_talent_pages',
    title: 'Pages',
    type: 'group',
    children: [
        {
            id: 'hiring_talent_masters',
            title: 'Masters',
            type: 'collapse',
            icon: pageIcons.IconWindmill,
            children: []
        },
        {
            id: 'hiring_talent_settings',
            title: 'Settings',
            type: 'item',
            url: '/hiring-talent/settings',
            icon: pageIcons.IconSettings,
            breadcrumbs: false
        }
       
    ]
};

export { dashboard, hiringTalent };
export default { dashboard, hiringTalent };

