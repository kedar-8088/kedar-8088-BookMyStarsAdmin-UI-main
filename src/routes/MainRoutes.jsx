import React, { lazy, Suspense } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication3/Login3';
import Register from 'views/pages/authentication3/Register3';
import ForgotPassword from 'views/pages/authentication3/ForgotPassword';
import VerifyOtp from 'views/pages/authentication3/VerifyOtp';
import ResetPassword from 'views/pages/authentication3/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import ProfessionalRoutes from './ProfessionalRoutes';
import HiringTalentRoutes from './HiringTalentRoutes';

// Custom Error Component
const CustomErrorElement = ({ error }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f5f5f5'
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    maxWidth: '500px'
                }}
            >
                <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>⚠️ Something went wrong!</h1>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    We're sorry, but something unexpected happened while loading this page.
                </p>
                {error && (
                    <details style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <summary style={{ cursor: 'pointer', color: '#1976d2' }}>Error Details</summary>
                        <pre
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                overflow: 'auto',
                                marginTop: '10px'
                            }}
                        >
                            {error.message || 'Unknown error occurred'}
                        </pre>
                    </details>
                )}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Refresh Page
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const UtilsBanner = Loadable(lazy(() => import('views/utilities/dashboard/Banner')));
const UtilsCategory = Loadable(lazy(() => import('views/utilities/Professionals/Category')));
const UtilsCountry = Loadable(lazy(() => import('views/utilities/Professionals/Country')));
const UtilsCity = Loadable(lazy(() => import('views/utilities/Professionals/City')));
const UtilsState = Loadable(lazy(() => import('views/utilities/Professionals/State')));
const UtilsCommunicationLanguage = Loadable(lazy(() => import('views/utilities/Professionals/CommunicationLanguage')));
const UtilsSkills = Loadable(lazy(() => import('views/utilities/Professionals/Skills')));
const UtilsEyeColor = Loadable(lazy(() => import('views/utilities/Professionals/EyeColor')));
const UtilsHairColor = Loadable(lazy(() => import('views/utilities/Professionals/HairColor')));
const UtilsHighestQualification = Loadable(lazy(() => import('views/utilities/Professionals/HighestQualification')));
const UtilsMaritalStatus = Loadable(lazy(() => import('views/utilities/Professionals/MaritalStatus')));
const UtilsShoeSize = Loadable(lazy(() => import('views/utilities/Professionals/ShoeSize')));
const UtilsSkinColor = Loadable(lazy(() => import('views/utilities/Professionals/SkinColor')));

// const UtilsPromo = Loadable(lazy(() => import('views/utilities/dashboard/Promo')));
// const UtilsNews = Loadable(lazy(() => import('views/utilities/dashboard/News')));
// const UtilsSuccessStory = Loadable(lazy(() => import('views/utilities/dashboard/SuccessStory')));

const MainRoutes = {
    path: '/',
    errorElement: <CustomErrorElement />,

    children: [
        { index: true, element: <Login />, errorElement: <CustomErrorElement /> },
        { path: 'register', element: <Register />, errorElement: <CustomErrorElement /> },
        { path: 'forgot-password', element: <ForgotPassword />, errorElement: <CustomErrorElement /> },
        { path: 'verify-otp', element: <VerifyOtp />, errorElement: <CustomErrorElement /> },
        { path: 'reset-password', element: <ResetPassword />, errorElement: <CustomErrorElement /> },
        {
            path: '',
            element: <ProtectedRoute element={<MainLayout />} />,
            errorElement: <CustomErrorElement />,
            children: [
                {
                    path: 'dashboard',
                    errorElement: <CustomErrorElement />,
                    children: [
                        { path: '', element: <DashboardDefault />, errorElement: <CustomErrorElement /> },
                        { path: 'banner', element: <UtilsBanner />, errorElement: <CustomErrorElement /> },
                        { path: 'category', element: <UtilsCategory />, errorElement: <CustomErrorElement /> },
                        { path: 'country', element: <UtilsCountry />, errorElement: <CustomErrorElement /> },
                        { path: 'city', element: <UtilsCity />, errorElement: <CustomErrorElement /> },
                        { path: 'state', element: <UtilsState />, errorElement: <CustomErrorElement /> },
                        { path: 'communication-language', element: <UtilsCommunicationLanguage />, errorElement: <CustomErrorElement /> },
                        
                        { path: 'skills', element: <UtilsSkills />, errorElement: <CustomErrorElement /> },
                        { path: 'eye-color', element: <UtilsEyeColor />, errorElement: <CustomErrorElement /> },
                        { path: 'hair-color', element: <UtilsHairColor />, errorElement: <CustomErrorElement /> },
                        { path: 'highest-qualification', element: <UtilsHighestQualification />, errorElement: <CustomErrorElement /> },
                        { path: 'marital-status', element: <UtilsMaritalStatus />, errorElement: <CustomErrorElement /> },
                        { path: 'shoe-size', element: <UtilsShoeSize />, errorElement: <CustomErrorElement /> },
                        { path: 'skin-color', element: <UtilsSkinColor />, errorElement: <CustomErrorElement /> }
                        // { path: 'news', element: <UtilsNews /> },
                        // { path: 'promo', element: <UtilsPromo /> },
                        // { path: 'success-story', element: <UtilsSuccessStory /> }
                    ]
                },
                ProfessionalRoutes,
                HiringTalentRoutes
            ]
        }
    ]
};

export default MainRoutes;
