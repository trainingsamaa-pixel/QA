import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isWarning?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isWarning = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-surface rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <h3 className={`text-xl font-bold ${isWarning ? 'text-red-400' : 'text-white'}`}>{title}</h3>
        <p className="text-text-secondary mt-2 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-border text-text-primary font-semibold hover:bg-gray-600 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white font-semibold transition ${isWarning ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/80'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};