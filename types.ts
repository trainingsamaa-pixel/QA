export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  DROPDOWN = 'dropdown',
  DYNAMIC_DROPDOWN = 'dynamic_dropdown',
  RATING = 'rating',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

export interface BaseField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
}

export interface TextField extends BaseField {
  type: FieldType.TEXT;
}

export interface TextareaField extends BaseField {
  type: FieldType.TEXTAREA;
}

export interface NumberField extends BaseField {
  type: FieldType.NUMBER;
  min?: number;
  max?: number;
}

export interface DateField extends BaseField {
  type: FieldType.DATE;
}

export interface DropdownField extends BaseField {
  type: FieldType.DROPDOWN;
  options: string[];
}

export interface DynamicDropdownField extends BaseField {
  type: FieldType.DYNAMIC_DROPDOWN;
  dependsOn: string; // id of the parent field
  optionsMap: Record<string, string[]>; // { parentOptionValue: ['childOption1', 'childOption2'] }
}

export interface RatingField extends BaseField {
  type: FieldType.RATING;
  max: number;
}

export interface CheckboxField extends BaseField {
  type: FieldType.CHECKBOX;
  options: string[];
}
export interface RadioField extends BaseField {
  type: FieldType.RADIO;
  options: string[];
}

export type FormField = TextField | TextareaField | NumberField | DateField | DropdownField | DynamicDropdownField | RatingField | CheckboxField | RadioField;

export interface TicketType {
  id: string;
  name: string;
  fields: FormField[];
}

export interface Ticket {
  id: string;
  ticketTypeId: string;
  createdAt: string;
  status: 'New' | 'In Progress' | 'Closed';
  formData: Record<string, any>;
  agentId?: string;
}

export interface AgentReportData {
    employeeName: string;
    ticketCount: number;
    averageRating: number;
}

export interface ErrorReportData {
    category: string;
    subType: string;
    count: number;
}

// User Management Types
export type Role = 'admin' | 'qa_manager' | 'team_leader' | 'agent';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  teamId: string;
  avatar?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  stats: {
    avgScore: number;
    totalTickets: number;
    complianceRate: number;
  };
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
}

export interface Department {
    id: string;
    name: string;
}
