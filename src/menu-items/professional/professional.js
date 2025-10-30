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
    IconUsers,
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
    IconUsers,
    IconEye
};

// ==============================|| PROFESSIONAL MENU ITEMS ||============================== //

const professional = {
    id: 'professional',
    title: 'Professional',
    type: 'group',
    children: [
        {
            id: 'professional_management',
            title: 'Professional Management',
            type: 'item',
            url: '/professional/management',
            icon: icons.IconUser,
            breadcrumbs: false
        },
        {
            id: 'divider',
            type: 'divider'
        },
        {
            id: 'professional_masters',
            title: 'Masters',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'professional_body_type',
                    title: 'Body Type',
                    type: 'item',
                    url: '/professional/body-type',
                    breadcrumbs: false
                },
                {
                    id: 'professional_country',
                    title: 'Country',
                    type: 'item',
                    url: '/professional/country',
                    breadcrumbs: false
                },
                {
                    id: 'professional_state',
                    title: 'State',
                    type: 'item',
                    url: '/professional/state',
                    breadcrumbs: false
                },
                {
                    id: 'professional_city',
                    title: 'City',
                    type: 'item',
                    url: '/professional/city',
                    breadcrumbs: false
                },
                {
                    id: 'professional_category',
                    title: 'Category',
                    type: 'item',
                    url: '/professional/category',
                    breadcrumbs: false
                },
                {
                    id: 'professional_communication_language',
                    title: 'Communication Language',
                    type: 'item',
                    url: '/professional/communication-language',
                    breadcrumbs: false
                },
                
                {
                    id: 'professional_skills',
                    title: 'Skills',
                    type: 'item',
                    url: '/professional/skills',
                    breadcrumbs: false
                },
                {
                    id: 'professional_eye_color',
                    title: 'Eye Color',
                    type: 'item',
                    url: '/professional/eye-color',
                    breadcrumbs: false
                },
                {
                    id: 'professional_hair_color',
                    title: 'Hair Color',
                    type: 'item',
                    url: '/professional/hair-color',
                    breadcrumbs: false
                },
                {
                    id: 'professional_skin_color',
                    title: 'Skin Color',
                    type: 'item',
                    url: '/professional/skin-color',
                    breadcrumbs: false
                },
                {
                    id: 'professional_highest_qualification',
                    title: 'Highest Qualification',
                    type: 'item',
                    url: '/professional/highest-qualification',
                    breadcrumbs: false
                },
                {
                    id: 'professional_marital_status',
                    title: 'Marital Status',
                    type: 'item',
                    url: '/professional/marital-status',
                    breadcrumbs: false
                },
                {
                    id: 'professional_shoe_size',
                    title: 'Shoe Size',
                    type: 'item',
                    url: '/professional/shoe-size',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'professional_verification',
            title: 'Verification',
            type: 'item',
            url: '/professional/verification',
            icon: icons.IconCertificate,
            breadcrumbs: false
        },
        {
            id: 'professional_settings',
            title: 'Settings',
            type: 'item',
            url: '/professional/settings',
            icon: icons.IconSettings,
            breadcrumbs: false
        }
    ]
};

export default professional;
