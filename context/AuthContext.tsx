import React, { createContext, useState, useContext, useMemo } from 'react';
import type { User, Role } from '../types';
import { useUserManager } from '../hooks/useUserManager';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  hasPermission: (allowedRoles: Role[]) => boolean;
  users: User[];
  teams: any[];
  departments: any[];
  addUser: (user: Omit<User, 'id' | 'joinDate'>) => void;
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  getUserById: (id: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const userManager = useUserManager();

  const login = async (email: string, password: string): Promise<User | null> => {
    // In a real app, you'd verify the password. Here we just find the user.
    console.log(`Attempting login for: ${email}`);
    const user = userManager.findUserByEmail(email);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (allowedRoles: Role[]): boolean => {
      if (!currentUser) return false;
      return allowedRoles.includes(currentUser.role);
  };

  const value = useMemo(() => ({
    currentUser,
    login,
    logout,
    hasPermission,
    ...userManager,
  }), [currentUser, userManager.users, userManager.teams, userManager.departments]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
