import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Eye, Edit, Mail, Phone, MapPin, Building2, Calendar, DollarSign, Package, FileText, X } from 'lucide-react';
import { mockClients, getQuotesByClientId, getInvoicesByClientId } from '../data/mockData';
import { Client, Quote, Invoice } from '../types';
import { StatusBadge } from './shared';
import QuotesList from './QuotesList';

interface ClientDatabaseProps {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  selectedClient: Client | null;
  showModal: boolean;
  onUpdateClient: (clientId: string, updates: Partial<Client>) => void;
  onAddClient: (client: Client) => void;
  onAddQuote: (quote: Quote) => void;
  onOpenModal: (modalType: string, item?: any) => void;
  onCloseModal: (modalType: string) => void;
  selectedClientId?: string;
  onNavigateToQuote: (quoteId: string) => void;
  onNavigateToInvoice: (invoiceId: string) => void;
  onClearSelection: () => void;
}

export default function ClientDatabase({ 
  clients, 
  quotes, 
  invoices, 
  selectedClient, 
  showModal, 
  onUpdateClient, 
  onAddClient, 
  onAddQuote,
  onOpenModal, 
  onCloseModal,
  selectedClientId,
  onNavigateToQuote,
  onNavigateToInvoice,
  onClearSelection
}: ClientDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedClientForEmail, setSelectedClientForEmail] = useState<Client | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedClientForQuote, setSelectedClientForQuote] = useState<Client | null>(null);
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });
 const [editClient, setEditClient] = useState({
   name: '',
   email: '',
   phone: '',
   company: '',
   address: '',
   city: '',
   state: '',
   zipCode: '',
   notes: ''
 });
  const [newQuote, setNewQuote] = useState({
    customerName: '',
    customerEmail: '',
    description: '',
    quantity: '',
    unitPrice: '',
    notes: ''
  });

  const filteredClients = clients.filter(client => {
    // If we have a selected client, prioritize it
    if (selectedClientId && client.id === selectedClientId) {
      return true;
    }
    
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClientClick = (client: Client) => {
    onOpenModal('client', client);
  };

  const handleCreateClient = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: ''
    });
    setShowCreateModal(true);
  };

 const handleEditClient = (client: Client) => {
   setEditingClient(client);
   setEditClient({
     name: client.name,
     email: client.email,
     phone: client.phone,
     company: client.company || '',
     address: client.address,
     city: client.city,
     state: client.state,
     zipCode: client.zipCode,
     notes: client.notes
   });
   setShowEditModal(true);
 };
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        company: newClient.company,
        address: newClient.address,
        city: newClient.city,
        state: newClient.state,
        zipCode: newClient.zipCode,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: '',
        status: 'prospect',
        notes: newClient.notes
      };
      onAddClient(client);
      setShowCreateModal(false);
      alert(`Client ${newClient.name} created successfully!`);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: ''
    });
  };

  const handleEmailClient = (client: Client) => {
    setSelectedClientForEmail(client);
    setEmailForm({
      to: client.email,
      subject: `Follow up - ${client.company || client.name}`,
      message: `Hi ${client.name},\n\nI hope this email finds you well. I wanted to follow up regarding your printing needs.\n\nPlease let me know if you have any upcoming projects or questions.\n\nBest regards,\nBT Printshop`
    });
    setShowEmailModal(true);
  };

 const handleEditSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   if (editingClient && editClient.name && editClient.email) {
     const updatedClient: Partial<Client> = {
       name: editClient.name,
       email: editClient.email,
       phone: editClient.phone,
       company: editClient.company,
       address: editClient.address,
       city: editClient.city,
       state: editClient.state,
       zipCode: editClient.zipCode,
       notes: editClient.notes
     };
     onUpdateClient(editingClient.id, updatedClient);
     setShowEditModal(false);
     alert(`Client ${editClient.name} updated successfully!`);
   }
 };

 const closeEditModal = () => {
   setShowEditModal(false);
   setEditingClient(null);
   setEditClient({
     name: '',
     email: '',
     phone: '',
     company: '',
     address: '',
     city: '',
     state: '',
     zipCode: '',
     notes: ''
   });
 };

  const handleCreateQuote = (client: Client) => {
    setSelectedClientForQuote(client);
    setShowQuoteModal(true);
  };

  const handleCloseQuoteModal = () => {
    setShowQuoteModal(false);
    setSelectedClientForQuote(null);
  };

  const handleCreateQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuote.customerName && newQuote.customerEmail && newQuote.description) {
      const quote: Quote = {
        id: Date.now().toString(),
        number: `Q${String(quotes.length + 1).padStart(3, '0')}`,
        clientId: selectedClient?.id || '',
        customer: newQuote.customerName,
        description: newQuote.description,
        amount: parseFloat(calculateTotal()),
        status: 'draft',
        archived: false,
        createdDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        items: [{
          id: '1',
          description: newQuote.description,
          quantity: parseFloat(newQuote.quantity) || 1,
          unitPrice: parseFloat(newQuote.unitPrice) || 0,
          total: parseFloat(calculateSubtotal())
        }]
      };
      
      onAddQuote(quote);
      setShowCreateQuoteModal(false);
      alert(`Quote ${quote.number} created successfully for ${newQuote.customerName}!`);
    }
  };

  const closeCreateQuoteModal = () => {
    setShowCreateQuoteModal(false);
    setNewQuote({
      customerName: '',
      customerEmail: '',
      description: '',
      quantity: '',
      unitPrice: '',
      notes: ''
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailForm.to && emailForm.subject && emailForm.message) {
      // Create mailto link with form data
      const subject = encodeURIComponent(emailForm.subject);
      const body = encodeURIComponent(emailForm.message);
      const mailtoLink = `mailto:${emailForm.to}?subject=${subject}&body=${body}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');
      
      // Close modal and show success message
      setShowEmailModal(false);
      alert(`Email opened for ${selectedClientForEmail?.name}`);
    }
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setSelectedClientForEmail(null);
    setEmailForm({
      to: '',
      subject: '',
      message: ''
    });
  };

  const calculateSubtotal = () => {
    const quantity = parseFloat(newQuote.quantity) || 0;
    const unitPrice = parseFloat(newQuote.unitPrice) || 0;
    return (quantity * unitPrice).toFixed(2);
  };

  const calculateTax = () => {
    const quantity = parseFloat(newQuote.quantity) || 0;
    const unitPrice = parseFloat(newQuote.unitPrice) || 0;
    const subtotal = quantity * unitPrice;
    return (subtotal * 0.115).toFixed(2);
  };

  const calculateTotal = () => {
    const quantity = parseFloat(newQuote.quantity) || 0;
    const unitPrice = parseFloat(newQuote.unitPrice) || 0;
    const subtotal = quantity * unitPrice;
    const tax = subtotal * 0.115;
    return (subtotal + tax).toFixed(2);
  };

  const selectedClientData = selectedClientId ? clients.find(c => c.id === selectedClientId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary-charcoal rounded-lg p-8 text-neutral-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Client Database</h1>
            {selectedClientData && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-neutral-white opacity-90 text-lg">Viewing client:</span>
                <span className="bg-neutral-white text-secondary-charcoal px-3 py-1 rounded-full font-semibold">{selectedClientData.name}</span>
                <button onClick={onClearSelection} className="text-neutral-white opacity-75 hover:opacity-100 text-sm underline">
                  View All Clients
                </button>
              </div>
            )}
            <p className="text-neutral-white opacity-90 text-lg">Manage customer relationships and contact information</p>
          </div>
          <button 
            onClick={handleCreateClient}
            className="bg-primary-teal text-neutral-white px-6 py-3 rounded-lg hover:bg-primary-teal-dark transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>New Client</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
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
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospects</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-neutral-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-neutral-bg-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-charcoal uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-charcoal uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-charcoal uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-charcoal uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-neutral-bg-light cursor-pointer transition-colors" onClick={() => handleClientClick(client)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-teal flex items-center justify-center">
                          <span className="text-sm font-medium text-neutral-white">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-charcoal">{client.name}</div>
                        {client.company && (
                          <div className="text-sm text-neutral-gray-medium flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {client.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-charcoal">
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 mr-2 text-neutral-gray-medium" />
                        {client.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2 text-neutral-gray-medium" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-charcoal">
                      <div className="flex items-center mb-1">
                        <Package className="h-3 w-3 mr-2 text-neutral-gray-medium" />
                        {client.totalOrders} orders
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-2 text-neutral-gray-medium" />
                        ${client.totalSpent.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEmailClient(client)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                     <button 
                       onClick={() => handleEditClient(client)}
                       className="text-secondary-charcoal hover:text-secondary-charcoal-light transition-colors"
                     >
                       <Edit className="h-4 w-4" />
                     </button>
                      <button 
                        onClick={() => handleCreateQuote(client)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-charcoal mb-2">No clients found</h3>
          <p className="text-neutral-gray-medium">No clients match your current search criteria.</p>
        </div>
      )}

      {/* Client Details Modal */}
      {showModal && selectedClient && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => onCloseModal('client')}
        >
          <div 
            className="bg-neutral-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-neutral-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedClient.name}</h3>
                  {selectedClient.company && (
                    <p className="text-primary-teal-light flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      {selectedClient.company}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => onCloseModal('client')}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-teal-accent rounded-lg p-4">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-secondary-charcoal">
                    <div><span className="font-semibold">Email:</span> {selectedClient.email}</div>
                    <div><span className="font-semibold">Phone:</span> {selectedClient.phone}</div>
                    {selectedClient.company && (
                      <div><span className="font-semibold">Company:</span> {selectedClient.company}</div>
                    )}
                  </div>
                </div>
                
                <div className="bg-neutral-bg-light rounded-lg p-4">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address
                  </h4>
                  <div className="text-secondary-charcoal">
                    <div>{selectedClient.address}</div>
                    <div>{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</div>
                  </div>
                </div>
              </div>

              {/* Business Summary */}
              <div className="bg-secondary-charcoal rounded-lg p-6 text-neutral-white">
                <h4 className="text-xl font-bold mb-4">Business Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-teal">{selectedClient.totalOrders}</div>
                    <div className="text-neutral-white opacity-90">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-teal">${selectedClient.totalSpent.toLocaleString()}</div>
                    <div className="text-neutral-white opacity-90">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-teal">
                      {selectedClient.lastOrderDate ? new Date(selectedClient.lastOrderDate).toLocaleDateString() : 'Never'}
                    </div>
                    <div className="text-neutral-white opacity-90">Last Order</div>
                  </div>
                </div>
              </div>

              {/* Related Quotes and Invoices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Quotes */}
                <div className="bg-neutral-white border border-primary-teal-accent rounded-lg p-4">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3">Recent Quotes</h4>
                  <div className="space-y-2">
                    {getQuotesByClientId(selectedClient.id).slice(0, 3).map((quote) => (
                      <div key={quote.id} className="flex justify-between items-center p-2 bg-primary-teal-accent rounded">
                        <div>
                          <div className="font-semibold text-secondary-charcoal">{quote.number}</div>
                          <div className="text-sm text-neutral-gray-medium">{quote.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-secondary-charcoal">${quote.amount}</div>
                          <StatusBadge status={quote.status} />
                        </div>
                      </div>
                    ))}
                    {getQuotesByClientId(selectedClient.id).length === 0 && (
                      <p className="text-neutral-gray-medium text-sm">No quotes found</p>
                    )}
                  </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-neutral-white border border-primary-teal-accent rounded-lg p-4">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3">Recent Invoices</h4>
                  <div className="space-y-2">
                    {getInvoicesByClientId(selectedClient.id).slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="flex justify-between items-center p-2 bg-neutral-bg-light rounded">
                        <div>
                          <div className="font-semibold text-secondary-charcoal">{invoice.number}</div>
                          <div className="text-sm text-neutral-gray-medium">{invoice.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-secondary-charcoal">${invoice.amount}</div>
                          <StatusBadge status={invoice.status} />
                        </div>
                      </div>
                    ))}
                    {getInvoicesByClientId(selectedClient.id).length === 0 && (
                      <p className="text-neutral-gray-medium text-sm">No invoices found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div className="bg-neutral-bg-light rounded-lg p-4 border border-primary-teal-accent">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-3">Notes</h4>
                  <p className="text-secondary-charcoal">{selectedClient.notes}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-primary-teal-accent">
                <button 
                  onClick={() => handleCreateQuote(selectedClient)}
                  className="flex-1 min-w-[120px] bg-primary-teal text-neutral-white py-3 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors font-semibold"
                >
                  Create Quote
                </button>
                <button 
                  onClick={() => onNavigateToQuote('', selectedClient.id)}
                  className="flex-1 min-w-[120px] bg-secondary-charcoal text-neutral-white py-3 px-4 rounded-lg hover:bg-secondary-charcoal-light transition-colors font-semibold"
                >
                  View All Quotes
                </button>
                <button 
                  onClick={() => onNavigateToInvoice('', selectedClient.id)}
                  className="flex-1 min-w-[120px] bg-neutral-gray-medium text-neutral-white py-3 px-4 rounded-lg hover:bg-secondary-charcoal transition-colors font-semibold"
                >
                  View All Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Client Modal */}
      {showEmailModal && selectedClientForEmail && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeEmailModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Send Email</h3>
                  <p className="text-blue-100">Email to {selectedClientForEmail.name}</p>
                </div>
                <button 
                  onClick={closeEmailModal}
                  className="p-2 hover:bg-blue-700 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                  required
                />
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Client Information</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div><span className="font-medium">Name:</span> {selectedClientForEmail.name}</div>
                  {selectedClientForEmail.company && (
                    <div><span className="font-medium">Company:</span> {selectedClientForEmail.company}</div>
                  )}
                  <div><span className="font-medium">Phone:</span> {selectedClientForEmail.phone}</div>
                  <div><span className="font-medium">Total Orders:</span> {selectedClientForEmail.totalOrders}</div>
                  <div><span className="font-medium">Total Spent:</span> ${selectedClientForEmail.totalSpent.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
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
                  <h3 className="text-xl font-bold">Add New Client</h3>
                  <p className="text-primary-teal-light">Create a new client record</p>
                </div>
                <button 
                  onClick={closeCreateModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="client@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Company name (optional)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={newClient.city}
                    onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={newClient.state}
                    onChange={(e) => setNewClient({...newClient, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="State"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  rows={3}
                  placeholder="Any additional notes about this client..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-teal text-white py-2 px-4 rounded-lg hover:bg-primary-teal-dark transition-colors font-medium"
                >
                  Create Client
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

      {/* Edit Client Modal */}
      {showEditModal && editingClient && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeEditModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-secondary-charcoal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Edit Client</h3>
                  <p className="text-neutral-white opacity-90">Update client information</p>
                </div>
                <button 
                  onClick={closeEditModal}
                  className="p-2 hover:bg-secondary-charcoal-light rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editClient.name}
                  onChange={(e) => setEditClient({...editClient, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={editClient.email}
                  onChange={(e) => setEditClient({...editClient, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="client@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editClient.phone}
                  onChange={(e) => setEditClient({...editClient, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editClient.company}
                  onChange={(e) => setEditClient({...editClient, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Company name (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={editClient.address}
                  onChange={(e) => setEditClient({...editClient, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  placeholder="Street address"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={editClient.city}
                    onChange={(e) => setEditClient({...editClient, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={editClient.state}
                    onChange={(e) => setEditClient({...editClient, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={editClient.zipCode}
                    onChange={(e) => setEditClient({...editClient, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="ZIP"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editClient.notes}
                  onChange={(e) => setEditClient({...editClient, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  rows={3}
                  placeholder="Any additional notes about this client..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary-charcoal text-white py-2 px-4 rounded-lg hover:bg-secondary-charcoal-light transition-colors font-medium"
                >
                  Update Client
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showCreateQuoteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeCreateQuoteModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Create Quote</h3>
                  <p className="text-primary-teal-light">New quote for {newQuote.customerName}</p>
                </div>
                <button 
                  onClick={closeCreateQuoteModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateQuoteSubmit} className="p-6 space-y-4">
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={newQuote.quantity}
                    onChange={(e) => setNewQuote({...newQuote, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newQuote.unitPrice}
                    onChange={(e) => setNewQuote({...newQuote, unitPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="Enter price per unit"
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
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newQuote.notes}
                  onChange={(e) => setNewQuote({...newQuote, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                  rows={2}
                  placeholder="Any additional notes for this quote..."
                />
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
                  onClick={closeCreateQuoteModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Creation Modal */}
      {showQuoteModal && selectedClientForQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 bg-primary-teal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Create Quote for {selectedClientForQuote.name}</h3>
                  <p className="text-primary-teal-light">New quote creation</p>
                </div>
                <button 
                  onClick={handleCloseQuoteModal}
                  className="p-2 hover:bg-primary-teal-dark rounded transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={selectedClientForQuote.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={selectedClientForQuote.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    placeholder="Enter price per unit"
                  />
                </div>
              </div>
              
              <div className="bg-primary-teal-accent rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-secondary-charcoal">Subtotal:</span>
                    <span className="text-lg font-bold text-secondary-charcoal"></span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-secondary-charcoal">Tax (11.5%):</span>
                    <span className="text-lg font-bold text-secondary-charcoal"></span>
                  </div>
                  
                  <div className="border-t border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-secondary-charcoal">Quote Amount:</span>
                      <span className="text-xl font-bold text-secondary-charcoal"></span>
                    </div>
                  </div>
                  
                  <div className="border-t border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-secondary-charcoal">Deposit Expected:</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="w-24 px-2 py-1 border border-secondary-charcoal rounded text-right text-sm font-bold text-secondary-charcoal"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-secondary-charcoal pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-secondary-charcoal">Balance Due:</span>
                      <span className="text-2xl font-bold text-secondary-charcoal"></span>
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
                  onClick={handleCloseQuoteModal}
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