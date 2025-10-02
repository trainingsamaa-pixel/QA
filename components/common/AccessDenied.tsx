import React from 'react';
import { Icon } from '../Icon';

export const AccessDenied: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-surface rounded-lg p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-text-secondary max-w-md">
                You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
            </p>
        </div>
    );
};
