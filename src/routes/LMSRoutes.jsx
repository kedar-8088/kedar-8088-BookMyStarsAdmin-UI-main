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

// LMS routing
const LMSDefault = Loadable(lazy(() => import('views/lms')));
const LMSMasters = Loadable(lazy(() => import('views/lms/Masters')));
const LMSSettings = Loadable(lazy(() => import('views/lms/Settings')));

const LMSRoutes = {
    path: 'lms',
    errorElement: <CustomErrorElement />,
    children: [
        { path: '', element: <LMSDefault />, errorElement: <CustomErrorElement /> },
        { path: 'masters', element: <LMSMasters />, errorElement: <CustomErrorElement /> },
        { path: 'settings', element: <LMSSettings />, errorElement: <CustomErrorElement /> }
        // Add more LMS routes here as needed
    ]
};

export default LMSRoutes;

