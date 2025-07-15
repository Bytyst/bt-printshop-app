import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { StatusBadge, Modal } from './shared';

interface CalendarEvent {
  id: string;
  title: string;
  client: string;
  description: string;
  date: string;
  status: 'IN_PRODUCTION' | 'READY' | 'URGENT' | 'COMPLETED';
  estimatedHours?: number;
  sizes?: { [key: string]: number };
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'J001',
    client: 'Mark Shirts',
    description: '31 Hoodies, Heat Transfer, Fast Eagles',
    status: 'IN_PRODUCTION',
    date: '2025-01-15',
    estimatedHours: 8,
    sizes: { 'S': 5, 'M': 12, 'L': 10, 'XL': 4 }
  },
  {
    id: '2',
    title: 'J002',
    client: 'Boxcar Financial Group',
    description: 'Polo Shirts, Embroidery',
    status: 'IN_PRODUCTION',
    date: '2025-01-16',
    estimatedHours: 6,
    sizes: { 'S': 8, 'M': 15, 'L': 12, 'XL': 5, 'XXL': 2 }
  },
  {
    id: '3',
    title: 'J003',
    client: 'John Doe',
    description: 'Acme Division Inc.',
    status: 'READY',
    date: '2025-01-17',
    estimatedHours: 4,
    sizes: { 'M': 8, 'L': 6, 'XL': 3 }
  },
  {
    id: '4',
    title: 'J004',
    client: 'Neighborhood Wedding',
    description: 'Misc Merchandise, A.M.',
    status: 'URGENT',
    date: '2025-01-18',
    estimatedHours: 12,
    sizes: { 'S': 10, 'M': 20, 'L': 15, 'XL': 8, 'XXL': 2 }
  },
  {
    id: '5',
    title: 'J005',
    client: 'Shelby Sam',
    description: 'Pre-Production',
    status: 'COMPLETED',
    date: '2025-01-19',
    estimatedHours: 3,
    sizes: { 'S': 3, 'M': 5, 'L': 4 }
  },
  {
    id: '6',
    title: 'J006',
    client: 'Young Shirts',
    description: 'Embroidery, Heat Transfer',
    status: 'READY',
    date: '2025-01-20',
    estimatedHours: 5,
    sizes: { 'S': 6, 'M': 10, 'L': 8, 'XL': 6 }
  },
  {
    id: '7',
    title: 'J007',
    client: 'Tech Startup',
    description: 'Corporate Uniforms',
    status: 'URGENT',
    date: '2025-01-21',
    estimatedHours: 10,
    sizes: { 'XS': 2, 'S': 8, 'M': 15, 'L': 12, 'XL': 8, 'XXL': 3 }
  },
  {
    id: '8',
    title: 'J008',
    client: 'Local School',
    description: 'Team Jerseys',
    status: 'IN_PRODUCTION',
    date: '2025-01-22',
    estimatedHours: 7,
    sizes: { 'S': 12, 'M': 18, 'L': 15, 'XL': 5 }
  }
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [tempSizeValue, setTempSizeValue] = useState('');
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isNextMonth: false
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false
      });
    }
    
    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }
    
    return days;
  };

  const getEventsForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const getDayDateString = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return '';
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleStatusClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowStatusModal(true);
  };

  const handleStatusChange = (eventId: string, newStatus: CalendarEvent['status']) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus }
          : event
      )
    );
    setShowStatusModal(false);
    setSelectedEvent(null);
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragOverDay(null);
  };

  const handleDragOver = (e: React.DragEvent, dayDateString: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(dayDateString);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, dayDateString: string) => {
    e.preventDefault();
    if (draggedEvent && dayDateString) {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === draggedEvent.id 
            ? { ...event, date: dayDateString }
            : event
        )
      );
    }
    setDraggedEvent(null);
    setDragOverDay(null);
  };
  const handleDescriptionEdit = () => {
    if (selectedEvent) {
      setTempDescription(selectedEvent.description);
      setEditingDescription(true);
    }
  };

  const handleDescriptionSave = () => {
    if (selectedEvent) {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, description: tempDescription }
            : event
        )
      );
      setSelectedEvent({ ...selectedEvent, description: tempDescription });
      setEditingDescription(false);
    }
  };

  const handleDescriptionCancel = () => {
    setTempDescription(selectedEvent?.description || '');
    setEditingDescription(false);
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  const handleSizeEdit = (size: string) => {
    if (selectedEvent?.sizes) {
      setTempSizeValue(''); // Clear immediately on click
      setEditingSize(size);
      setHasStartedTyping(true); // Already cleared, so ready for normal typing
    }
  };

  const handleSizeSave = () => {
    if (selectedEvent && editingSize) {
      const newQuantity = parseInt(tempSizeValue) || 0;
      const updatedSizes = { ...selectedEvent.sizes };
      
      if (newQuantity > 0) {
        updatedSizes[editingSize] = newQuantity;
      } else {
        delete updatedSizes[editingSize];
      }
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, sizes: updatedSizes }
            : event
        )
      );
      setSelectedEvent({ ...selectedEvent, sizes: updatedSizes });
      setEditingSize(null);
    }
  };

  const handleSizeCancel = () => {
    setEditingSize(null);
    setTempSizeValue('');
    setHasStartedTyping(false);
  };

  const handleSizeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSizeSave();
    } else if (e.key === 'Escape') {
      handleSizeCancel();
    }
  };

  const addNewSize = () => {
    setShowSizeDropdown(true);
  };

  const selectNewSize = (size: string) => {
    setTempSizeValue('1');
    setEditingSize(size);
    setHasStartedTyping(false);
    setShowSizeDropdown(false);
  };

  const closeModals = () => {
    setShowStatusModal(false);
    setShowEventModal(false);
    setSelectedEvent(null);
    setEditingDescription(false);
    setEditingSize(null);
    setEditingDate(false);
    setHasStartedTyping(false);
    setShowSizeDropdown(false);
  };

  const handleDateEdit = () => {
    if (selectedEvent) {
      setTempDate(selectedEvent.date);
      setEditingDate(true);
    }
  };

  const handleDateSave = () => {
    if (selectedEvent && tempDate) {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, date: tempDate }
            : event
        )
      );
      setSelectedEvent({ ...selectedEvent, date: tempDate });
      setEditingDate(false);
    }
  };

  const handleDateCancel = () => {
    setTempDate(selectedEvent?.date || '');
    setEditingDate(false);
  };

  const handleDateKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDateSave();
    } else if (e.key === 'Escape') {
      handleDateCancel();
    }
  };

  const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Normal input handling since we clear on click
    setTempSizeValue(newValue);
  };

  const handleSizeInputFocus = () => {
    // No special focus handling needed since we clear on click
  };

  const handleDirectSizeChange = (size: string, value: string) => {
    if (selectedEvent) {
      // If the current value is "0" and user types a digit, replace the 0
      let newValue = value;
      if (value.startsWith('0') && value.length > 1 && value !== '0') {
        newValue = value.substring(1);
      }
      
      const newQuantity = parseInt(newValue) || 0;
      const updatedSizes = { ...selectedEvent.sizes };
      
      updatedSizes[size] = newQuantity;
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, sizes: updatedSizes }
            : event
        )
      );
      setSelectedEvent({ ...selectedEvent, sizes: updatedSizes });
    }
  };

  const handleRemoveSize = (size: string) => {
    if (selectedEvent) {
      const updatedSizes = { ...selectedEvent.sizes };
      delete updatedSizes[size];
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, sizes: updatedSizes }
            : event
        )
      );
      setSelectedEvent({ ...selectedEvent, sizes: updatedSizes });
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const statusOptions: CalendarEvent['status'][] = ['IN_PRODUCTION', 'READY', 'URGENT', 'COMPLETED'];

  return (
    <>
      <div className="bg-neutral-white rounded-lg shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 bg-neutral-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-secondary-charcoal">{formatDate(currentDate)}</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{new Date().toLocaleDateString()}</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">
                Today
              </button>
            </div>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="bg-neutral-white">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center">
                <span className="text-xs font-semibold text-gray-600">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((dayInfo, index) => {
              const dayEvents = getEventsForDate(dayInfo.day, dayInfo.isCurrentMonth);
              const dayDateString = getDayDateString(dayInfo.day, dayInfo.isCurrentMonth);
              const isDragOver = dragOverDay === dayDateString;
              const isToday = dayInfo.day === new Date().getDate() && 
                             dayInfo.isCurrentMonth && 
                             currentDate.getMonth() === new Date().getMonth() && 
                             currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div 
                  key={index} 
                  className={`min-h-[120px] border-r border-b border-gray-200 last:border-r-0 transition-colors ${
                    isDragOver ? 'bg-primary-teal-accent' : ''
                  }`}
                  onDragOver={(e) => dayInfo.isCurrentMonth && handleDragOver(e, dayDateString)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => dayInfo.isCurrentMonth && handleDrop(e, dayDateString)}
                >
                  <div className={`h-full p-2 ${
                    !dayInfo.isCurrentMonth ? 'bg-gray-50' : 'bg-neutral-white'
                  }`}>
                    <div className={`text-sm font-medium mb-2 ${
                      !dayInfo.isCurrentMonth 
                        ? 'text-gray-400' 
                        : isToday 
                          ? 'text-blue-600 font-bold' 
                          : 'text-secondary-charcoal'
                    }`}>
                      {dayInfo.day}
                      {isToday && <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">Today</span>}
                    </div>
                    
                    {/* Event Cards */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const isUrgent = event.status === 'URGENT';
                        const isInProduction = event.status === 'IN_PRODUCTION';
                        const isDragging = draggedEvent?.id === event.id;
                        
                        return (
                          <div 
                            key={event.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event)}
                            onDragEnd={handleDragEnd}
                            className={`text-xs p-2 rounded cursor-move transition-all duration-200 transform hover:scale-105 bg-white border-2 w-full ${
                              isUrgent 
                                ? 'border-red-500 shadow-red-100' 
                                : isInProduction 
                                  ? 'border-purple-300 shadow-purple-100' 
                                  : 'border-gray-200'
                            } ${isInProduction ? 'shadow-lg' : 'shadow-sm'} hover:shadow-md ${
                              isDragging ? 'opacity-50 scale-95' : ''
                            }`}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-bold mb-1 text-secondary-charcoal">
                              {event.title} - {event.client}
                            </div>
                            <div className="text-gray-600 mb-2 truncate">
                              {event.description}
                            </div>
                            <div className="flex items-center justify-between">
                              <StatusBadge 
                                status={event.status} 
                                onClick={(e) => handleStatusClick(event, e)}
                              />
                              {event.estimatedHours && (
                                <span className="text-xs text-gray-500">{event.estimatedHours}h</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-1 bg-gray-50 rounded border border-dashed border-gray-300 w-full">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Legend */}
        <div className="p-4 bg-neutral-bg-light border-t border-gray-200">
          <h4 className="text-sm font-semibold text-secondary-charcoal mb-3">Production Status Legend</h4>
          <div className="flex flex-wrap gap-4">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <StatusBadge status={status} />
                <span className="text-xs text-secondary-charcoal font-medium">
                  {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={closeModals}
        title="Change Status"
        subtitle={selectedEvent ? `${selectedEvent.title} - ${selectedEvent.client}` : ''}
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="mb-4">
              <p className="text-gray-600 text-sm">{selectedEvent.description}</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Select new status:</label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedEvent.id, status)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedEvent.status === status 
                        ? 'border-primary-teal bg-primary-teal-accent' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <StatusBadge status={status} className="mb-2" />
                    <div className="text-xs font-medium text-secondary-charcoal">
                      {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowSizeDropdown(false);
          closeModals();
        }}
        title={selectedEvent ? `${selectedEvent.title} - ${selectedEvent.client}` : ''}
        subtitle="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Client</label>
                <p className="text-lg font-semibold text-secondary-charcoal">{selectedEvent.client}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Job Number</label>
                <p className="text-lg font-semibold text-secondary-charcoal">{selectedEvent.title}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              {editingDescription ? (
                <div className="mt-2 space-y-3">
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
                  className="text-secondary-charcoal cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors mt-1"
                  onClick={handleDescriptionEdit}
                  title="Click to edit description"
                >
                  {selectedEvent.description}
                </p>
              )}
            </div>
            
            {/* Size Breakdown Section */}
            {selectedEvent.sizes && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-500">Size Breakdown</label>
                  <div className="relative">
                    <button
                      onClick={addNewSize}
                      className="text-xs bg-primary-teal text-white px-2 py-1 rounded hover:bg-primary-teal-dark transition-colors"
                    >
                      + Add Size
                    </button>
                    
                    {showSizeDropdown && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[120px]">
                        {(() => {
                          const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2-4', '6-8', '10-12', '14-16'];
                          const currentSizes = selectedEvent?.sizes ? Object.keys(selectedEvent.sizes) : [];
                          const availableSizes = allSizes.filter(size => !currentSizes.includes(size));
                          
                          return availableSizes.length > 0 ? (
                            availableSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => selectNewSize(size)}
                                className="block w-full text-left px-3 py-2 text-sm text-secondary-charcoal hover:bg-primary-teal-accent transition-colors"
                              >
                                {size}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              All sizes added
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-neutral-bg-light rounded-lg p-4 border border-primary-teal-accent">
                  <div className="grid grid-cols-6 gap-x-1 gap-y-2">
                    {Object.entries(selectedEvent.sizes).map(([size, quantity]) => (
                      <div key={size} className="flex items-center">
                        <label className="text-xs font-bold text-secondary-charcoal whitespace-nowrap mr-0.5">{size}:</label>
                        <input
                          type="number"
                          value={quantity === 0 ? '' : quantity}
                          onChange={(e) => handleDirectSizeChange(size, e.target.value)}
                          className="w-10 h-7 px-1 py-1 border border-primary-teal rounded text-center text-xs font-semibold text-secondary-charcoal bg-neutral-white focus:ring-1 focus:ring-primary-teal-dark focus:border-transparent ml-1"
                          min="0"
                          placeholder="0"
                          onFocus={(e) => {
                            if (e.target.value === '0') {
                              e.target.select();
                            }
                          }}
                        />
                        <button
                          onClick={() => handleRemoveSize(size)}
                          className="text-red-500 hover:text-red-700 transition-colors text-xs ml-1"
                          title="Remove size"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {editingSize && !selectedEvent.sizes[editingSize] && (
                      <div className="flex items-center">
                        <label className="text-xs font-bold text-secondary-charcoal whitespace-nowrap mr-0.5">{editingSize}:</label>
                        <input
                          type="number"
                          value={tempSizeValue}
                          onChange={(e) => setTempSizeValue(e.target.value)}
                          onKeyPress={handleSizeKeyPress}
                          onBlur={handleSizeSave}
                          className="w-10 h-7 px-1 py-1 border-2 border-primary-teal rounded text-center text-xs font-semibold text-secondary-charcoal bg-neutral-white focus:outline-none ml-1"
                          min="0"
                          placeholder="0"
                          autoFocus
                        />
                        <button
                          onClick={handleSizeCancel}
                          className="text-red-500 hover:text-red-700 transition-colors text-xs ml-1"
                          title="Cancel"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Total Quantity: </span>
                  {Object.values(selectedEvent.sizes).reduce((sum, qty) => sum + qty, 0)} items
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge 
                    status={selectedEvent.status} 
                    onClick={() => setShowStatusModal(true)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Due Date</label>
                {editingDate ? (
                  <div className="mt-2 space-y-3">
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      onKeyPress={handleDateKeyPress}
                      className="w-full p-3 border-2 border-primary-teal rounded-lg focus:outline-none text-secondary-charcoal"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDateSave}
                        className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-teal-dark transition-colors text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleDateCancel}
                        className="px-4 py-2 bg-gray-200 text-secondary-charcoal rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className={`text-secondary-charcoal mt-1 ${
                      selectedEvent.status !== 'COMPLETED' 
                        ? 'cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors' 
                        : 'p-2'
                    }`}
                    onClick={selectedEvent.status !== 'COMPLETED' ? handleDateEdit : undefined}
                    title={selectedEvent.status !== 'COMPLETED' ? "Click to edit date" : "Completed jobs cannot be moved"}
                  >
                    {new Date(selectedEvent.date).toLocaleDateString()}
                    {selectedEvent.status === 'COMPLETED' && (
                      <span className="ml-2 text-xs text-gray-500">(locked)</span>
                    )}
                  </p>
                )}
              </div>
              
              {selectedEvent.estimatedHours && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimated Hours</label>
                  <p className="text-secondary-charcoal">{selectedEvent.estimatedHours}h</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => setShowStatusModal(true)}
                className="flex-1 bg-primary-teal text-white py-2 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors"
              >
                Change Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}