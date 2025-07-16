import React, { useState } from 'react';
import { Client, Quote, Invoice } from './types';
import { mockClients, mockQuotes, mockInvoices } from './data/mockData';
import Header from './components/Header';
import Calendar from './components/Calendar';
import QuotesList from './components/QuotesList';
import InvoicesList from './components/InvoicesList';
import ClientDatabase from './components/ClientDatabase';
import FinancialDashboard from './components/FinancialDashboard';
import CommandCenter from './components/CommandCenter';
import { useNavigation } from './hooks/useNavigation';

interface Job {
  id: string;
  title: string;
  client: string;
  description: string;
  date: string;
  status: 'IN_PRODUCTION' | 'READY' | 'URGENT' | 'COMPLETED';
  estimatedHours?: number;
  sizes?: { [key: string]: number };
}

interface ShowModals {
  invoice: boolean;
  quote: boolean;
  client: boolean;
  job: boolean;
}

function App() {
  // State management for all app data
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [customers, setCustomers] = useState<Client[]>(mockClients);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [jobs, setJobs] = useState<Job[]>([
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
    }
  ]);
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const [showModals, setShowModals] = useState<ShowModals>({
    invoice: false,
    quote: false,
    client: false,
    job: false
  });

  // State update functions
  const updateInvoiceStatus = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status: newStatus }
          : invoice
      )
    );
  };

  const updateInvoicePayment = (invoiceId: string, paidAmount: number, paymentDate?: string) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === invoiceId 
          ? { 
              ...invoice, 
              paidAmount,
              paymentDate,
              status: paidAmount >= invoice.amount ? 'paid' : paidAmount > 0 ? 'partial' : invoice.status
            }
          : invoice
      )
    );
  };

  const updateQuoteStatus = (quoteId: string, newStatus: Quote['status']) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: newStatus }
          : quote
      )
    );
  };

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: newStatus }
          : job
      )
    );
  };

  const addNewInvoice = (invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice]);
  };

  const addNewQuote = (quote: Quote) => {
    setQuotes(prev => [...prev, quote]);
  };

  const addNewCustomer = (customer: Client) => {
    setCustomers(prev => [...prev, customer]);
  };

  const openModal = (modalType: keyof ShowModals, item?: any) => {
    setShowModals(prev => ({ ...prev, [modalType]: true }));
    
    switch (modalType) {
      case 'invoice':
        setSelectedInvoice(item);
        break;
      case 'quote':
        setSelectedQuote(item);
        break;
      case 'client':
        setSelectedCustomer(item);
        break;
      case 'job':
        setSelectedJob(item);
        break;
    }
  };

  const closeModal = (modalType: keyof ShowModals) => {
    setShowModals(prev => ({ ...prev, [modalType]: false }));
    
    switch (modalType) {
      case 'invoice':
        setSelectedInvoice(null);
        break;
      case 'quote':
        setSelectedQuote(null);
        break;
      case 'client':
        setSelectedCustomer(null);
        break;
      case 'job':
        setSelectedJob(null);
        break;
    }
  };

  const { context, navigateToTab, navigateToClient, navigateToQuote, navigateToInvoice, createInvoiceFromQuote, createQuoteForClient, clearAllSelections } = useNavigation();

  const renderContent = () => {
    switch (context.activeTab) {
      case 'calendar':
        return (
          <div className="space-y-6">
            <Calendar />
          </div>
        );
      case 'quotes':
        return (
          <div className="space-y-6">
            <QuotesList 
             quotes={quotes}
             customers={customers}
             invoices={invoices}
             selectedQuote={selectedQuote}
             showModal={showModals.quote}
             onUpdateQuoteStatus={updateQuoteStatus}
             onAddQuote={addNewQuote}
             onOpenModal={openModal}
             onCloseModal={closeModal}
              selectedQuoteId={context.selectedQuoteId}
              selectedClientId={context.selectedClientId}
              onNavigateToClient={navigateToClient}
              onNavigateToInvoice={navigateToInvoice}
              onCreateInvoice={createInvoiceFromQuote}
              onClearSelection={clearAllSelections}
            />
          </div>
        );
      case 'invoices':
        return (
          <div className="space-y-6">
            <InvoicesList
              invoices={invoices}
              customers={customers}
              quotes={quotes}
              selectedInvoice={selectedInvoice}
              showModal={showModals.invoice}
              onUpdateInvoiceStatus={updateInvoiceStatus}
              onUpdateInvoicePayment={updateInvoicePayment}
              onOpenModal={openModal}
              onCloseModal={closeModal}
              selectedInvoiceId={context.selectedInvoiceId}
              selectedClientId={context.selectedClientId}
              onNavigateToClient={navigateToClient}
              onNavigateToQuote={navigateToQuote}
              onClearSelection={clearAllSelections}
            />
          </div>
        );
      case 'clients':
        return (
          <div className="space-y-6">
            <ClientDatabase
              clients={customers}
              quotes={quotes}
              invoices={invoices}
              selectedClient={selectedCustomer}
              showModal={showModals.client}
              onUpdateClient={(clientId, updates) => {
                setCustomers(prev => 
                  prev.map(client => 
                    client.id === clientId 
                      ? { ...client, ...updates }
                      : client
                  )
                );
              }}
              onAddClient={addNewCustomer}
              onOpenModal={openModal}
              onCloseModal={closeModal}
              selectedClientId={context.selectedClientId}
              onNavigateToQuote={navigateToQuote}
              onNavigateToInvoice={navigateToInvoice}
              onAddQuote={addNewQuote}
              onClearSelection={clearAllSelections}
            />
          </div>
        );
      case 'financials':
        return (
          <div className="space-y-6">
            <QuotesList
              quotes={quotes}
              customers={customers}
              invoices={invoices}
              selectedQuote={selectedQuote}
              showModal={showModals.quote}
              onUpdateQuoteStatus={updateQuoteStatus}
              onAddQuote={addNewQuote}
              onOpenModal={openModal}
              onCloseModal={closeModal} />
            <FinancialDashboard 
              invoices={invoices}
              quotes={quotes}
              customers={customers}
            />
          </div>
        );
      case 'command':
        return (
          <div className="space-y-6">
            <CommandCenter 
              onAddInvoice={addNewInvoice}
              onAddQuote={addNewQuote}
              onAddCustomer={addNewCustomer}
              onUpdateJobStatus={updateJobStatus}
            />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <Calendar 
              jobs={jobs}
              onUpdateJobStatus={updateJobStatus}
              onOpenJobModal={(job) => openModal('job', job)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg-light">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-neutral-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'calendar', label: 'Calendar' },
              { id: 'quotes', label: 'Quotes' },
              { id: 'invoices', label: 'Invoices' },
              { id: 'clients', label: 'Clients' },
              { id: 'command', label: 'Command Center' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  context.activeTab === tab.id
                    ? 'border-primary-teal text-primary-teal font-semibold' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;