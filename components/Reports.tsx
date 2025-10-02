import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Ticket, TicketType, AgentReportData, ErrorReportData } from '../types';
import { exportToCsv } from '../utils/export';

interface ReportsProps {
    tickets: Ticket[];
    ticketTypes: TicketType[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const ReportCard: React.FC<{ children: React.ReactNode; title: string; onExport?: () => void }> = ({ children, title, onExport }) => (
    <div className="bg-surface rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {onExport && (
                <button onClick={onExport} className="px-3 py-1 text-sm rounded-md bg-border text-text-secondary font-semibold hover:bg-gray-600 transition">
                    Export CSV
                </button>
            )}
        </div>
        {children}
    </div>
);

export const Reports: React.FC<ReportsProps> = ({ tickets, ticketTypes }) => {
    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        ticketTypeId: 'all',
        employeeName: 'all',
    });

    const uniqueEmployees = useMemo(() => [...new Set(tickets.map(t => t.formData.employeeName).filter(Boolean))], [tickets]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const createdAt = new Date(ticket.createdAt);
            const dateStart = filters.dateStart ? new Date(filters.dateStart) : null;
            const dateEnd = filters.dateEnd ? new Date(filters.dateEnd) : null;

            if (dateStart && createdAt < dateStart) return false;
            if (dateEnd && createdAt > dateEnd) return false;
            if (filters.ticketTypeId !== 'all' && ticket.ticketTypeId !== filters.ticketTypeId) return false;
            if (filters.employeeName !== 'all' && ticket.formData.employeeName !== filters.employeeName) return false;
            
            return true;
        });
    }, [tickets, filters]);

    const agentReportData: AgentReportData[] = useMemo(() => {
        const agentData: Record<string, { totalTickets: number; totalRating: number; ratingCount: number }> = {};
        
        filteredTickets.forEach(ticket => {
            const name = ticket.formData.employeeName;
            if (!name) return;

            if (!agentData[name]) {
                agentData[name] = { totalTickets: 0, totalRating: 0, ratingCount: 0 };
            }
            agentData[name].totalTickets += 1;
            if (typeof ticket.formData.overallRating === 'number') {
                agentData[name].totalRating += ticket.formData.overallRating;
                agentData[name].ratingCount += 1;
            }
        });

        return Object.entries(agentData).map(([name, data]) => ({
            employeeName: name,
            ticketCount: data.totalTickets,
            averageRating: data.ratingCount > 0 ? parseFloat((data.totalRating / data.ratingCount).toFixed(2)) : 0,
        }));
    }, [filteredTickets]);

    const errorReportData: ErrorReportData[] = useMemo(() => {
        const errorCounts: Record<string, number> = {};
        
        filteredTickets.forEach(ticket => {
            if (ticket.formData.errorCategory && ticket.formData.errorSubType) {
                const key = `${ticket.formData.errorCategory}|${ticket.formData.errorSubType}`;
                errorCounts[key] = (errorCounts[key] || 0) + 1;
            }
        });
        
        return Object.entries(errorCounts).map(([key, count]) => {
            const [category, subType] = key.split('|');
            return { category, subType, count };
        });
    }, [filteredTickets]);

    const errorCategoryChartData = useMemo(() => {
        const categoryCounts: Record<string, number> = {};
        errorReportData.forEach(err => {
            categoryCounts[err.category] = (categoryCounts[err.category] || 0) + err.count;
        });
        return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
    }, [errorReportData]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleExportAgentData = () => {
        exportToCsv(agentReportData, 'agent_performance_report.csv');
    };
    
    const handleExportErrorData = () => {
        exportToCsv(errorReportData, 'error_analysis_report.csv');
    };

    return (
        <div className="space-y-8">
            {/* Filter Section */}
            <div className="bg-surface p-4 rounded-lg flex flex-wrap items-center gap-4">
                 <input type="date" name="dateStart" value={filters.dateStart} onChange={handleFilterChange} className="bg-border p-2 rounded-md text-sm" />
                 <input type="date" name="dateEnd" value={filters.dateEnd} onChange={handleFilterChange} className="bg-border p-2 rounded-md text-sm" />
                 <select name="ticketTypeId" value={filters.ticketTypeId} onChange={handleFilterChange} className="bg-border p-2 rounded-md text-sm">
                    <option value="all">All Ticket Types</option>
                    {ticketTypes.map(tt => <option key={tt.id} value={tt.id}>{tt.name}</option>)}
                 </select>
                 <select name="employeeName" value={filters.employeeName} onChange={handleFilterChange} className="bg-border p-2 rounded-md text-sm">
                    <option value="all">All Employees</option>
                    {uniqueEmployees.map(name => <option key={name} value={name}>{name}</option>)}
                 </select>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ReportCard title="Tickets Per Agent">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={agentReportData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="employeeName" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Bar dataKey="ticketCount" fill="#4f46e5" name="Tickets" />
                        </BarChart>
                    </ResponsiveContainer>
                </ReportCard>
                <ReportCard title="Error Category Distribution">
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={errorCategoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {errorCategoryChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ReportCard>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ReportCard title="Agent Performance" onExport={handleExportAgentData}>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-text-secondary">
                             <thead className="text-xs uppercase bg-border sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Employee</th>
                                    <th className="px-4 py-2">Tickets</th>
                                    <th className="px-4 py-2">Avg. Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agentReportData.map(agent => (
                                    <tr key={agent.employeeName} className="border-b border-border hover:bg-gray-700/50">
                                        <td className="px-4 py-2 text-text-primary">{agent.employeeName}</td>
                                        <td className="px-4 py-2">{agent.ticketCount}</td>
                                        <td className="px-4 py-2">{agent.averageRating > 0 ? agent.averageRating : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ReportCard>
                <ReportCard title="Error Analysis" onExport={handleExportErrorData}>
                     <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs uppercase bg-border sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Sub-Type</th>
                                    <th className="px-4 py-2">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errorReportData.map(error => (
                                     <tr key={`${error.category}-${error.subType}`} className="border-b border-border hover:bg-gray-700/50">
                                        <td className="px-4 py-2 text-text-primary">{error.category}</td>
                                        <td className="px-4 py-2">{error.subType}</td>
                                        <td className="px-4 py-2">{error.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
};