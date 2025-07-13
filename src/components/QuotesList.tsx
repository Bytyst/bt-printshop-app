import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Eye, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { mockQuotes, mockClients, getClientById, getInvoiceByQuoteId } from '../data/mockData';
import { Quote } from '../types';

interface QuotesListProps {
  selectedQuoteId?: string;
  selectedClientId?: string;
  onNavigateToClient: (clientId: string) => void;
  onNavigateToInvoice: (invoiceId: string) => void;
  onCreateInvoice: (quoteId: string) => void;
  onClearSelection: () => void;
}

export default function QuotesList({ 
  selectedQuoteId, 
  selectedClientId, 
  onNavigateToClient, 
  onNavigateToInvoice, 
  onCreateInvoice,
  onClearSelection 
}: QuotesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [invoiceFromQuote, setInvoiceFromQuote] = useState({
    customerName: '',
    customerEmail: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    depositReceived: 0
  });
  const [newQuote, setNewQuote] = useState({
    customerName: '',
    customerEmail: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    depositReceived: 0
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-neutral-gray-light text-secondary-charcoal px-3 py-1 rounded-full text-sm font-medium';
      case 'pending': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-primary-teal-dark';
      case 'approved': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-green-500';
      case 'rejected': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-red-500';
      case 'expired': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-orange-500';
      default: return 'bg-neutral-gray-light text-secondary-charcoal px-3 py-1 rounded-full text-sm font-medium';
    }
  };

  const filteredQuotes = mockQuotes.filter(quote => {
    // If we have a selected client, only show their quotes
    if (selectedClientId && quote.clientId !== selectedClientId) {
      return false;
    }
    
    // If we have a selected quote, prioritize it
    if (selectedQuoteId && quote.id === selectedQuoteId) {
      return true;
    }
    
    const matchesSearch = quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQuoteClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuoteModal(true);
  };

  const closeModal = () => {
    setShowQuoteModal(false);
    setSelectedQuote(null);
  };

  const handleCreateInvoice = (quote: Quote) => {
    const existingInvoice = getInvoiceByQuoteId(quote.id);
    if (existingInvoice) {
      onNavigateToInvoice(existingInvoice.id);
    } else {
      onCreateInvoice(quote.id);
    }
  };

  const handleViewClient = (quote: Quote) => {
    onNavigateToClient(quote.clientId);
  };

  const handleCreateQuote = () => {
    setNewQuote({
      customerName: '',
      customerEmail: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      depositReceived: 0
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuote.customerName && newQuote.customerEmail && newQuote.description) {
      const totalAmount = calculateTotal();
      const balanceDue = calculateBalanceDue();
      alert(`Quote created for ${newQuote.customerName} - Total: $${totalAmount} - Balance Due: $${balanceDue}`);
      setShowCreateModal(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewQuote({
      customerName: '',
      customerEmail: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      depositReceived: 0
    });
  };

  const handleCreateInvoiceFromQuote = (quote: Quote) => {
    // Pre-populate invoice form with quote data
    const subtotal = quote.amount / 1.115; // Remove tax to get subtotal
    const unitPrice = subtotal / (quote.items?.[0]?.quantity || 1);
    
    setInvoiceFromQuote({
      customerName: quote.customer,
      customerEmail: '', // Will need to be filled by user
      description: quote.description,
      quantity: quote.items?.[0]?.quantity || 1,
      unitPrice: unitPrice,
      depositReceived: 0
    });
    setShowCreateInvoiceModal(true);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceFromQuote.customerName && invoiceFromQuote.customerEmail && invoiceFromQuote.description) {
      const totalAmount = calculateInvoiceTotal();
      const balanceDue = calculateInvoiceBalanceDue();
      alert(`Invoice created for ${invoiceFromQuote.customerName} - Total: $${totalAmount} - Balance Due: $${balanceDue}`);
      setShowCreateInvoiceModal(false);
    }
  };

  const closeCreateInvoiceModal = () => {
    setShowCreateInvoiceModal(false);
    setInvoiceFromQuote({
      customerName: '',
      customerEmail: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      depositReceived: 0
    });
  };

  const calculateInvoiceSubtotal = () => {
    return (invoiceFromQuote.quantity * invoiceFromQuote.unitPrice).toFixed(2);
  };

  const calculateInvoiceTax = () => {
    const subtotal = invoiceFromQuote.quantity * invoiceFromQuote.unitPrice;
    return (subtotal * 0.115).toFixed(2);
  };

  const calculateInvoiceTotal = () => {
    const subtotal = invoiceFromQuote.quantity * invoiceFromQuote.unitPrice;
    const tax = subtotal * 0.115;
    return (subtotal + tax).toFixed(2);
  };

  const calculateInvoiceBalanceDue = () => {
    const subtotal = invoiceFromQuote.quantity * invoiceFromQuote.unitPrice;
    const tax = subtotal * 0.115;
    const total = subtotal + tax;
    const balanceDue = total - invoiceFromQuote.depositReceived;
    return Math.max(0, balanceDue).toFixed(2);
  };

  const calculateSubtotal = () => {
    return (newQuote.quantity * newQuote.unitPrice).toFixed(2);
  };

  const calculateTax = () => {
    const subtotal = newQuote.quantity * newQuote.unitPrice;
    return (subtotal * 0.115).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = newQuote.quantity * newQuote.unitPrice;
    const tax = subtotal * 0.115;
    return (subtotal + tax).toFixed(2);
  };

  const calculateBalanceDue = () => {
    const subtotal = newQuote.quantity * newQuote.unitPrice;
    const tax = subtotal * 0.115;
    const total = subtotal + tax;
    const balanceDue = total - newQuote.depositReceived;
    return Math.max(0, balanceDue).toFixed(2);
  };

  const selectedClient = selectedClientId ? getClientById(selectedClientId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary-charcoal rounded-lg p-8 text-neutral-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quote Management</h1>
            {selectedClient && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-neutral-white opacity-90 text-lg">Showing quotes for:</span>
                <span className="bg-neutral-white text-secondary-charcoal px-3 py-1 rounded-full font-semibold">{selectedClient.name}</span>
                <button onClick={onClearSelection} className="text-neutral-white opacity-75 hover:opacity-100 text-sm underline">
                  View All Quotes
                </button>
              </div>
            )}
            <p className="text-neutral-white opacity-90 text-lg">Track quotes and manage customer estimates</p>
          </div>
          <button 
            onClick={handleCreateQuote}
            className="bg-primary-teal text-neutral-white px-6 py-3 rounded-lg hover:bg-primary-teal-dark transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>New Quote</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search quotes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-teal focus:border-transparent bg-neutral-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-teal focus:border-transparent bg-neutral-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Quotes Cards */}
      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="bg-neutral-white rounded shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200" onClick={() => handleQuoteClick(quote)}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-secondary-charcoal">
                    {quote.number} - {quote.customer}
                  </h3>
                </div>
                <p className="text-neutral-gray-medium text-lg">{quote.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-neutral-gray-medium">
                  <span>Created: {new Date(quote.createdDate).toLocaleDateString()}</span>
                  <span>Expires: {new Date(quote.expiryDate).toLocaleDateString()}</span>
                  <span>Client ID: {quote.clientId}</span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end space-y-3">
                <div className="text-3xl font-bold text-secondary-charcoal">
                  ${quote.amount}
                </div>
                <span className={getStatusColor(quote.status)}>
                  {quote.status}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleQuoteClick(quote)}
                className="px-4 py-2 bg-primary-teal text-neutral-white text-sm font-semibold rounded-lg hover:bg-primary-teal-dark transition-colors"
              >
                View Details
              </button>
              {quote.status === 'approved' && (
                <button 
                  onClick={() => handleCreateInvoice(quote)}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  {getInvoiceByQuoteId(quote.id) ? 'View Invoice' : 'Create Invoice'}
                </button>
              )}
              <button 
                onClick={() => handleViewClient(quote)}
                className="px-4 py-2 bg-neutral-gray-light text-secondary-charcoal text-sm font-semibold rounded-lg hover:bg-secondary-charcoal-light hover:text-neutral-white transition-colors"
              >
                View Client
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-charcoal mb-2">No quotes found</h3>
          <p className="text-neutral-gray-medium">No quotes match your current search criteria.</p>
        </div>
      )}

      {/* Quote Details Modal */}
      {showQuoteModal && selectedQuote && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-neutral-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-neutral-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedQuote.number} - {selectedQuote.customer}</h3>
                  <p className="text-neutral-white opacity-90">Quote Details & Status</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-all duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Quote Financial Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-teal-accent rounded-lg p-4">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3">Quote Details</h4>
                  <div className="space-y-2 text-secondary-charcoal">
                    <div><span className="font-semibold">Quote #:</span> {selectedQuote.number}</div>
                    <div><span className="font-semibold">Customer:</span> {selectedQuote.customer}</div>
                    <div><span className="font-semibold">Description:</span> {selectedQuote.description}</div>
                    <div><span className="font-semibold">Created:</span> {new Date(selectedQuote.createdDate).toLocaleDateString()}</div>
                    <div><span className="font-semibold">Expires:</span> {new Date(selectedQuote.expiryDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="bg-neutral-gray-light rounded-lg p-4">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3">Financial Summary</h4>
                  <div className="space-y-2 text-secondary-charcoal">
                    <div><span className="font-semibold">Items:</span> {selectedQuote.items?.length || 1}</div>
                    <div><span className="font-semibold">Subtotal:</span> ${(selectedQuote.amount / 1.115).toFixed(2)}</div>
                    <div><span className="font-semibold">Tax (11.5%):</span> ${(selectedQuote.amount - (selectedQuote.amount / 1.115)).toFixed(2)}</div>
                    <div className="border-t border-secondary-charcoal pt-2">
                      <div><span className="font-bold">Quote Amount:</span> <span className="text-xl font-bold">${selectedQuote.amount}</span></div>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold text-secondary-charcoal">Status:</span>
                      <div className="mt-1">
                        <span className={getStatusColor(selectedQuote.status)}>
                          {selectedQuote.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Amount Summary */}
              <div className="text-center bg-primary-teal rounded-lg p-6 text-white">
                <div className="text-4xl font-bold mb-2">${selectedQuote.amount}</div>
                <div className="text-lg opacity-90">Total Quote Amount</div>
                <div className="text-sm opacity-75 mt-2">
                  Balance Due: ${selectedQuote.amount} (No deposit received)
                </div>
              </div>

              {/* Items Breakdown */}
              {selectedQuote.items && selectedQuote.items.length > 0 && (
                <div className="bg-neutral-bg-light rounded-lg p-4 border border-primary-teal-accent">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3">Quote Items</h4>
                  <div className="space-y-2">
                    {selectedQuote.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded">
                        <div>
                          <div className="font-semibold text-secondary-charcoal">{item.description}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity} × ${item.unitPrice}</div>
                        </div>
                        <div className="font-bold text-secondary-charcoal">${item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-primary-teal-accent">
                <button 
                  onClick={() => handleCreateInvoiceFromQuote(selectedQuote)}
                  className="flex-1 min-w-[120px] bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-all font-semibold"
                >
                  Create Invoice
                </button>
                {selectedQuote.status === 'approved' && (
                  <button 
                    onClick={() => handleCreateInvoice(selectedQuote)}
                    className="flex-1 min-w-[120px] bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-all font-semibold"
                  >
                    {getInvoiceByQuoteId(selectedQuote.id) ? 'View Invoice' : 'Create Invoice'}
                  </button>
                )}
                <button 
                  onClick={() => handleViewClient(selectedQuote)}
                  className="flex-1 min-w-[120px] bg-primary-teal text-neutral-white py-3 px-4 rounded-lg hover:bg-primary-teal-dark transition-all font-semibold"
                >
                  View Client Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeCreateModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Create New Quote</h3>
                  <p className="text-primary-teal-light">Simple quote creation</p>
                </div>
                <button 
                  onClick={closeCreateModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={newQuote.customerName}
                  onChange={(e) => setNewQuote({...newQuote, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={newQuote.customerEmail}
                  onChange={(e) => setNewQuote({...newQuote, customerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="customer@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={newQuote.description}
                  onChange={(e) => setNewQuote({...newQuote, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  rows={3}
                  placeholder="Describe the work to be quoted..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newQuote.quantity === 0 ? '' : newQuote.quantity}
                    onChange={(e) => setNewQuote({...newQuote, quantity: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-base"
                   onFocus={(e) => e.target.select()}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newQuote.unitPrice}
                    onChange={(e) => setNewQuote({...newQuote, unitPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-base"
                    placeholder="0.00"
                   onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              
              <div className="bg-primary-teal-accent rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-secondary-charcoal">Subtotal:</span>
                    <span className="text-lg font-bold text-secondary-charcoal">
                      ${calculateSubtotal()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-secondary-charcoal">Tax (11.5%):</span>
                    <span className="text-lg font-bold text-secondary-charcoal">
                      ${calculateTax()}
                    </span>
                  </div>
                  
                  <div className="border-t border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-secondary-charcoal">Quote Amount:</span>
                      <span className="text-xl font-bold text-secondary-charcoal">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-secondary-charcoal">Deposit Expected:</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newQuote.depositReceived}
                        onChange={(e) => setNewQuote({...newQuote, depositReceived: parseFloat(e.target.value) || 0})}
                        className="w-24 px-2 py-1 border border-secondary-charcoal rounded text-right text-sm font-bold text-secondary-charcoal"
                       onFocus={(e) => {
                         if (e.target.value === '0') {
                           e.target.select();
                         }
                       }}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-secondary-charcoal">Balance Due:</span>
                      <span className="text-2xl font-bold text-secondary-charcoal">
                        ${calculateBalanceDue()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-teal text-white py-2 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors font-medium"
                >
                  Create Quote
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Invoice from Quote Modal */}
      {showCreateInvoiceModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeCreateInvoiceModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-green-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Create Invoice from Quote</h3>
                  <p className="text-green-100">Convert quote to invoice</p>
                </div>
                <button 
                  onClick={closeCreateInvoiceModal}
                  className="p-2 hover:bg-green-600 rounded transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={invoiceFromQuote.customerName}
                  onChange={(e) => setInvoiceFromQuote({...invoiceFromQuote, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={invoiceFromQuote.customerEmail}
                  onChange={(e) => setInvoiceFromQuote({...invoiceFromQuote, customerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="customer@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={invoiceFromQuote.description}
                  onChange={(e) => setInvoiceFromQuote({...invoiceFromQuote, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the work performed..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={invoiceFromQuote.quantity === 0 ? '' : invoiceFromQuote.quantity}
                    onChange={(e) => setInvoiceFromQuote({...invoiceFromQuote, quantity: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={invoiceFromQuote.unitPrice}
                    onChange={(e) => setInvoiceFromQuote({...invoiceFromQuote, unitPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.select();
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="text-lg font-bold text-gray-800">
                      ${calculateInvoiceSubtotal()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Tax (11.5%):</span>
                    <span className="text-lg font-bold text-gray-800">
                      ${calculateInvoiceTax()}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Total Amount:</span>
                      <span className="text-xl font-bold text-gray-800">
                        ${calculateInvoiceTotal()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-gray-700">Deposit Received:</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={invoiceFromQuote.depositReceived}
                        onChange={(e) => setInvoiceFromQuote({...invoiceFromQuote, depositReceived: parseFloat(e.target.value) || 0})}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm font-bold text-gray-800"
                        placeholder="0.00"
                        onFocus={(e) => {
                          if (e.target.value === '0') {
                            e.target.select();
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-gray-400 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Balance Due:</span>
                      <span className="text-2xl font-bold text-gray-800">
                        ${calculateInvoiceBalanceDue()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Create Invoice
                </button>
                <button
                  type="button"
                  onClick={closeCreateInvoiceModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}