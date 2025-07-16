// Shared types for navigation workflow
export interface Client {
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

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  customer: string;
  description: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  archived: boolean;
  archivedDate?: string;
  createdDate: string;
  expiryDate: string;
  items: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  quoteId?: string; // Link to source quote
  customer: string;
  email: string;
  description: string;
  amount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';
  archived: boolean;
  archivedDate?: string;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface NavigationContext {
  activeTab: string;
  selectedClientId?: string;
  selectedQuoteId?: string;
  selectedInvoiceId?: string;
}