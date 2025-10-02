import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketForm } from './components/TicketForm';
import { TicketTypeManagement } from './components/TicketTypeManagement';
import { Reports } from './components/Reports';
import { UsersManagement } from './components/users/UsersManagement';
import { UserProfile } from './components/profile/UserProfile';
import { useTicketManager } from './hooks/useTicketManager';
import type { Ticket, TicketType, User } from './types';
import { useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { AccessDenied } from './components/common/AccessDenied';
import { ConfirmDialog } from './components/common/ConfirmDialog';


export type View = 'dashboard' | 'newTicket' | 'builder' | 'reports' | 'users' | 'profile';

const App: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  const { 
    tickets, ticketTypes, addTicket, addTicketType, getTicketById, 
    updateTicket, deleteTicket, updateTicketType, deleteTicketType 
  } = useTicketManager();
  
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(ticketTypes[0] || null);

  useEffect(() => {
    // If we switch to the new ticket view for editing, select the correct ticket type
    if (currentView === 'newTicket' && editingTicketId) {
      const ticket = getTicketById(editingTicketId);
      if (ticket) {
        setSelectedTicketType(ticketTypes.find(tt => tt.id === ticket.ticketTypeId) || null);
      }
    } else if (currentView !== 'newTicket') {
        setEditingTicketId(null);
        setSelectedTicketType(ticketTypes[0] || null);
    }
  }, [currentView, editingTicketId, getTicketById, ticketTypes]);

  const handleSaveTicket = (data: Omit<Ticket, 'id' | 'createdAt' | 'status'>, ticketId?: string) => {
    if (ticketId) { // Editing existing ticket
      updateTicket(ticketId, { formData: data.formData, ticketTypeId: data.ticketTypeId });
    } else { // Creating new ticket
      addTicket(data);
    }
    setEditingTicketId(null);
    setCurrentView('dashboard');
  };

  const handleEditTicket = (ticketId: string) => {
    setEditingTicketId(ticketId);
    setCurrentView('newTicket');
  };

  const handleDeleteTicketRequest = (ticketId: string) => {
    const ticket = getTicketById(ticketId);
    if(ticket) setTicketToDelete(ticket);
  };
  
  const handleConfirmDeleteTicket = () => {
    if (ticketToDelete) {
      deleteTicket(ticketToDelete.id);
      setTicketToDelete(null);
    }
  };
  
  const handleSaveTicketType = (ticketType: TicketType) => {
    // Check if it's an update or new creation by ID
    if (ticketTypes.some(tt => tt.id === ticketType.id)) {
      updateTicketType(ticketType);
    } else {
      addTicketType(ticketType);
    }
  };

  const handleViewProfile = (userId: string) => {
    setProfileUserId(userId);
    setCurrentView('profile');
  };

  const renderView = () => {
    switch (currentView) {
      case 'newTicket':
        if (!hasPermission(['admin', 'qa_manager', 'team_leader'])) return <AccessDenied />;
        const ticketToEdit = editingTicketId ? getTicketById(editingTicketId) : null;
        return (
          <TicketForm 
            ticketTypes={ticketTypes}
            selectedTicketType={selectedTicketType}
            onTicketTypeChange={setSelectedTicketType}
            onSubmit={handleSaveTicket}
            onCancel={() => setCurrentView('dashboard')}
            ticketToEdit={ticketToEdit}
          />
        );
      case 'builder':
        if (!hasPermission(['admin', 'qa_manager'])) return <AccessDenied />;
        return (
          <TicketTypeManagement 
            ticketTypes={ticketTypes}
            tickets={tickets}
            onSave={handleSaveTicketType}
            onDelete={deleteTicketType}
          />
        );
      case 'reports':
        if (!hasPermission(['admin', 'qa_manager', 'team_leader'])) return <AccessDenied />;
        return <Reports tickets={tickets} ticketTypes={ticketTypes} />;
      case 'users':
        if (!hasPermission(['admin'])) return <AccessDenied />;
        return <UsersManagement onViewProfile={handleViewProfile} />;
       case 'profile':
        const userIdToShow = profileUserId || currentUser?.id;
        if (!userIdToShow) return <AccessDenied />;
        if (userIdToShow !== currentUser?.id && !hasPermission(['admin', 'qa_manager', 'team_leader'])) {
            return <AccessDenied />;
        }
        return <UserProfile userId={userIdToShow} />;
      case 'dashboard':
      default:
        return <Dashboard 
                  tickets={tickets} 
                  ticketTypes={ticketTypes} 
                  onEditTicket={handleEditTicket}
                  onDeleteTicket={handleDeleteTicketRequest}
                />;
    }
  };
  
  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} setProfileUserId={setProfileUserId} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-white capitalize">
            {currentView === 'profile' && profileUserId ? 'User Profile' : currentView.replace(/([A-Z])/g, ' $1').replace('new Ticket', 'New / Edit Ticket').replace('builder', 'Ticket Type Management')}
        </h1>
        {renderView()}
      </main>
      {ticketToDelete && (
        <ConfirmDialog
          isOpen={!!ticketToDelete}
          title="Delete Ticket"
          message={`Are you sure you want to permanently delete ticket #${ticketToDelete.id.substring(7,13)}? This action cannot be undone.`}
          onConfirm={handleConfirmDeleteTicket}
          onCancel={() => setTicketToDelete(null)}
        />
      )}
    </div>
  );
};

export default App;