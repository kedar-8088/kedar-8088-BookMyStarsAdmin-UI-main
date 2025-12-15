// assets
import { IconLayoutDashboard, IconWindmill, IconSettings } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard };
const pageIcons = {
    IconWindmill,
    IconSettings
};

// ==============================|| LMS DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'lms_dashboard',
    title: 'LMS',
    type: 'group',
    children: [
        {
            id: 'lms_default',
            title: 'Dashboard',
            type: 'item',
            url: '/lms',
            icon: icons.IconLayoutDashboard,
            breadcrumbs: false
        }
    ]
};

// ==============================|| LMS PAGES MENU ITEMS ||============================== //

const lms = {
    id: 'lms_pages',
    title: 'Pages',
    type: 'group',
    children: [
        {
            id: 'lms_masters',
            title: 'Masters',
            type: 'collapse',
            icon: pageIcons.IconWindmill,
            children: []
        },
        {
            id: 'lms_settings',
            title: 'Settings',
            type: 'item',
            url: '/lms/settings',
            icon: pageIcons.IconSettings,
            breadcrumbs: false
        }
    ]
};

export { dashboard, lms };

