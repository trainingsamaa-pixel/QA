import { useState } from 'react';
import type { Ticket, TicketType } from '../types';
import { FieldType } from '../types';

const initialTicketTypes: TicketType[] = [
  {
    id: 'quality-monitoring',
    name: 'Quality Monitoring Call Review',
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: FieldType.TEXT, required: true },
      { id: 'callDate', label: 'Call Date', type: FieldType.DATE, required: true },
      { 
        id: 'errorCategory', 
        label: 'Error Category', 
        type: FieldType.DROPDOWN, 
        required: true, 
        options: ['Communication Errors', 'Technical Errors', 'Procedural Errors', 'Compliance Errors']
      },
      {
        id: 'errorSubType',
        label: 'Error Sub-Type',
        type: FieldType.DYNAMIC_DROPDOWN,
        required: true,
        dependsOn: 'errorCategory',
        optionsMap: {
          "Communication Errors": ["Poor Greeting", "Improper Closing", "Unclear Explanation", "Tone Issues"],
          "Technical Errors": ["System Navigation", "Data Entry Mistakes", "Tool Misuse", "Documentation Errors"],
          "Procedural Errors": ["Incorrect Process", "Failed Verification", "Missed Opportunity"],
          "Compliance Errors": ["Disclosure Missing", "Data Privacy Breach"]
        }
      },
      {
        id: 'specificIssue',
        label: 'Specific Issue',
        type: FieldType.DYNAMIC_DROPDOWN,
        required: true,
        dependsOn: 'errorSubType',
        optionsMap: {
            "Poor Greeting": ["Did not state name", "Sounded unenthusiastic"],
            "Improper Closing": ["Did not thank customer", "Abrupt ending"],
            "System Navigation": ["Slow to find info", "Used wrong tool"],
            "Data Entry Mistakes": ["Incorrect customer ID", "Typo in address"],
        }
      },
      { id: 'overallRating', label: 'Overall Rating', type: FieldType.RATING, required: true, max: 5 },
      { id: 'notes', label: 'Detailed Notes', type: FieldType.TEXTAREA, required: false },
    ],
  },
  {
    id: 'coaching-session',
    name: 'Coaching Session',
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: FieldType.TEXT, required: true },
      { id: 'sessionDate', label: 'Session Date', type: FieldType.DATE, required: true },
      { id: 'strengths', label: 'Strengths Discussed', type: FieldType.TEXTAREA, required: true },
      { id: 'opportunities', label: 'Opportunities for Improvement', type: FieldType.TEXTAREA, required: true },
      { id: 'actionPlan', label: 'Action Plan', type: FieldType.TEXTAREA, required: true },
    ]
  }
];

const initialTickets: Ticket[] = [
    { id: 'TICKET-1672531200000', ticketTypeId: 'quality-monitoring', createdAt: '2023-01-01T12:00:00Z', status: 'Closed', formData: { employeeName: 'Alice Johnson', callDate: '2023-01-01', errorCategory: 'Communication Errors', errorSubType: 'Poor Greeting', specificIssue: 'Sounded unenthusiastic', overallRating: 3, notes: 'Needs to be more energetic.' } },
    { id: 'TICKET-1672617600000', ticketTypeId: 'quality-monitoring', createdAt: '2023-01-02T12:00:00Z', status: 'Closed', formData: { employeeName: 'Bob Williams', callDate: '2023-01-02', errorCategory: 'Technical Errors', errorSubType: 'System Navigation', specificIssue: 'Slow to find info', overallRating: 2, notes: 'Took too long to find customer account.' } },
    { id: 'TICKET-1672704000000', ticketTypeId: 'quality-monitoring', createdAt: '2023-01-03T12:00:00Z', status: 'In Progress', formData: { employeeName: 'Alice Johnson', callDate: '2023-01-03', errorCategory: 'Procedural Errors', errorSubType: 'Incorrect Process', overallRating: 4, notes: 'Followed script perfectly.' } },
    { id: 'TICKET-1672790400000', ticketTypeId: 'coaching-session', createdAt: '2023-01-04T12:00:00Z', status: 'New', formData: { employeeName: 'Bob Williams', sessionDate: '2023-01-04', strengths: 'Good tone', opportunities: 'System navigation speed', actionPlan: 'Practice navigation exercises.' } },
    { id: 'TICKET-1672876800000', ticketTypeId: 'quality-monitoring', createdAt: '2023-01-05T12:00:00Z', status: 'New', formData: { employeeName: 'Charlie Brown', callDate: '2023-01-05', errorCategory: 'Technical Errors', errorSubType: 'Data Entry Mistakes', specificIssue: 'Typo in address', overallRating: 3, notes: 'Needs to double check entries.' } },
    { id: 'TICKET-1672963200000', ticketTypeId: 'quality-monitoring', createdAt: '2023-01-06T12:00:00Z', status: 'Closed', formData: { employeeName: 'Alice Johnson', callDate: '2023-01-06', errorCategory: 'Communication Errors', errorSubType: 'Improper Closing', specificIssue: 'Abrupt ending', overallRating: 5, notes: 'Great improvement on closing.' } },
];

export const useTicketManager = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(initialTicketTypes);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const getTicketById = (id: string) => tickets.find(t => t.id === id);

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `TICKET-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    }
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicket = (ticketId: string, updatedData: Partial<Ticket>) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...updatedData } : t));
  };
  
  const deleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const addTicketType = (ticketType: TicketType) => {
    setTicketTypes(prev => [...prev, ticketType]);
  };

  const updateTicketType = (updatedTicketType: TicketType) => {
    setTicketTypes(prev => prev.map(tt => tt.id === updatedTicketType.id ? updatedTicketType : tt));
  };

  const deleteTicketType = (ticketTypeId: string): boolean => {
    const isUsed = tickets.some(t => t.ticketTypeId === ticketTypeId);
    if (isUsed) {
      return false; // Indicate that deletion is not allowed
    }
    setTicketTypes(prev => prev.filter(tt => tt.id !== ticketTypeId));
    return true; // Indicate successful deletion
  };

  return { 
    ticketTypes, 
    tickets, 
    getTicketById,
    addTicket, 
    updateTicket,
    deleteTicket,
    addTicketType,
    updateTicketType,
    deleteTicketType,
  };
};