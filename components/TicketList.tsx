import React from 'react';
import type { Ticket, TicketType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Icon } from './Icon';

interface TicketListProps {
    tickets: Ticket[];
    ticketTypes: TicketType[];
    onEdit: (ticketId: string) => void;
    onDelete: (ticketId: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, ticketTypes, onEdit, onDelete }) => {
    const { hasPermission } = useAuth();
    const isAdmin = hasPermission(['admin']);

    const getTicketTypeName = (id: string) => {
        return ticketTypes.find(tt => tt.id === id)?.name || 'Unknown Type';
    };

    if (tickets.length === 0) {
        return <div className="bg-surface rounded-lg p-8 text-center text-text-secondary">No tickets submitted yet.</div>;
    }

    return (
        <div className="bg-surface rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="text-xs text-text-secondary uppercase bg-border">
                        <tr>
                            <th scope="col" className="px-6 py-3">Ticket ID</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Employee</th>
                            {isAdmin && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="bg-surface border-b border-border hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{ticket.id.substring(7, 13)}</td>
                                <td className="px-6 py-4">{getTicketTypeName(ticket.ticketTypeId)}</td>
                                <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        ticket.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                                        ticket.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-green-500/20 text-green-300'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{ticket.formData.employeeName || 'N/A'}</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => onEdit(ticket.id)} className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-border" title="Edit Ticket"><Icon name="edit" className="w-4 h-4" /></button>
                                            <button onClick={() => onDelete(ticket.id)} className="p-2 text-text-secondary hover:text-red-400 transition-colors rounded-full hover:bg-border" title="Delete Ticket"><Icon name="delete" className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};