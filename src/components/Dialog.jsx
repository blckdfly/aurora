import React, { useState } from 'react';

export const Dialog = ({ children, onOpenChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpenChange = (open) => {
      setIsOpen(open);
      if (onOpenChange) onOpenChange(open);
    };
    
    return React.Children.map(children, child =>
      React.cloneElement(child, { 
        isOpen, 
        setIsOpen: handleOpenChange
      })
    );
};

export const DialogTrigger = ({ children, setIsOpen }) => {
  return React.cloneElement(children, {
    onClick: () => setIsOpen(true)
  });
};

export const DialogContent = ({ children, isOpen, setIsOpen, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg p-6 max-w-md mx-4 relative ${className}`}>
        {children}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
        </button>
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);