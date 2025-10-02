import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types';
import { Icon } from '../Icon';
import { UserAvatar } from '../common/UserAvatar';
import { RoleBadge } from '../common/RoleBadge';
import { Pagination } from '../common/Pagination';

interface UsersManagementProps {
    onViewProfile: (userId: string) => void;
}

export const UsersManagement: React.FC<UsersManagementProps> = ({ onViewProfile }) => {
    const { users, teams } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const getTeamName = (teamId: string) => teams.find(t => t.id === teamId)?.name || 'N/A';

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        return filteredUsers.slice(startIndex, startIndex + usersPerPage);
    }, [filteredUsers, currentPage, usersPerPage]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-border rounded-md pl-10 pr-4 py-2 text-text-primary focus:ring-primary focus:border-primary transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <button className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/80 transition flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add New User
                </button>
            </div>

            <div className="bg-surface rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-border">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Team</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Join Date</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="bg-surface border-b border-border hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                                        <div className="flex items-center">
                                            <UserAvatar user={user} size="sm" />
                                            <div className="ml-4">
                                                <div className="font-semibold text-white">{user.firstName} {user.lastName}</div>
                                                <div className="text-xs text-text-secondary">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                                    <td className="px-6 py-4">{getTeamName(user.teamId)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.joinDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => onViewProfile(user.id)} className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-border"><Icon name="view" className="w-4 h-4" /></button>
                                            <button className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-border"><Icon name="edit" className="w-4 h-4" /></button>
                                            <button className="p-2 text-text-secondary hover:text-red-400 transition-colors rounded-full hover:bg-border"><Icon name="delete" className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={usersPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};
