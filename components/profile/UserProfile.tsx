import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { RoleBadge } from '../common/RoleBadge';

interface UserProfileProps {
    userId: string;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-border p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
    </div>
);

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
    const { getUserById, teams, departments } = useAuth();
    const user = getUserById(userId);

    if (!user) {
        return <div className="text-center p-8 bg-surface rounded-lg">User not found.</div>;
    }

    const team = teams.find(t => t.id === user.teamId);
    const department = departments.find(d => d.id === team?.departmentId);

    return (
        <div className="space-y-8">
            <div className="bg-surface p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <UserAvatar user={user} size="lg" />
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                    <p className="text-text-secondary">{user.email}</p>
                    <div className="mt-4 flex items-center justify-center md:justify-start space-x-4">
                        <RoleBadge role={user.role} />
                        <div className="text-text-secondary">
                            <span>{team?.name || 'No Team'}</span>
                            <span className="mx-2">/</span>
                            <span>{department?.name || 'No Department'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Average Quality Score" value={`${user.stats.avgScore}%`} />
                <StatCard label="Total Tickets Reviewed" value={user.stats.totalTickets} />
                <StatCard label="Compliance Rate" value={`${user.stats.complianceRate}%`} />
            </div>
            
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                 <h3 className="text-xl font-semibold text-white mb-4">Performance Trend (Last 6 Months)</h3>
                 <div className="h-64 flex items-center justify-center text-text-secondary bg-border rounded-lg">
                    [Chart Area Placeholder]
                 </div>
            </div>
        </div>
    );
};
