import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Eye, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { mockClients, getQuotesByClientId, getInvoicesByClientId } from '../data/mockData';
import { Client } from '../types';

interface ClientDatabaseProps {
  selectedClientId?: string;
  onNavigateToQuote: (quoteId: string, clientId?: string) => void;
  onNavigateToInvoice: (invoiceId: string, clientId?: string) => void;
  onCreateQuote: (clientId: string) => void;
  onClearSelection: () => void;
}

export default function ClientDatabase({ 
  selectedClientId, 
  onNavigateToQuote, 
  onNavigateToInvoice, 
  onCreateQuote,
  onClearSelection 
}: ClientDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  
  // Auto-open modal if we have a selected client
  React.useEffect(() => {
    if (selectedClientId) {
      const client = mockClients.find(c => c.id === selectedClientId);
      if (client) {
        setSelectedClient(client);
        setShowClientModal(true);
      }
    }
  }, [selectedClientId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return {
          bg: 'bg-primary-teal',
          text: 'text-neutral-white',
          label: 'Active'
        };
      case 'inactive': 
        return {
          bg: 'bg-neutral-gray-light',
          text: 'text-secondary-charcoal',
          label: 'Inactive'
        };
      case 'prospect': 
        return {
          bg: 'bg-primary-teal-accent',
          text: 'text-secondary-charcoal',
          label: 'Prospect'
        };
      default: 
        return {
          bg: 'bg-neutral-gray-light',
          text: 'text-secondary-charcoal',
          label: 'Unknown'
        };
    }
  };

  const filteredClients = mockClients.filter(client => {
    if (selectedClientId && client.id === selectedClientId) {
      return true;
    }
    
    if (selectedClientId && client.id !== selectedClientId) {
      return false;
    }
    
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const closeModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
    if (selectedClientId) {
      onClearSelection();
    }
  };

  const handleAddClient = () => {
    alert('Add Client feature coming soon!');
  };

  const handleEditClient = (client: Client) => {
    alert(`Edit ${client.name} feature coming soon!`);
  };

  const handleSendEmail = (client: Client) => {
    alert(`Send email to ${client.email} feature coming soon!`);
  };

  const selectedClientData = selectedClientId ? mockClients.find(c => c.id === selectedClientId) : null;

  return (
    <>
      <div className="space-y-6">
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
              <p className="text-neutral-white opacity-90 text-lg">Manage customer information and relationships</p>
            </div>
            <button 
              onClick={handleAddClient}
              className="bg-primary-teal text-neutral-white px-6 py-3 rounded-lg hover:bg-primary-teal-dark transition-all flex items-center space-x-2 font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        <div className="bg-neutral-white rounded-lg shadow-lg border border-primary-teal-accent">
          <div className="p-6 border-b border-primary-teal-accent bg-primary-teal-accent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-secondary-charcoal">Client Directory</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-charcoal-light" />
                <input
                  type="text"
                  placeholder="Search clients by name, email, company, or phone..."
                  className="w-full pl-10 pr-4 py-3 border border-primary-teal rounded-lg focus:ring-2 focus:ring-primary-teal-dark focus:border-transparent bg-neutral-white text-secondary-charcoal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-secondary-charcoal-light" />
                <select
                  className="border border-primary-teal rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-teal-dark focus:border-transparent bg-neutral-white text-secondary-charcoal"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-charcoal text-neutral-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Client Info</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Order History</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-teal-accent">
                {filteredClients.map((client, index) => (
                  <tr key={client.id} className={`hover:bg-primary-teal-accent transition-all cursor-pointer ${index % 2 === 0 ? 'bg-neutral-white' : 'bg-neutral-bg-light'}`} onClick={() => handleClientClick(client)}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-lg font-bold text-secondary-charcoal">{client.name}</div>
                        {client.company && (
                          <div className="text-neutral-gray-medium font-semibold">{client.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-secondary-charcoal">
                          <Mail className="h-4 w-4 mr-3 text-primary-teal" />
                          <span className="font-medium">{client.email}</span>
                        </div>
                        <div className="flex items-center text-neutral-gray-medium">
                          <Phone className="h-4 w-4 mr-3 text-primary-teal" />
                          <span className="font-medium">{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-secondary-charcoal">
                        <MapPin className="h-4 w-4 mr-3 text-primary-teal mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">{client.city}, {client.state}</div>
                          <div className="text-neutral-gray-medium">{client.zipCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-lg font-bold text-secondary-charcoal">{client.totalOrders} orders</div>
                        <div className="text-lg font-bold text-primary-teal-dark">${client.totalSpent.toLocaleString()}</div>
                        {client.lastOrderDate && (
                          <div className="text-sm text-neutral-gray-medium">
                            Last: {new Date(client.lastOrderDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-lg ${getStatusConfig(client.status).bg} ${getStatusConfig(client.status).text}`}>
                        {getStatusConfig(client.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 hover:bg-primary-teal hover:text-neutral-white rounded-lg transition-all"
                          title="View Details"
                          onClick={() => handleClientClick(client)}
                        >
                          <Eye className="h-5 w-5 text-primary-teal-dark" />
                        </button>
                        <button 
                          className="p-2 hover:bg-secondary-charcoal-light hover:text-neutral-white rounded-lg transition-all"
                          title="Send Email"
                          onClick={() => handleSendEmail(client)}
                        >
                          <Mail className="h-5 w-5 text-secondary-charcoal" />
                        </button>
                        <button 
                          className="p-2 hover:bg-primary-teal-accent rounded-lg transition-all"
                          title="Edit Client"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="h-5 w-5 text-secondary-charcoal" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-neutral-gray-medium mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-charcoal mb-2">No clients found</h3>
              <p className="text-neutral-gray-medium">No clients match your current search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {showClientModal && selectedClient && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-neutral-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-primary-teal-accent bg-primary-teal text-neutral-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedClient.name}</h3>
                  <p className="text-neutral-white opacity-90">Client Profile & Order History</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-primary-teal-dark rounded-lg transition-all duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-teal-accent rounded-lg p-6 space-y-4">
                  <div>
                    <label className="text-sm font-bold text-secondary-charcoal opacity-80">Contact Information</label>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-3 text-primary-teal-dark" />
                        <span className="text-secondary-charcoal font-semibold">{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-primary-teal-dark" />
                        <span className="text-secondary-charcoal font-semibold">{selectedClient.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedClient.company && (
                    <div>
                      <label className="text-sm font-bold text-secondary-charcoal opacity-80">Company</label>
                      <p className="text-xl font-bold text-secondary-charcoal">{selectedClient.company}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-bold text-secondary-charcoal opacity-80">Address</label>
                    <div className="mt-2 text-secondary-charcoal font-semibold">
                      <div>{selectedClient.address}</div>
                      <div>{selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-gray-light rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-secondary-charcoal opacity-80">Status</label>
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-lg ${getStatusConfig(selectedClient.status).bg} ${getStatusConfig(selectedClient.status).text}`}>
                        {getStatusConfig(selectedClient.status).label}
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-secondary-charcoal opacity-80">Total Orders</label>
                      <p className="text-3xl font-bold text-secondary-charcoal">{selectedClient.totalOrders}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-secondary-charcoal opacity-80">Total Spent</label>
                      <p className="text-3xl font-bold text-primary-teal-dark">${selectedClient.totalSpent.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-secondary-charcoal opacity-80">Avg Order Value</label>
                      <p className="text-2xl font-bold text-primary-teal">
                        ${selectedClient.totalOrders > 0 ? (selectedClient.totalSpent / selectedClient.totalOrders).toFixed(0) : '0'}
                      </p>
                    </div>
                  </div>
                  
                  {selectedClient.lastOrderDate && (
                    <div>
                      <label className="text-sm font-bold text-secondary-charcoal opacity-80">Last Order</label>
                      <p className="text-lg font-bold text-secondary-charcoal">{new Date(selectedClient.lastOrderDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedClient.notes && (
                <div className="bg-neutral-bg-light rounded-lg p-6 border border-primary-teal-accent">
                  <label className="text-lg font-bold text-secondary-charcoal">Notes</label>
                  <p className="mt-3 text-secondary-charcoal font-medium">{selectedClient.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-teal-accent rounded-lg p-6">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-4">Quotes ({getQuotesByClientId(selectedClient.id).length})</h4>
                  <div className="space-y-2">
                    {getQuotesByClientId(selectedClient.id).slice(0, 3).map((quote) => (
                      <button
                        key={quote.id}
                        onClick={() => onNavigateToQuote(quote.id, selectedClient.id)}
                        className="w-full text-left p-3 bg-neutral-white rounded-lg hover:bg-primary-teal hover:text-neutral-white transition-all"
                      >
                        <div className="font-semibold">{quote.number} - ${quote.amount}</div>
                        <div className="text-sm opacity-75">{quote.description}</div>
                      </button>
                    ))}
                    {getQuotesByClientId(selectedClient.id).length === 0 && (
                      <p className="text-secondary-charcoal opacity-75">No quotes yet</p>
                    )}
                  </div>
                </div>

                <div className="bg-neutral-gray-light rounded-lg p-6">
                  <h4 className="text-lg font-bold text-secondary-charcoal mb-4">Invoices ({getInvoicesByClientId(selectedClient.id).length})</h4>
                  <div className="space-y-2">
                    {getInvoicesByClientId(selectedClient.id).slice(0, 3).map((invoice) => (
                      <button
                        key={invoice.id}
                        onClick={() => onNavigateToInvoice(invoice.id, selectedClient.id)}
                        className="w-full text-left p-3 bg-neutral-white rounded-lg hover:bg-secondary-charcoal hover:text-neutral-white transition-all"
                      >
                        <div className="font-semibold">{invoice.number} - ${invoice.amount}</div>
                        <div className="text-sm opacity-75">{invoice.status} - {invoice.description}</div>
                      </button>
                    ))}
                    {getInvoicesByClientId(selectedClient.id).length === 0 && (
                      <p className="text-secondary-charcoal opacity-75">No invoices yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4 border-t border-primary-teal-accent">
                <button 
                  onClick={() => handleEditClient(selectedClient)}
                  className="flex-1 min-w-[120px] bg-primary-teal text-neutral-white py-3 px-4 rounded-lg hover:bg-primary-teal-dark transition-all flex items-center justify-center space-x-2 font-semibold"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Client</span>
                </button>
                <button 
                  onClick={() => handleSendEmail(selectedClient)}
                  className="flex-1 min-w-[120px] bg-secondary-charcoal-light text-neutral-white py-3 px-4 rounded-lg hover:bg-secondary-charcoal-dark transition-all flex items-center justify-center space-x-2 font-semibold"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
                <button 
                  onClick={() => onCreateQuote(selectedClient.id)}
                  className="flex-1 min-w-[120px] bg-primary-teal-accent text-secondary-charcoal py-3 px-4 rounded-lg hover:bg-primary-teal hover:text-neutral-white transition-all font-semibold"
                >
                  Create Quote
                </button>
                <button 
                  onClick={() => alert('View All Records feature coming soon!')}
                  className="flex-1 min-w-[120px] bg-neutral-gray-light text-secondary-charcoal py-3 px-4 rounded-lg hover:bg-secondary-charcoal-light hover:text-neutral-white transition-all font-semibold"
                >
                  View All Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}