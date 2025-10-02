import { useState } from 'react';
import type { User, Team, Department, Role } from '../types';

const initialDepartments: Department[] = [
    { id: 'dept-1', name: 'Customer Service' },
    { id: 'dept-2', name: 'Quality Assurance' },
    { id: 'dept-3', name: 'Training' },
];

const initialTeams: Team[] = [
    { id: 'team-1', name: 'Support - Tier 1', departmentId: 'dept-1' },
    { id: 'team-2', name: 'Sales', departmentId: 'dept-1' },
    { id: 'team-3', name: 'Technical Support', departmentId: 'dept-1' },
    { id: 'team-4', name: 'QA Analysts', departmentId: 'dept-2' },
];

const initialUsers: User[] = [
    { id: 'user-1', firstName: 'Sarah', lastName: 'Admin', email: 'admin@example.com', role: 'admin', teamId: 'team-4', status: 'active', joinDate: '2022-08-15T10:00:00Z', stats: { avgScore: 98, totalTickets: 50, complianceRate: 100 } },
    { id: 'user-2', firstName: 'Mike', lastName: 'Manager', email: 'manager@example.com', role: 'qa_manager', teamId: 'team-4', status: 'active', joinDate: '2022-09-01T11:00:00Z', stats: { avgScore: 95, totalTickets: 150, complianceRate: 98 } },
    { id: 'user-3', firstName: 'David', lastName: 'Lead', email: 'lead@example.com', role: 'team_leader', teamId: 'team-1', status: 'active', joinDate: '2022-10-20T09:00:00Z', stats: { avgScore: 92, totalTickets: 80, complianceRate: 95 } },
    { id: 'user-4', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', role: 'agent', teamId: 'team-1', status: 'active', joinDate: '2023-01-10T14:00:00Z', stats: { avgScore: 88, totalTickets: 205, complianceRate: 92 } },
    { id: 'user-5', firstName: 'Bob', lastName: 'Williams', email: 'bob@example.com', role: 'agent', teamId: 'team-1', status: 'active', joinDate: '2023-01-12T15:00:00Z', stats: { avgScore: 85, totalTickets: 198, complianceRate: 90 } },
    { id: 'user-6', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', role: 'agent', teamId: 'team-2', status: 'inactive', joinDate: '2023-02-05T16:00:00Z', stats: { avgScore: 91, totalTickets: 150, complianceRate: 99 } },
    { id: 'user-7', firstName: 'Diana', lastName: 'Prince', email: 'diana@example.com', role: 'agent', teamId: 'team-2', status: 'active', joinDate: '2023-03-11T11:30:00Z', stats: { avgScore: 94, totalTickets: 220, complianceRate: 100 } },
];

export const useUserManager = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);

    const findUserByEmail = (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const addUser = (user: Omit<User, 'id' | 'joinDate'>) => {
        const newUser: User = {
            ...user,
            id: `user-${Date.now()}`,
            joinDate: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (userId: string, updatedData: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    return {
        users,
        teams,
        departments,
        findUserByEmail,
        addUser,
        updateUser,
        deleteUser,
        getUserById: (id: string) => users.find(u => u.id === id)
    };
};
