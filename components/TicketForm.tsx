import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { Ticket, TicketType, FormField, DynamicDropdownField } from '../types';
import { FieldType } from '../types';

// This component isolates the useEffect hook, fixing the conditional hook call error.
const DynamicDropdown: React.FC<{
  field: DynamicDropdownField;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  formValues: Record<string, any>;
}> = ({ field, register, setValue, formValues }) => {
  const commonClasses = "w-full bg-surface border border-border rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary transition";
  const parentValue = formValues[field.dependsOn];
  const options = parentValue ? field.optionsMap[parentValue] || [] : [];
  
  useEffect(() => {
    // When parent value changes, reset this field's value if it's not being initialized
    if (formValues[field.id] !== undefined) {
      setValue(field.id, '');
    }
  }, [parentValue, field.id, setValue]);

  return (
    <select {...register(field.id, { required: field.required })} className={commonClasses} disabled={!parentValue}>
      <option value="">Select...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
};

interface TicketFormProps {
  ticketTypes: TicketType[];
  selectedTicketType: TicketType | null;
  onTicketTypeChange: (ticketType: TicketType | null) => void;
  onSubmit: (data: Omit<Ticket, 'id' | 'createdAt' | 'status'>, ticketId?: string) => void;
  onCancel: () => void;
  ticketToEdit?: Ticket | null;
}

export const TicketForm: React.FC<TicketFormProps> = ({ ticketTypes, selectedTicketType, onTicketTypeChange, onSubmit, onCancel, ticketToEdit }) => {
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm();
  const formValues = watch();
  const isEditing = !!ticketToEdit;

  useEffect(() => {
    if (isEditing && ticketToEdit) {
      // If editing, pre-fill the form with existing ticket data
      reset(ticketToEdit.formData);
    } else {
      // If creating new or changing type, reset form
      reset();
    }
  }, [selectedTicketType, ticketToEdit, isEditing, reset]);
  
  const handleFormSubmit: SubmitHandler<Record<string, any>> = (data) => {
    if (!selectedTicketType) return;
    
    const ticketData = {
      ticketTypeId: selectedTicketType.id,
      formData: data,
    };
    onSubmit(ticketData, isEditing ? ticketToEdit.id : undefined);
  };
  
  const renderField = (field: FormField) => {
    const commonClasses = "w-full bg-surface border border-border rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary transition";

    switch (field.type) {
      case FieldType.TEXT:
      case FieldType.DATE:
      case FieldType.NUMBER:
        return <input type={field.type} {...register(field.id, { required: field.required })} className={commonClasses} />;
      
      case FieldType.TEXTAREA:
        return <textarea {...register(field.id, { required: field.required })} className={commonClasses} rows={4}></textarea>;
      
      case FieldType.RATING:
        return (
            <div className="flex items-center space-x-1">
                <Controller
                    name={field.id}
                    control={control}
                    rules={{ required: field.required }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        {[...Array(field.max)].map((_, i) => (
                            <button type="button" key={i} onClick={() => onChange(i + 1)} className={`transition-colors ${i < value ? 'text-yellow-400' : 'text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </button>
                        ))}
                      </>
                    )}
                />
            </div>
        );

      case FieldType.DROPDOWN:
        return (
          <select {...register(field.id, { required: field.required })} className={commonClasses}>
            <option value="">Select...</option>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );

      case FieldType.DYNAMIC_DROPDOWN:
        return <DynamicDropdown
            field={field}
            register={register}
            setValue={setValue}
            formValues={formValues}
        />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-surface p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
        <div className="mb-6">
            <label htmlFor="ticket-type-select" className="block text-sm font-medium text-text-secondary mb-2">Ticket Type</label>
            <select
                id="ticket-type-select"
                value={selectedTicketType?.id || ''}
                onChange={(e) => onTicketTypeChange(ticketTypes.find(tt => tt.id === e.target.value) || null)}
                className="w-full bg-border border border-gray-600 rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary transition"
                disabled={isEditing}
            >
                <option value="">-- Select a Ticket Type --</option>
                {ticketTypes.map(tt => <option key={tt.id} value={tt.id}>{tt.name}</option>)}
            </select>
        </div>

        {selectedTicketType && (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedTicketType.fields.map(field => (
                        <div key={field.id} className={field.type === FieldType.TEXTAREA ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                {field.label} {field.required && <span className="text-red-400">*</span>}
                            </label>
                            {renderField(field)}
                            {errors[field.id] && <p className="text-red-400 text-xs mt-1">This field is required.</p>}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4 space-x-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-border text-text-primary font-semibold hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/80 transition">{isEditing ? 'Update Ticket' : 'Submit Ticket'}</button>
                </div>
            </form>
        )}
    </div>
  );
};