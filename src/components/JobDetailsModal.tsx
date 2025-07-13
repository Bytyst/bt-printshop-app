import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  client: string;
  description: string;
  date: string;
  status: 'IN_PRODUCTION' | 'READY' | 'URGENT' | 'COMPLETED';
  estimatedHours?: number;
}

interface JobDetailsModalProps {
  event: CalendarEvent;
  onSave: (updatedEvent: CalendarEvent) => void;
  onCancel: () => void;
}

export default function JobDetailsModal({ event, onSave, onCancel }: JobDetailsModalProps) {
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  
  const [description, setDescription] = useState(event.description);
  const [tempDescription, setTempDescription] = useState(event.description);
  
  const [notes, setNotes] = useState('Customer prefers darker shade of blue. Rush order - needs by Friday.');
  const [tempNotes, setTempNotes] = useState(notes);

  const handleDescriptionEdit = () => {
    setTempDescription(description);
    setEditingDescription(true);
  };

  const handleDescriptionSave = () => {
    setDescription(tempDescription);
    setEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setTempDescription(description);
    setEditingDescription(false);
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  const handleNotesEdit = () => {
    setTempNotes(notes);
    setEditingNotes(true);
  };

  const handleNotesSave = () => {
    setNotes(tempNotes);
    setEditingNotes(false);
  };

  const handleNotesCancel = () => {
    setTempNotes(notes);
    setEditingNotes(false);
  };

  const handleNotesKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleNotesCancel();
    }
  };

  const handleSaveAll = () => {
    const updatedEvent: CalendarEvent = {
      ...event,
      description: description
    };
    onSave(updatedEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-primary-teal text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Edit Job Details - {event.title}</h3>
              <p className="text-primary-teal-light">{event.client}</p>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-primary-teal-dark rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="bg-primary-teal-accent rounded-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-charcoal mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Job Number</label>
                <div className="bg-neutral-white rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-secondary-charcoal">{event.title}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Client Name</label>
                <div className="bg-neutral-white rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-secondary-charcoal">{event.client}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Quantity</label>
                <div className="bg-neutral-white rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-secondary-charcoal">31</span>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Item Type</label>
                <div className="bg-neutral-white rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-secondary-charcoal">Hoodies</span>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Price Amount</label>
                <div className="bg-neutral-white rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-secondary-charcoal">775</span>
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Estimated Hours</label>
                <div className="bg-neutral-white rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-secondary-charcoal">{event.estimatedHours || 8}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-neutral-bg-light rounded-lg p-6">
            <h2 className="text-2xl font-bold text-secondary-charcoal mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Phone Number</label>
                <input
                  type="text"
                  defaultValue="(555) 123-4567"
                  className="w-full bg-neutral-white rounded-lg p-4 border-2 border-gray-200 text-xl font-bold text-secondary-charcoal focus:border-primary-teal focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-secondary-charcoal mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="mark@markshirts.com"
                  className="w-full bg-neutral-white rounded-lg p-4 border-2 border-gray-200 text-xl font-bold text-secondary-charcoal focus:border-primary-teal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="bg-neutral-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-secondary-charcoal">Job Description</h3>
              {!editingDescription && (
                <button
                  onClick={handleDescriptionEdit}
                  className="text-primary-teal hover:text-primary-teal-dark transition-colors text-sm font-medium opacity-0 hover:opacity-100"
                >
                  
                </button>
              )}
            </div>
            
            {editingDescription ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  onKeyPress={handleDescriptionKeyPress}
                  className="w-full p-3 border-2 border-primary-teal rounded-lg focus:outline-none text-secondary-charcoal"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleDescriptionSave}
                    className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-teal-dark transition-colors text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDescriptionCancel}
                    className="px-4 py-2 bg-gray-200 text-secondary-charcoal rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p 
                className="text-secondary-charcoal cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={handleDescriptionEdit}
              >
                {description}
              </p>
            )}
          </div>

          {/* Production Notes Section */}
          <div className="bg-neutral-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-secondary-charcoal">Production Notes</h3>
              {!editingNotes && (
                <button
                  onClick={handleNotesEdit}
                  className="text-primary-teal hover:text-primary-teal-dark transition-colors text-sm font-medium opacity-0 hover:opacity-100"
                >
                  
                </button>
              )}
            </div>
            
            {editingNotes ? (
              <div className="space-y-3">
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  onKeyPress={handleNotesKeyPress}
                  onBlur={handleNotesSave}
                  className="w-full p-3 border-2 border-primary-teal rounded-lg focus:outline-none text-secondary-charcoal resize-none"
                  rows={4}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleNotesSave}
                    className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-teal-dark transition-colors text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleNotesCancel}
                    className="px-4 py-2 bg-gray-200 text-secondary-charcoal rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="cursor-pointer hover:bg-gray-50 p-3 rounded transition-colors min-h-[100px]"
                onClick={handleNotesEdit}
              >
                <p className="text-secondary-charcoal whitespace-pre-wrap">
                  {notes || 'Click to add production notes...'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button 
              onClick={handleSaveAll}
              className="flex-1 bg-primary-teal text-white py-3 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors font-semibold"
            >
              Save All Changes
            </button>
            <button 
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-secondary-charcoal py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}