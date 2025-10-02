

import React, { useState } from 'react';
import type { FormField, TicketType } from '../types';
import { FieldType } from '../types';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';

interface TicketTypeBuilderProps {
  onSubmit: (ticketType: TicketType) => void;
  onCancel: () => void;
}

type FormValues = {
  name: string;
  fields: FormField[];
};

export const TicketTypeBuilder: React.FC<TicketTypeBuilderProps> = ({ onSubmit, onCancel }) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: '', fields: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  const watchedFields = watch('fields');

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    const newTicketType: TicketType = {
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      fields: data.fields,
    };
    onSubmit(newTicketType);
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
    <div className="bg-surface p-8 rounded-lg shadow-2xl max-w-5xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Ticket Type Name</label>
          <input {...register('name', { required: true })} className={commonClasses} placeholder="e.g., Compliance Audit" />
          {errors.name && <p className="text-red-400 text-xs mt-1">Ticket type name is required.</p>}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Fields</h3>
          {fields.map((item, index) => (
            <div key={item.id} className="bg-border p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input {...register(`fields.${index}.label`, { required: true })} placeholder="Field Label" className={commonClasses} />
                <input {...register(`fields.${index}.id`, { required: true })} placeholder="Field ID (e.g., employeeId)" className={commonClasses} />
                <Controller
                  name={`fields.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={commonClasses}>
                      {Object.values(FieldType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  )}
                />
              </div>

              {watchedFields[index]?.type === FieldType.DROPDOWN && (
                <textarea {...register(`fields.${index}.options` as any)} placeholder="Options (comma-separated)" className={`${commonClasses} h-20`} />
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
                  <textarea {...register(`fields.${index}.optionsMap` as any)} placeholder={`Options Map (JSON format)\ne.g., {"Parent Option 1": ["Child 1", "Child 2"]}`} className={`${commonClasses} h-24`} />
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <label className="flex items-center space-x-2 text-sm text-text-secondary">
                  {/* FIX: Destructure `value` from `field` to avoid passing a boolean `value` prop to the input, which causes a type error. Use `value` for the `checked` prop and spread the rest. */}
                  <Controller name={`fields.${index}.required`} control={control} render={({field: { value, ...fieldProps }}) => <input type="checkbox" {...fieldProps} checked={value} className="form-checkbox bg-surface border-border rounded text-primary focus:ring-primary" />} />
                  <span>Required</span>
                </label>
                <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-300 font-semibold">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addField} className="w-full py-2 rounded-md bg-border text-text-primary font-semibold hover:bg-gray-600 transition">Add Field</button>
        </div>

        <div className="flex justify-end pt-4 space-x-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-border text-text-primary font-semibold hover:bg-gray-600 transition">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/80 transition">Save Ticket Type</button>
        </div>
      </form>
    </div>
  );
};