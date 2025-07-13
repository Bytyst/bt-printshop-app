import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Eye, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { mockInvoices, mockClients, getClientById } from '../data/mockData';
import { Invoice } from '../types';

interface InvoicesListProps {
  invoices: Invoice[];
  customers: any[];
  quotes: any[];
  selectedInvoice: Invoice | null;
  showModal: boolean;
  onUpdateInvoiceStatus: (invoiceId: string, newStatus: Invoice['status']) => void;
  onUpdateInvoicePayment: (invoiceId: string, paidAmount: number, paymentDate?: string) => void;
  onOpenModal: (modalType: string, item?: any) => void;
  onCloseModal: (modalType: string) => void;
  selectedInvoiceId?: string;
  selectedClientId?: string;
  onNavigateToClient: (clientId: string) => void;
  onNavigateToQuote: (quoteId: string) => void;
  onClearSelection: () => void;
}

export default function InvoicesList({ 
  invoices,
  customers,
  quotes,
  selectedInvoice,
  showModal,
  onUpdateInvoiceStatus,
  onUpdateInvoicePayment,
  onOpenModal,
  onCloseModal,
  selectedInvoiceId,
  selectedClientId,
  onNavigateToClient,
  onNavigateToQuote,
  onClearSelection
}: InvoicesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<Invoice | null>(null);
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
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
      case 'sent': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-primary-teal-light';
      case 'paid': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-green-500';
      case 'overdue': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-red-500';
      case 'partial': return 'px-3 py-1 rounded-full text-sm font-medium text-neutral-white bg-secondary-charcoal-light';
      default: return 'bg-neutral-gray-light text-secondary-charcoal px-3 py-1 rounded-full text-sm font-medium';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (invoice: Invoice) => {
    alert("Viewing details for " + invoice.id);
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoiceForPayment(invoice);
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentNotes('');
    setShowPaymentModal(true);
  };

  const handleSendReminder = (invoice: Invoice) => {
    setSelectedInvoiceForReminder(invoice);
    setReminderEmail(invoice.email);
    setReminderMessage(`Hi ${invoice.customer}, this is a friendly reminder about your outstanding invoice ${invoice.number} for $${invoice.amount}. Please let us know if you have any questions.`);
    setShowReminderModal(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoiceForPayment && paymentAmount) {
      alert(`Payment of $${paymentAmount} recorded for ${selectedInvoiceForPayment.number}`);
      setShowPaymentModal(false);
      setSelectedInvoiceForPayment(null);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedInvoiceForPayment(null);
    setPaymentAmount('');
    setPaymentNotes('');
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoiceForReminder && reminderEmail) {
      alert(`Reminder sent to ${reminderEmail} for ${selectedInvoiceForReminder.number}`);
      setShowReminderModal(false);
      setSelectedInvoiceForReminder(null);
    }
  };

  const closeReminderModal = () => {
    setShowReminderModal(false);
    setSelectedInvoiceForReminder(null);
    setReminderEmail('');
    setReminderMessage('');
  };

  const handleCreateInvoice = () => {
    setNewInvoice({
      customerName: '',
      customerEmail: '',
      description: '',
      quantity: 1,
      unitPrice: 0
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInvoice.customerName && newInvoice.customerEmail && newInvoice.description) {
      const totalAmount = calculateTotal();
      const balanceDue = calculateBalanceDue();
      alert(`Invoice created for ${newInvoice.customerName} - Total: $${totalAmount} - Balance Due: $${balanceDue}`);
      setShowCreateModal(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewInvoice({
      customerName: '',
      customerEmail: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      depositReceived: 0
    });
  };

  const calculateSubtotal = () => {
    return (newInvoice.quantity * newInvoice.unitPrice).toFixed(2);
  };

  const calculateTax = () => {
    const subtotal = newInvoice.quantity * newInvoice.unitPrice;
    return (subtotal * 0.115).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = newInvoice.quantity * newInvoice.unitPrice;
    const tax = subtotal * 0.115;
    return (subtotal + tax).toFixed(2);
  };

  const calculateBalanceDue = () => {
    const subtotal = newInvoice.quantity * newInvoice.unitPrice;
    const tax = subtotal * 0.115;
    const total = subtotal + tax;
    const balanceDue = total - newInvoice.depositReceived;
    return Math.max(0, balanceDue).toFixed(2);
  };

  const selectedClient = selectedClientId ? getClientById(selectedClientId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary-charcoal rounded-lg p-8 text-neutral-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoice Management</h1>
            {selectedClient && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-neutral-white opacity-90 text-lg">Showing invoices for:</span>
                <span className="bg-neutral-white text-secondary-charcoal px-3 py-1 rounded-full font-semibold">{selectedClient.name}</span>
                <button onClick={onClearSelection} className="text-neutral-white opacity-75 hover:opacity-100 text-sm underline">
                  View All Invoices
                </button>
              </div>
            )}
            <p className="text-neutral-white opacity-90 text-lg">Track payments and manage customer invoices</p>
          </div>
          <button 
            onClick={handleCreateInvoice}
            className="bg-primary-teal text-neutral-white px-6 py-3 rounded-lg hover:bg-primary-teal-dark transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
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
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Invoice Cards */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-neutral-white rounded shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-secondary-charcoal">
                    {invoice.number} - {invoice.customer}
                  </h3>
                </div>
                <p className="text-neutral-gray-medium text-lg">{invoice.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-neutral-gray-medium">
                  <span>Issued: {new Date(invoice.issueDate).toLocaleDateString()}</span>
                  <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  <span>Email: {invoice.email}</span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end space-y-3">
                <div className="text-3xl font-bold text-secondary-charcoal">
                  ${invoice.amount}
                </div>
                <span className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </span>
              </div>
            </div>
            
            {/* Payment Progress */}
            {invoice.status !== 'draft' && (
              <div className="mt-4 bg-neutral-bg-light rounded-lg p-4 border border-primary-teal-accent">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-charcoal">Payment Progress</span>
                  <span className="text-sm font-bold text-secondary-charcoal">
                    ${invoice.paidAmount} / ${invoice.amount}
                  </span>
                </div>
                <div className="w-full bg-neutral-gray-light rounded-full h-3 mb-2">
                  <div 
                    className="bg-primary-teal h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((invoice.paidAmount / invoice.amount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-neutral-gray-medium">
                  <span>{((invoice.paidAmount / invoice.amount) * 100).toFixed(1)}% paid</span>
                  <span>
                    {invoice.status === 'paid' 
                      ? `Paid on ${invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : 'N/A'}`
                      : `$${(invoice.amount - invoice.paidAmount).toFixed(2)} remaining`
                    }
                  </span>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-4 flex items-center space-x-3">
              <button 
                onClick={() => handleViewDetails(invoice)}
                className="px-4 py-2 bg-primary-teal text-neutral-white text-sm font-semibold rounded-lg hover:bg-primary-teal-dark transition-colors"
              >
                View Details
              </button>
              {invoice.status !== 'paid' && (
                <button 
                  onClick={() => handleRecordPayment(invoice)}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Record Payment
                </button>
              )}
              {(invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'partial') && (
                <button 
                  onClick={() => handleSendReminder(invoice)}
                  className="px-4 py-2 bg-primary-teal-accent text-secondary-charcoal text-sm font-semibold rounded-lg hover:bg-primary-teal hover:text-neutral-white transition-colors"
                >
                  Send Reminder
                </button>
              )}
              <button 
                onClick={() => onNavigateToClient(invoice.clientId)}
                className="px-4 py-2 bg-neutral-gray-light text-secondary-charcoal text-sm font-semibold rounded-lg hover:bg-secondary-charcoal-light hover:text-neutral-white transition-colors"
              >
                View Client
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-charcoal mb-2">No invoices found</h3>
          <p className="text-neutral-gray-medium">No invoices match your current search criteria.</p>
        </div>
      )}

      {/* Payment Recording Modal */}
      {showPaymentModal && selectedInvoiceForPayment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closePaymentModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Record Payment</h3>
                  <p className="text-primary-teal-light">{selectedInvoiceForPayment.number} - {selectedInvoiceForPayment.customer}</p>
                </div>
                <button 
                  onClick={closePaymentModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Payment method, reference number, etc."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-teal text-white py-2 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors font-medium"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedInvoiceForReminder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeReminderModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Send Reminder</h3>
                  <p className="text-primary-teal-light">{selectedInvoiceForReminder.number} - {selectedInvoiceForReminder.customer}</p>
                </div>
                <button 
                  onClick={closeReminderModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleReminderSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send Method
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                  Email
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-teal text-white py-2 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors font-medium"
                >
                  Send Reminder
                </button>
                <button
                  type="button"
                  onClick={closeReminderModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
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
                  <h3 className="text-xl font-bold">Create New Invoice</h3>
                  <p className="text-primary-teal-light">Simple invoice creation</p>
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
                  value={newInvoice.customerName}
                  onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})}
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
                  value={newInvoice.customerEmail}
                  onChange={(e) => setNewInvoice({...newInvoice, customerEmail: e.target.value})}
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
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
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
                    value={newInvoice.quantity}
                    onChange={(e) => setNewInvoice({...newInvoice, quantity: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                   onFocus={(e) => {
                     e.target.select();
                   }}
                   onClick={(e) => {
                     e.target.select();
                   }}
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
                    value={newInvoice.unitPrice}
                    onChange={(e) => setNewInvoice({...newInvoice, unitPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="0.00"
                   onFocus={(e) => {
                     e.target.select();
                   }}
                   onClick={(e) => {
                     e.target.select();
                   }}
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
                      <span className="font-bold text-secondary-charcoal">Total Amount:</span>
                      <span className="text-xl font-bold text-secondary-charcoal">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-secondary-charcoal">Deposit Received:</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newInvoice.depositReceived}
                        onChange={(e) => setNewInvoice({...newInvoice, depositReceived: parseFloat(e.target.value) || 0})}
                        className="w-24 px-2 py-1 border border-secondary-charcoal rounded text-right text-sm font-bold text-secondary-charcoal"
                       onFocus={(e) => {
                         if (e.target.value === '0') {
                           e.target.select();
                         }
                       }}
                      />
                       onFocus={(e) => {
                         if (e.target.value === '0') {
                           e.target.select();
                         }
                       }}
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
                  Create Invoice
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
    </div>
  );
}