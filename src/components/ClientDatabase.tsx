// src/components/ClientDatabase.tsx - COPY THIS ENTIRE CODE

import React, { useState } from 'react';
import { 
  Plus, Mail, Edit, Eye, User, Phone, Building, MapPin, 
  Save, X, FileText, Search, Filter 
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'prospect';
  notes: string;
}

interface ClientDatabaseProps {
  onNavigateToQuote?: (quoteId: string, clientId?: string) => void;
  onNavigateToInvoice?: (invoiceId: string, clientId?: string) => void;
  onCreateQuote?: (clientId: string) => void;
}

// Starting data - your first customer
const initialClients: Client[] = [
  {
    id: 'CLI-001',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '(555) 123-4567',
    company: 'Tech Corp',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    totalOrders: 8,
    totalSpent: 4250,
    lastOrderDate: '1/14/2025',
    status: 'active',
    notes: 'Prefers premium materials. Always pays on time.'
  },
];

export const ClientDatabase: React.FC<ClientDatabaseProps> = ({
  onNavigateToQuote,
  onNavigateToInvoice,
  onCreateQuote
}) => {
  // These are like variables that remember things
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  
  // For adding new customers
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    status: 'prospect'
  });

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [emailTemplate, setEmailTemplate] = useState('followup');

  // SEARCH AND FILTER LOGIC
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All Status' || client.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // FUNCTION: Add a new customer
  const handleAddClient = () => {
    // Check if required fields are filled
    if (!newClient.name || !newClient.email) {
      alert('Name and email are required');
      return;
    }

    // Create a new customer object
    const client: Client = {
      id: `CLI-${Date.now()}`, // Creates a unique ID using current time
      name: newClient.name!,
      email: newClient.email!,
      phone: newClient.phone || '',
      company: newClient.company || '',
      address: newClient.address || '',
      city: newClient.city || '',
      state: newClient.state || '',
      zipCode: newClient.zipCode || '',
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: '',
      status: newClient.status as 'active' | 'inactive' | 'prospect',
      notes: newClient.notes || ''
    };

    // Add the new client to our list
    setClients(prev => [...prev, client]);
    
    // Close the popup and clear the form
    setShowAddModal(false);
    setNewClient({
      name: '', email: '', phone: '', company: '', address: '', 
      city: '', state: '', zipCode: '', notes: '', status: 'prospect'
    });

    // Show success message
    alert(`✅ Client ${client.name} added successfully!`);
  };

  // FUNCTION: Edit an existing customer
  const handleEditClient = (client: Client) => {
    setEditingClient({ ...client }); // Make a copy of the client data
    setShowEditModal(true); // Show the edit popup
  };

  // FUNCTION: Save changes to a customer
  const handleSaveEdit = () => {
    if (!editingClient) return;

    // Update the client in our list
    setClients(prev => prev.map(c => c.id === editingClient.id ? editingClient : c));
    
    // If this client is currently selected, update that too
    if (selectedClient?.id === editingClient.id) {
      setSelectedClient(editingClient);
    }
    
    // Close popup and clear editing data
    setShowEditModal(false);
    setEditingClient(null);
    alert(`✅ Client ${editingClient.name} updated successfully!`);
  };

  // FUNCTION: Send an email to a customer
  const handleSendEmail = (client: Client) => {
    // Pre-written email templates
    const templates = {
      followup: `Hello ${client.name},\n\nI hope you're doing well. I wanted to follow up on your recent project with us.\n\nIs there anything else we can help you with?\n\nBest regards,\nBT Printshop`,
      quote: `Hello ${client.name},\n\nWould you be interested in a new quote? We have excellent offers this month.\n\nContact us for more details.\n\nBest regards,\nBT Printshop`,
      thanks: `Hello ${client.name},\n\nThank you for trusting BT Printshop! It has been a pleasure working with you.\n\nWe hope to see you soon for your next project.\n\nBest regards,\nThe BT Team`
    };

    // Get the email text based on selected template
    const emailBody = templates[emailTemplate as keyof typeof templates];
    
    // Create a mailto link (opens default email app)
    const mailtoLink = `mailto:${client.email}?subject=Follow-up - ${client.name} - BT Printshop&body=${encodeURIComponent(emailBody)}`;
    
    // Open email app
    window.open(mailtoLink);
    setShowEmailModal(false);
    alert(`📧 Email prepared for ${client.name}!\nYour email app will open.`);
  };

  // FUNCTION: Create a new quote for this customer
  const handleCreateQuote = (clientId: string) => {
    if (onCreateQuote) {
      onCreateQuote(clientId);
    } else {
      alert(`📝 Creating new quote for client.\nNavigating to quotes section...`);
    }
  };

  // FUNCTION: View all records for a customer
  const handleViewAllRecords = (client: Client) => {
    alert(`📊 View all records for ${client.name}:\n\n• Total orders: ${client.totalOrders}\n• Total spent: $${client.totalSpent}\n• Last order: ${client.lastOrderDate || 'N/A'}\n• Status: ${client.status}\n\n(This will open a detailed modal)`);
  };

  // FUNCTION: Get color for status badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="bg-secondary-charcoal text-white p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Client Database</h1>
            <p className="text-gray-300 mt-1">
              Viewing client: {selectedClient ? selectedClient.name : 'All Clients'}
            </p>
            <p className="text-gray-400 text-sm">Manage customer information and relationships</p>
          </div>
          
          {/* ADD CLIENT BUTTON - NOW WORKING! */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-primary-teal-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* CLIENT DIRECTORY */}
      <div className="bg-primary-teal-light p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-secondary-charcoal mb-4">Client Directory</h2>
        
        {/* SEARCH AND FILTERS */}
        <div className="flex gap-4 mb-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, email, company, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal appearance-none bg-white"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Prospect</option>
            </select>
          </div>
        </div>

        {/* CLIENT TABLE */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="bg-secondary-charcoal text-white px-6 py-4">
            <div className="grid grid-cols-6 gap-4 font-medium">
              <div>CLIENT INFO</div>
              <div>CONTACT</div>
              <div>LOCATION</div>
              <div>ORDER HISTORY</div>
              <div>STATUS</div>
              <div>ACTIONS</div>
            </div>
          </div>

          {/* Table Body - List of Clients */}
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <div key={client.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-6 gap-4 items-center">
                  {/* CLIENT INFO */}
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.company}</p>
                  </div>

                  {/* CONTACT */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-primary-teal">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  </div>

                  {/* LOCATION */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{client.city}, {client.state}</span>
                  </div>

                  {/* ORDER HISTORY */}
                  <div>
                    <div className="text-sm font-medium">{client.totalOrders} orders</div>
                    <div className="text-lg font-bold text-primary-teal">${client.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Last: {client.lastOrderDate || 'N/A'}</div>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </div>

                  {/* ACTIONS - NOW WORKING! */}
                  <div className="flex gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="p-2 text-gray-400 hover:text-primary-teal hover:bg-gray-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {/* Email Button - NOW WORKING! */}
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowEmailModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    
                    {/* Edit Button - NOW WORKING! */}
                    <button
                      onClick={() => handleEditClient(client)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Edit Client"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results Message */}
        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No clients found matching your search.
          </div>
        )}
      </div>

      {/* CLIENT PROFILE POPUP */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="bg-primary-teal text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                  <p className="text-primary-teal-light">Client Profile & Order History</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Contact Information */}
                <div className="bg-primary-teal-light p-4 rounded-lg">
                  <h3 className="font-semibold text-secondary-charcoal mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    {selectedClient.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-600" />
                        <span>{selectedClient.company}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                      <div>
                        <div>{selectedClient.address}</div>
                        <div>{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                      <div className="text-2xl font-bold">{selectedClient.totalOrders}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                      <div className="text-2xl font-bold text-primary-teal">${selectedClient.totalSpent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Avg Order Value</div>
                      <div className="text-2xl font-bold text-primary-teal">
                        ${selectedClient.totalOrders > 0 ? Math.round(selectedClient.totalSpent / selectedClient.totalOrders) : 0}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600">Last Order</div>
                      <div className="font-medium">{selectedClient.lastOrderDate || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-charcoal mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedClient.notes}</p>
                  </div>
                </div>
              )}

              {/* Sample Records */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-primary-teal-light p-4 rounded-lg">
                  <h3 className="font-semibold text-secondary-charcoal mb-3">Quotes (1)</h3>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium">Q002 - $625</div>
                    <div className="text-sm text-gray-600">25 Hoodies, Logo front</div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-secondary-charcoal mb-3">Invoices (1)</h3>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium">INV001 - $696.88</div>
                    <div className="text-sm text-gray-600">partial - 25 Hoodies, Logo front</div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS - NOW WORKING! */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditClient(selectedClient)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-primary-teal-dark transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Client
                </button>

                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-charcoal text-white rounded-md hover:bg-secondary-charcoal-light transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>

                <button
                  onClick={() => handleCreateQuote(selectedClient.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Create Quote
                </button>

                <button
                  onClick={() => handleViewAllRecords(selectedClient)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View All Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CLIENT POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">➕ Add New Client</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="john@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="Tech Corp"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={newClient.address}
                  onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={newClient.city}
                  onChange={(e) => setNewClient(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="San Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={newClient.state}
                  onChange={(e) => setNewClient(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="PR"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border rounded-md h-20 focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  placeholder="Special preferences, notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClient}
                className="flex-1 bg-primary-teal text-white py-2 rounded-md hover:bg-primary-teal-dark transition-colors"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CLIENT POPUP */}
      {showEditModal && editingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh