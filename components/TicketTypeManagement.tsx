import React, { useState, useEffect } from 'react';
import type { FormField, TicketType, Ticket } from '../types';
import { FieldType } from '../types';
import { useForm, useFieldArray, Controller, SubmitHandler, Control, useWatch } from 'react-hook-form';
import { Icon } from './Icon';
import { ConfirmDialog } from './common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

interface TicketTypeManagementProps {
  ticketTypes: TicketType[];
  tickets: Ticket[];
  onSave: (ticketType: TicketType) => void;
  onDelete: (ticketTypeId: string) => boolean;
}

type FormValues = {
  id: string;
  name: string;
  fields: FormField[];
};

// --- New Sub-Component for Dynamic Dropdown UX ---
interface DynamicOptionsMapperProps {
  fieldIndex: number;
  control: Control<FormValues>;
}

const DynamicOptionsMapper: React.FC<DynamicOptionsMapperProps> = ({ fieldIndex, control }) => {
    const allFields = useWatch({ control, name: 'fields' });
    const dependsOnId = useWatch({ control, name: `fields.${fieldIndex}.dependsOn` });

    const getParentOptions = (field: FormField | undefined): string[] => {
        if (!field) return [];
        if (field.type === FieldType.DROPDOWN && Array.isArray(field.options)) {
            return field.options;
        }
        if (field.type === FieldType.DYNAMIC_DROPDOWN && typeof field.optionsMap === 'object') {
            return Object.values(field.optionsMap).flat();
        }
        return [];
    };

    const parentField = allFields.find(f => f.id === dependsOnId);
    const parentOptions = getParentOptions(parentField);

    if (!dependsOnId) {
        return <div className="text-sm text-text-secondary p-4 bg-surface rounded-md h-full flex items-center justify-center">Select a "Depends On" field to map options.</div>;
    }
    
    if (!parentField || parentOptions.length === 0) {
        return <div className="text-sm text-text-secondary p-4 bg-surface rounded-md h-full flex items-center justify-center">The selected parent field has no options configured.</div>;
    }
    
    return (
        <Controller
            name={`fields.${fieldIndex}.optionsMap`}
            control={control}
            defaultValue={{}}
            render={({ field: { onChange, value: optionsMapValue } }) => (
                <div className="space-y-3 p-4 bg-surface rounded-lg max-h-64 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-text-secondary sticky top-0 bg-surface pb-2">Map Child Options</h4>
                    {parentOptions.map(parentOption => (
                        <div key={parentOption}>
                            <label className="block text-sm font-medium text-text-primary mb-1.5 truncate" title={parentOption}>{parentOption}</label>
                            <textarea
                                value={((optionsMapValue || {})[parentOption] || []).join(', ')}
                                onChange={e => {
                                    const newChildOptions = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                    onChange({ ...optionsMapValue, [parentOption]: newChildOptions });
                                }}
                                placeholder="Child options, comma-separated"
                                className="w-full bg-border border border-gray-600 rounded-md px-3 py-2 text-text-primary text-sm font-mono focus:ring-primary focus:border-primary transition"
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            )}
        />
    );
};


export const TicketTypeManagement: React.FC<TicketTypeManagementProps> = ({ ticketTypes, tickets, onSave, onDelete }) => {
  const [editingTicketType, setEditingTicketType] = useState<TicketType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<TicketType | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { hasPermission } = useAuth();
  const isAdmin = hasPermission(['admin']);

  const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    defaultValues: { id: '', name: '', fields: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  const watchedFields = watch('fields');

  useEffect(() => {
    if (editingTicketType) {
      reset(editingTicketType);
    } else {
      reset({ id: '', name: '', fields: [] });
    }
  }, [editingTicketType, reset]);

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSave(data as TicketType);
    setEditingTicketType(null);
  };
  
  const handleEdit = (ticketType: TicketType) => {
    setEditingTicketType(ticketType);
  };

  const handleCancelEdit = () => {
    setEditingTicketType(null);
  };

  const handleDeleteRequest = (ticketType: TicketType) => {
    setTypeToDelete(ticketType);
  };
  
  const handleConfirmDelete = () => {
    if (typeToDelete) {
      const success = onDelete(typeToDelete.id);
      if (!success) {
        const ticketCount = tickets.filter(t => t.ticketTypeId === typeToDelete.id).length;
        setDeleteError(`Cannot delete. This type is used by ${ticketCount} ticket(s).`);
      } else {
        setTypeToDelete(null);
      }
    }
  };
  
  const closeDeleteDialog = () => {
      setTypeToDelete(null);
      setDeleteError(null);
  };

  const addField = () => {
    append({
      id: `field-${Date.now()}`,
      label: '',
      type: FieldType.TEXT,
      required: false,
    } as FormField);
  };
  
  const commonClasses = "w-full bg-surface border border-border rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary transition";

  return (
    <div className="space-y-8">
      {/* List of Existing Ticket Types */}
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Existing Ticket Types</h3>
        <ul className="space-y-3">
          {ticketTypes.map(tt => (
            <li key={tt.id} className="flex justify-between items-center p-3 bg-border rounded-md">
              <div>
                <p className="font-semibold text-text-primary">{tt.name}</p>
                <p className="text-xs text-text-secondary">{tt.fields.length} fields</p>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(tt)} className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-surface" title="Edit Type"><Icon name="edit" className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteRequest(tt)} className="p-2 text-text-secondary hover:text-red-400 transition-colors rounded-full hover:bg-surface" title="Delete Type"><Icon name="delete" className="w-4 h-4" /></button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Ticket Type Form/Builder */}
      <div className="bg-surface p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">{editingTicketType ? 'Edit Ticket Type' : 'Create New Ticket Type'}</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Ticket Type Name</label>
                <input {...register('name', { required: true })} className={commonClasses} placeholder="e.g., Compliance Audit" />
                {errors.name && <p className="text-red-400 text-xs mt-1">Ticket type name is required.</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Unique ID</label>
                <input {...register('id', { required: true, pattern: /^[a-z0-9-]+$/ })} disabled={!!editingTicketType} className={`${commonClasses} disabled:bg-gray-800`} placeholder="e.g., compliance-audit" />
                {errors.id && <p className="text-red-400 text-xs mt-1">ID must be unique, lowercase, and contain no spaces.</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Fields</h3>
            {fields.map((item, index) => (
              <div key={item.id} className="bg-border p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input {...register(`fields.${index}.label`, { required: true })} placeholder="Field Label" className={commonClasses} />
                  <input {...register(`fields.${index}.id`, { required: true })} placeholder="Field ID (e.g., employeeId)" className={commonClasses} />
                  <Controller name={`fields.${index}.type`} control={control} render={({ field }) => (
                      <select {...field} className={commonClasses}>
                        {Object.values(FieldType).map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                  )} />
                </div>
                 {watchedFields[index]?.type === FieldType.DROPDOWN && (
                    <Controller
                        name={`fields.${index}.options` as any}
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                placeholder="Options (comma-separated)"
                                className={`${commonClasses} h-20`}
                            />
                        )}
                    />
                 )}
                 {watchedFields[index]?.type === FieldType.DYNAMIC_DROPDOWN && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name={`fields.${index}.dependsOn` as any}
                        control={control}
                        render={({ field }) => (
                           <select {...field} className={commonClasses}>
                            <option value="">Depends On...</option>
                            {watchedFields.slice(0, index).filter(f => f.type === FieldType.DROPDOWN || f.type === FieldType.DYNAMIC_DROPDOWN).map(f => (
                              <option key={f.id} value={f.id}>{f.label} ({f.id})</option>
                            ))}
                           </select>
                        )}
                      />
                      <DynamicOptionsMapper 
                        fieldIndex={index}
                        control={control}
                      />
                    </div>
                  )}
                <div className="flex justify-between items-center">
                  <label className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Controller name={`fields.${index}.required`} control={control} render={({field: { value, ...fieldProps }}) => <input type="checkbox" {...fieldProps} checked={!!value} className="form-checkbox bg-surface border-border rounded text-primary focus:ring-primary" />} />
                    <span>Required</span>
                  </label>
                  <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-300 font-semibold">Remove</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addField} className="w-full py-2 rounded-md bg-border text-text-primary font-semibold hover:bg-gray-600 transition">Add Field</button>
          </div>

          <div className="flex justify-end pt-4 space-x-4">
            {editingTicketType && <button type="button" onClick={handleCancelEdit} className="px-6 py-2 rounded-md bg-border text-text-primary font-semibold hover:bg-gray-600 transition">Cancel</button>}
            <button type="submit" disabled={!isDirty} className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/80 transition disabled:bg-primary/50 disabled:cursor-not-allowed">
                {editingTicketType ? 'Save Changes' : 'Create Ticket Type'}
            </button>
          </div>
        </form>
      </div>
      {typeToDelete && (
        <ConfirmDialog
            isOpen={!!typeToDelete}
            title="Delete Ticket Type"
            message={deleteError ? <span className="text-yellow-400">{deleteError}</span> : `Are you sure you want to permanently delete the "${typeToDelete.name}" ticket type? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={closeDeleteDialog}
            confirmText={deleteError ? "OK" : "Delete"}
        />
      )}
    </div>
  );
};
