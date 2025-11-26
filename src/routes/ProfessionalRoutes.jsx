import React, { lazy, Suspense } from 'react';
import Loadable from 'ui-component/Loadable';

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

// professional routing
const ProfessionalDefault = Loadable(lazy(() => import('views/professional')));
const ProfessionalBanner = Loadable(lazy(() => import('views/professional/Banner')));
const ProfessionalCategory = Loadable(lazy(() => import('views/utilities/Professionals/Category')));
const ProfessionalCountry = Loadable(lazy(() => import('views/utilities/Professionals/Country')));
const ProfessionalCity = Loadable(lazy(() => import('views/utilities/Professionals/City')));
const ProfessionalState = Loadable(lazy(() => import('views/utilities/Professionals/State')));
const ProfessionalBodyType = Loadable(lazy(() => import('views/utilities/Professionals/BodyType')));
const ProfessionalCommunicationLanguage = Loadable(lazy(() => import('views/utilities/Professionals/CommunicationLanguage')));
const ProfessionalSkills = Loadable(lazy(() => import('views/utilities/Professionals/Skills')));
const ProfessionalEyeColor = Loadable(lazy(() => import('views/utilities/Professionals/EyeColor')));
const ProfessionalHairColor = Loadable(lazy(() => import('views/utilities/Professionals/HairColor')));
const ProfessionalHighestQualification = Loadable(lazy(() => import('views/utilities/Professionals/HighestQualification')));
const ProfessionalMaritalStatus = Loadable(lazy(() => import('views/utilities/Professionals/MaritalStatus')));
const ProfessionalShoeSize = Loadable(lazy(() => import('views/utilities/Professionals/ShoeSize')));
const ProfessionalSkinColor = Loadable(lazy(() => import('views/utilities/Professionals/SkinColor')));
const ProfessionalManagement = Loadable(lazy(() => import('views/professional/ProfessionalManagement')));
const ProfessionalVerification = Loadable(lazy(() => import('views/professional/Verification')));
const ProfessionalPayments = Loadable(lazy(() => import('views/professional/Payments')));
const ProfessionalSettings = Loadable(lazy(() => import('views/professional/Settings')));

const ProfessionalRoutes = {
    path: 'professional',
    errorElement: <CustomErrorElement />,
    children: [
        { path: '', element: <ProfessionalDefault />, errorElement: <CustomErrorElement /> },
        { path: 'banner', element: <ProfessionalBanner />, errorElement: <CustomErrorElement /> },
        { path: 'category', element: <ProfessionalCategory />, errorElement: <CustomErrorElement /> },
        { path: 'country', element: <ProfessionalCountry />, errorElement: <CustomErrorElement /> },
        { path: 'city', element: <ProfessionalCity />, errorElement: <CustomErrorElement /> },
        { path: 'state', element: <ProfessionalState />, errorElement: <CustomErrorElement /> },
        { path: 'body-type', element: <ProfessionalBodyType />, errorElement: <CustomErrorElement /> },
        { path: 'communication-language', element: <ProfessionalCommunicationLanguage />, errorElement: <CustomErrorElement /> },
        
        { path: 'skills', element: <ProfessionalSkills />, errorElement: <CustomErrorElement /> },
        { path: 'eye-color', element: <ProfessionalEyeColor />, errorElement: <CustomErrorElement /> },
        { path: 'hair-color', element: <ProfessionalHairColor />, errorElement: <CustomErrorElement /> },
        { path: 'highest-qualification', element: <ProfessionalHighestQualification />, errorElement: <CustomErrorElement /> },
        { path: 'marital-status', element: <ProfessionalMaritalStatus />, errorElement: <CustomErrorElement /> },
        { path: 'shoe-size', element: <ProfessionalShoeSize />, errorElement: <CustomErrorElement /> },
        { path: 'skin-color', element: <ProfessionalSkinColor />, errorElement: <CustomErrorElement /> },
        { path: 'management', element: <ProfessionalManagement />, errorElement: <CustomErrorElement /> },
        { path: 'verification', element: <ProfessionalVerification />, errorElement: <CustomErrorElement /> },
        { path: 'payments', element: <ProfessionalPayments />, errorElement: <CustomErrorElement /> },
        { path: 'settings', element: <ProfessionalSettings />, errorElement: <CustomErrorElement /> }
    ]
};

export default ProfessionalRoutes;
