import React, { useState } from 'react';

export const TabsList = ({ children, className = "" }) => (
  <div className={`flex space-x-2 border-b mb-6 min-h-[41px] ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => (
    <button
      type="button"
      className={`px-4 py-2 flex items-center ${
        activeTab === value ? 'border-b-2 border-emerald-800 text-emerald-800' : 'text-gray-600'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
);

export const TabsContent = ({ children, value, activeTab }) => (
    <div className={`mt-4 ${value === activeTab ? 'block' : 'hidden'}`}>
      {children}
    </div>
);

export const TabsContainer = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const modifiedChildren = React.Children.map(children, child => {
    if (!child) return null;

    if (child.type === TabsTrigger) {
      return React.cloneElement(child, {
        activeTab,
        setActiveTab
      });
    }

    if (child.type === TabsContent) {
      return React.cloneElement(child, {
        activeTab
      });
    }

    if (child.type === TabsList) {
      const modifiedTabsListChildren = React.Children.map(child.props.children, tabChild => {
        if (!tabChild) return null;
        if (tabChild.type === TabsTrigger) {
          return React.cloneElement(tabChild, {
            activeTab,
            setActiveTab
          });
        }
        return tabChild;
      });
  
      return React.cloneElement(child, {
        children: modifiedTabsListChildren
      });
    }
  
    return child;
  });
  return <div>{modifiedChildren}</div>;
};
