import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SecurityErrorProps {
  message: string | null;
}

export const SecurityError: React.FC<SecurityErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mt-2 flex items-center text-sm text-red-600 animate-fadeIn" role="alert" aria-live="polite">
      <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
