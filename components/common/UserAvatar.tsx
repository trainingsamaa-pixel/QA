import React from 'react';
import type { User } from '../../types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-xl',
  lg: 'w-24 h-24 text-3xl',
};

const colorClasses = [
  'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-purple-500'
];

const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
    const colorIndex = user.id.charCodeAt(user.id.length - 1) % colorClasses.length;
    const bgColor = colorClasses[colorIndex];

    if (user.avatar) {
        return <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className={`${sizeClasses[size]} rounded-full object-cover`} />;
    }

    return (
        <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white`}>
            {getInitials(user.firstName, user.lastName)}
        </div>
    );
};
