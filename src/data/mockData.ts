import { Client, Quote, Invoice } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
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
    lastOrderDate: '2025-01-15',
    status: 'active',
    notes: 'Prefers premium materials. Always pays on time.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'wedding@smithfamily.com',
    phone: '(555) 234-5678',
    company: 'Smith Family',
    address: '456 Oak Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    totalOrders: 2,
    totalSpent: 1850,
    lastOrderDate: '2025-01-16',
    status: 'active',
    notes: 'Wedding client. Referred by previous customer.'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'info@localrestaurant.com',
    phone: '(555) 345-6789',
    company: 'Local Restaurant',
    address: '789 Main Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    totalOrders: 12,
    totalSpent: 3200,
    lastOrderDate: '2025-01-17',
    status: 'active',
    notes: 'Regular customer. Orders marketing materials monthly.'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'admin@financeltd.com',
    phone: '(555) 456-7890',
    company: 'Finance Ltd',
    address: '321 Corporate Blvd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    totalOrders: 4,
    totalSpent: 6800,
    lastOrderDate: '2025-01-18',
    status: 'active',
    notes: 'Corporate client. Large orders for annual reports.'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'orders@cafedelight.com',
    phone: '(555) 567-8901',
    company: 'Café Delight',
    address: '654 Coffee Lane',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    totalOrders: 6,
    totalSpent: 1450,
    lastOrderDate: '2025-01-19',
    status: 'active',
    notes: 'Small business owner. Seasonal menu updates.'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa@startup.com',
    phone: '(555) 678-9012',
    company: 'Startup Inc',
    address: '987 Innovation Dr',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: '',
    status: 'prospect',
    notes: 'Potential client. Requested quote for business cards.'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'Q001',
    clientId: '2',
    customer: 'Juan Martinez',
    description: '50 Shirts, 2 colors front, 1 back',
    amount: 750,
    status: 'pending',
    createdDate: '2025-01-10',
    expiryDate: '2025-02-10',
    items: [
      { id: '1', description: '50 Shirts - 2 colors front, 1 back', quantity: 50, unitPrice: 15.00, total: 750 }
    ]
  },
  {
    id: '2',
    number: 'Q002',
    clientId: '1',
    customer: 'ABC Corp',
    description: '25 Hoodies, Logo front',
    amount: 625,
    status: 'approved',
    createdDate: '2025-01-12',
    expiryDate: '2025-02-12',
    items: [
      { id: '1', description: '25 Hoodies - Logo front', quantity: 25, unitPrice: 25.00, total: 625 }
    ]
  },
  {
    id: '3',
    number: 'Q003',
    clientId: '3',
    customer: 'Local School',
    description: '100 Uniforms, Custom design',
    amount: 1200,
    status: 'draft',
    createdDate: '2025-01-14',
    expiryDate: '2025-02-14',
    items: [
      { id: '1', description: '100 Uniforms - Custom design', quantity: 100, unitPrice: 12.00, total: 1200 }
    ]
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV001',
    clientId: '1',
    quoteId: '2',
    customer: 'ABC Corp',
    email: 'contact@abccorp.com',
    description: '25 Hoodies, Logo front',
    amount: 696.88,
    paidAmount: 300,
    status: 'partial',
    issueDate: '2025-07-01',
    dueDate: '2025-07-15',
    items: [
      { id: '1', description: '25 Hoodies - Logo front', quantity: 25, unitPrice: 25.00, total: 625 }
    ]
  },
  {
    id: '2',
    number: 'INV002',
    clientId: '3',
    customer: 'Maria Restaurant',
    email: 'maria@restaurant.com',
    description: '50 Shirts, 2 colors front, 1 back',
    amount: 501.75,
    paidAmount: 501.75,
    status: 'paid',
    issueDate: '2025-07-02',
    dueDate: '2025-07-16',
    paymentDate: '2025-07-10',
    items: [
      { id: '1', description: '50 Shirts - 2 colors front, 1 back', quantity: 50, unitPrice: 9.00, total: 450 }
    ]
  },
  {
    id: '3',
    number: 'INV003',
    clientId: '4',
    customer: 'Tech Startup',
    email: 'orders@techstartup.com',
    description: '75 Polo Shirts, Custom embroidery',
    amount: 992.35,
    paidAmount: 992.35,
    status: 'paid',
    issueDate: '2025-07-03',
    dueDate: '2025-07-17',
    paymentDate: '2025-07-12',
    items: [
      { id: '1', description: '75 Polo Shirts - Custom embroidery', quantity: 75, unitPrice: 11.87, total: 890 }
    ]
  }
];

// Helper functions to get related data
export const getClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id);
};

export const getQuotesByClientId = (clientId: string): Quote[] => {
  return mockQuotes.filter(quote => quote.clientId === clientId);
};

export const getInvoicesByClientId = (clientId: string): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.clientId === clientId);
};

export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.id === id);
};

export const getInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find(invoice => invoice.id === id);
};

export const getInvoiceByQuoteId = (quoteId: string): Invoice | undefined => {
  return mockInvoices.find(invoice => invoice.quoteId === quoteId);
}