
import React from 'react';
import type { Ticket, TicketType } from '../types';
import { TicketList } from './TicketList';

interface DashboardProps {
    tickets: Ticket[];
    ticketTypes: TicketType[];
    onEditTicket: (ticketId: string) => void;
    onDeleteTicket: (ticketId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface rounded-lg p-6 flex items-center">
        <div className="bg-primary/20 text-primary p-3 rounded-lg mr-4">
            {icon}
        </div>
        <div>
            <p className="text-text-secondary text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ tickets, ticketTypes, onEditTicket, onDeleteTicket }) => {
    const totalTickets = tickets.length;
    const newTickets = tickets.filter(t => t.status === 'New').length;
    const closedTickets = tickets.filter(t => t.status === 'Closed').length;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tickets" value={totalTickets} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                <StatCard title="New Tickets" value={newTickets} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} />
                <StatCard title="Closed Tickets" value={closedTickets} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Ticket Types" value={ticketTypes.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Recent Tickets</h2>
              <TicketList tickets={tickets} ticketTypes={ticketTypes} onEdit={onEditTicket} onDelete={onDeleteTicket} />
            </div>
        </div>
    );
};