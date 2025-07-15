import React, { useState } from 'react';
import { Zap, Send } from 'lucide-react';

export default function CommandCenter() {
  const [command, setCommand] = useState('');

  const handleSend = () => {
    if (command.trim()) {
      // Handle command submission
      console.log('Command sent:', command);
      setCommand('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const insertExampleCommand = (cmd: string) => {
    setCommand(cmd);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-charcoal">Command Center</h1>
      </div>

      {/* Main Command Center */}
      <div className="bg-secondary-charcoal rounded shadow-sm p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded flex items-center justify-center bg-primary-teal">
            <Zap className="h-8 w-8 text-neutral-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-white">Telegram Command Center</h2>
            <p className="text-gray-300">Send commands to trigger your n8n workflows</p>
          </div>
        </div>

        {/* Command Input Section */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-neutral-white mb-4">Command</label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Create quote for 50 shirts, 2 colors front, 1 back"
              className="flex-1 px-4 py-3 border border-gray-600 rounded focus:ring-2 focus:ring-primary-teal focus:border-transparent bg-gray-700 text-neutral-white placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!command.trim()}
              className={`px-6 py-3 text-neutral-white rounded hover:opacity-90 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center space-x-2 font-medium ${
                !command.trim() ? 'bg-gray-600' : 'bg-primary-teal hover:bg-primary-teal-dark'
              }`}
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Example Commands Section */}
        <div className="bg-gray-800 rounded p-6">
          <h3 className="text-lg font-semibold text-neutral-white mb-4">Example Commands:</h3>
          <div className="space-y-3">
            {[
              "Create quote for 30 hoodies, logo front, ABC Corp",
              "Juan's quote is approved with $200 deposit",
              "Update inventory: 50 white smalls received",
              "Schedule production for INV001 on July 15"
            ].map((example, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary-teal"></div>
                <button
                  onClick={() => insertExampleCommand(example)}
                  className="hover:opacity-75 transition-colors text-left text-primary-teal-light"
                >
                  {example}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Command Center Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-white rounded shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded bg-primary-teal flex items-center justify-center">
              <Zap className="h-5 w-5 text-neutral-white" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-charcoal">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => insertExampleCommand("Create quote for 25 shirts")}
              className="w-full text-left p-3 bg-neutral-bg-light rounded hover:bg-primary-teal-accent transition-colors text-secondary-charcoal"
            >
              Create Quote
            </button>
            <button 
              onClick={() => insertExampleCommand("Update inventory")}
              className="w-full text-left p-3 bg-neutral-bg-light rounded hover:bg-primary-teal-accent transition-colors text-secondary-charcoal"
            >
              Update Inventory
            </button>
            <button 
              onClick={() => insertExampleCommand("Schedule production")}
              className="w-full text-left p-3 bg-neutral-bg-light rounded hover:bg-primary-teal-accent transition-colors text-secondary-charcoal"
            >
              Schedule Production
            </button>
          </div>
        </div>

        <div className="bg-neutral-white rounded shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-secondary-charcoal mb-4">Recent Commands</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-neutral-bg-light rounded text-neutral-gray-medium">
              Create quote for ABC Corp - 2 min ago
            </div>
            <div className="p-2 bg-neutral-bg-light rounded text-neutral-gray-medium">
              Update inventory received - 5 min ago
            </div>
            <div className="p-2 bg-neutral-bg-light rounded text-neutral-gray-medium">
              Schedule production J001 - 10 min ago
            </div>
          </div>
        </div>

        <div className="bg-neutral-white rounded shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-secondary-charcoal mb-4">Workflow Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-gray-medium">Quote Creation</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-gray-medium">Inventory Updates</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-gray-medium">Production Scheduling</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}