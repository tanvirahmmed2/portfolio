"use client";
import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const showToast = (message, type = 'success') => {
    if (type === 'error') {
      toast.error(message);
    } else if (type === 'warning') {
      toast(message, {
        icon: '⚠️',
        style: {
          border: '1px solid #d97706',
          padding: '16px',
          color: '#fef3c7',
          background: '#78350f',
        },
      });
    } else {
      toast.success(message);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#171717',
            color: '#ffffff',
            border: '1px solid #262626',
            borderRadius: '1rem',
            padding: '16px',
            fontSize: '0.875rem',
            maxWidth: '380px',
          },
          success: {
            style: {
              border: '1px solid #10b981',
              background: '#064e3b',
              color: '#d1fae5',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
              background: '#4c0519',
              color: '#ffe4e6',
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
