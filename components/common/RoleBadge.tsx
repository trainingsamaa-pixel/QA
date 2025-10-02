import React from 'react';
import type { Role } from '../../types';

interface RoleBadgeProps {
  role: Role;
}

const roleStyles: Record<Role, string> = {
  admin: 'bg-red-500/20 text-red-300',
  qa_manager: 'bg-blue-500/20 text-blue-300',
  team_leader: 'bg-green-500/20 text-green-300',
  agent: 'bg-gray-500/20 text-gray-300',
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleStyles[role]}`}>
      {role.replace('_', ' ')}
    </span>
  );
};
