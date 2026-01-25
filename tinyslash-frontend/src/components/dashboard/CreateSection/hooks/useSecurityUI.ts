import { useState } from 'react';
import toast from 'react-hot-toast';

export const useSecurityUI = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showSecurityBlockedUI = () => {
    const headline = "🚫 Link blocked by Tinyslash Security";
    const message = "This URL did not pass our security checks.";
    const inlineMessage = "Link blocked by Tinyslash Security. This URL did not pass our security checks.";

    toast.error(
      // Using simple string here or we'd need to import React and JSX
      `${headline}\n${message}`,
      {
        duration: 6000,
        style: {
          border: '1px solid #EF4444',
          background: '#FEF2F2',
          color: '#7F1D1D',
        },
      }
    );

    setErrorMessage(inlineMessage);
  };

  const isSecurityError = (error: any) => {
    // Check various error structures
    if (error?.response?.status === 422) return true;
    if (error?.response?.data?.error === 'SECURITY_BLOCKED') return true;

    // Check message content for specific security keywords
    const message = error?.response?.data?.message || error?.message || (typeof error === 'string' ? error : '');
    if (
      message.includes('Security Violation') ||
      message.includes('high_risk_score') ||
      message.includes('SECURITY_BLOCKED')
    ) {
      return true;
    }

    return false;
  };

  // 🛡️ Centralized Error Handler
  const handleApiError = (error: any) => {
    // 1. Strict Security Check
    if (isSecurityError(error)) {
      showSecurityBlockedUI();
      return true; // Stop execution
    }

    // 2. Generic Error Handling
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred';

    toast.error(msg);
    setErrorMessage(msg);
    return false; // Did not handle security error
  };

  return {
    errorMessage,
    setErrorMessage,
    showSecurityBlockedUI,
    handleApiError,
    isSecurityError
  };
};
