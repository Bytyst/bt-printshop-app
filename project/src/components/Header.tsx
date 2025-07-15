import React from 'react';

export default function Header() {
  return (
    <header className="h-14 shadow-sm border-b border-gray-200 bg-secondary-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center h-full">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-white rounded flex items-center justify-center text-secondary-charcoal">
              <span className="font-bold text-sm">BT</span>
            </div>
            <span className="text-neutral-white font-semibold text-lg">BT Printshop</span>
          </div>
        </div>
      </div>
    </header>
  );
}