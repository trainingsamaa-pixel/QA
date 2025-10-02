import React from 'react';
import type { View } from '../App';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './common/UserAvatar';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  setProfileUserId: (userId: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, setProfileUserId }) => {
  const { currentUser, logout, hasPermission } = useAuth();

  const navItems = [
    { view: 'dashboard' as View, label: 'Dashboard', icon: 'dashboard', roles: ['admin', 'qa_manager', 'team_leader', 'agent'] },
    { view: 'newTicket' as View, label: 'New Ticket', icon: 'ticket', roles: ['admin', 'qa_manager', 'team_leader'] },
    { view: 'builder' as View, label: 'Type Management', icon: 'builder', roles: ['admin', 'qa_manager'] },
    { view: 'reports' as View, label: 'Reports', icon: 'reports', roles: ['admin', 'qa_manager', 'team_leader'] },
    { view: 'users' as View, label: 'Users Management', icon: 'users', roles: ['admin'] },
  ];

  const handleProfileClick = () => {
    if (currentUser) {
        setProfileUserId(null); // null means view own profile
        setCurrentView('profile');
    }
  };

  const filteredNavItems = navItems.filter(item => hasPermission(item.roles as any));

  return (
    <aside className="w-64 bg-surface p-6 flex flex-col">
      <div className="flex items-center mb-12">
        <Icon name="logo" className="w-8 h-8 mr-3 text-primary" />
        <h2 className="text-xl font-bold text-white">Aura QM</h2>
      </div>
      <nav className="flex-1">
        <ul>
          {filteredNavItems.map(item => (
            <li key={item.view}>
              <button
                onClick={() => setCurrentView(item.view)}
                className={`w-full text-left flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-border hover:text-white'
                }`}
              >
                <Icon name={item.icon as any} className="w-5 h-5 mr-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        {currentUser && (
            <div className="p-3 rounded-lg hover:bg-border transition-colors group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <UserAvatar user={currentUser} size="sm" />
                        <div className="ml-3">
                            <p className="font-semibold text-white text-sm">{currentUser.firstName} {currentUser.lastName}</p>
                            <p className="text-xs text-text-secondary capitalize">{currentUser.role.replace('_', ' ')}</p>
                        </div>
                    </div>
                     <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleProfileClick} className="text-text-secondary hover:text-white mr-2" title="View Profile">
                            <Icon name="profile" className="w-5 h-5" />
                        </button>
                        <button onClick={logout} className="text-text-secondary hover:text-white" title="Logout">
                            <Icon name="logout" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </aside>
  );
};