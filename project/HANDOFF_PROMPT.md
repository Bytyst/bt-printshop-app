# Printshop Business Dashboard - Project Handoff

## Project Overview
This is a comprehensive printshop business management dashboard built with React, TypeScript, and Tailwind CSS. The application manages the complete workflow from quotes to invoices to client relationships for a print shop business.

## Technology Stack
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS with custom color palette
- **Icons:** Lucide React
- **Build Tool:** Vite
- **State Management:** React useState hooks

## Application Structure

### Main Sections
1. **Calendar** - Production scheduling and job management
2. **Quotes** - Quote creation and management
3. **Invoices** - Invoice tracking and payment management
4. **Clients** - Customer database and relationship management
5. **Command Center** - Telegram integration for workflow automation

### Color Palette
```css
primary: {
  teal: '#4ECDC4',
  'teal-light': '#A8E6CF',
  'teal-dark': '#2E8B8B',
  'teal-accent': '#A8E6CF',
},
secondary: {
  charcoal: '#2C3E50',
  'charcoal-light': '#34495E',
  'charcoal-dark': '#1A252F',
},
neutral: {
  'gray-light': '#BDC3C7',
  'gray-medium': '#95A5A6',
  'gray-dark': '#7F8C8D',
  white: '#FFFFFF',
  'bg-light': '#F8FFFE',
}
```

## Key Components

### 1. Calendar Component (`src/components/Calendar.tsx`)
- **Features:** Drag-and-drop job scheduling, status management, size breakdown editing
- **Job Statuses:** IN_PRODUCTION, READY, URGENT, COMPLETED
- **Functionality:** 
  - Monthly view with job cards
  - Editable job details (description, dates, sizes)
  - Status change modals
  - Size quantity management with dynamic add/remove

### 2. Quotes Management (`src/components/QuotesList.tsx`)
- **Features:** Quote creation, status tracking, archive functionality
- **Quote Statuses:** draft, pending, approved, rejected, expired
- **Current Functionality:**
  - View/edit quote details
  - Create new quotes with tax calculation (11.5%)
  - Archive/restore quotes
  - Navigate to related clients
- **Buttons Needing Functionality:**
  - "Create Invoice" from approved quotes
  - "Send Quote" functionality

### 3. Invoice Management (`src/components/InvoicesList.tsx`)
- **Features:** Invoice tracking, payment management, client relationships
- **Invoice Statuses:** draft, sent, paid, overdue, partial
- **Current Functionality:**
  - View invoice details
  - Create new invoices with tax calculation
  - Navigate to related clients
- **Buttons Needing Functionality:**
  - "Record Payment" button (should update payment status and amounts)
  - "Send Reminder" button (should handle payment reminders)

### 4. Client Database (`src/components/ClientDatabase.tsx`)
- **Features:** Complete customer relationship management
- **Client Statuses:** active, inactive, prospect
- **Functionality:**
  - Client profile management
  - Order history tracking
  - Related quotes and invoices
  - Contact information management

### 5. Financial Dashboard (`src/components/FinancialDashboard.tsx`)
- **Features:** Revenue tracking, expense breakdown, profit analysis
- **Functionality:**
  - Monthly performance charts
  - Expense categorization
  - KPI cards with trend indicators

## Data Models

### Client Interface
```typescript
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
```

### Quote Interface
```typescript
interface Quote {
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
```

### Invoice Interface
```typescript
interface Invoice {
  id: string;
  number: string;
  clientId: string;
  quoteId?: string;
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
```

## Navigation System
- **Hook:** `useNavigation()` in `src/hooks/useNavigation.ts`
- **Features:** Cross-component navigation with context preservation
- **Functions:**
  - `navigateToClient(clientId)` - Navigate to specific client
  - `navigateToQuote(quoteId, clientId?)` - Navigate to specific quote
  - `navigateToInvoice(invoiceId, clientId?)` - Navigate to specific invoice
  - `createInvoiceFromQuote(quoteId)` - Convert quote to invoice

## Outstanding Tasks

### 1. Archive Functionality
**Need to add archive buttons and functionality for:**
- Invoices (for paid/partial status invoices)
- Quotes (for expired/rejected quotes)
- Should include confirmation modals
- Archive/restore toggle functionality

### 2. Missing Button Functionality

#### Invoice Buttons:
- **"Record Payment"** - Should open modal to:
  - Enter payment amount
  - Update invoice status (paid/partial)
  - Set payment date
  - Calculate remaining balance

- **"Send Reminder"** - Should handle:
  - Email reminder functionality
  - Update last reminder date
  - Show confirmation message

#### Quote Buttons:
- **"Create Invoice"** from approved quotes - Should:
  - Convert quote data to invoice format
  - Pre-populate invoice form
  - Link invoice to original quote
  - Navigate to new invoice

### 3. Enhanced Features to Consider
- Email integration for reminders and invoices
- PDF generation for quotes/invoices
- Payment tracking and reporting
- Advanced filtering and search
- Bulk operations for archives

## File Structure
```
src/
├── components/
│   ├── Calendar.tsx
│   ├── QuotesList.tsx
│   ├── InvoicesList.tsx
│   ├── ClientDatabase.tsx
│   ├── FinancialDashboard.tsx
│   ├── CommandCenter.tsx
│   ├── Header.tsx
│   └── shared/
│       ├── StatusBadge.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── StatsCard.tsx
├── data/
│   └── mockData.ts
├── hooks/
│   └── useNavigation.ts
├── types/
│   └── index.ts
└── App.tsx
```

## Current State
The application is fully functional with a professional design and comprehensive feature set. The main areas needing completion are the archive functionality and the specific button actions mentioned above. All components are well-structured and follow consistent patterns for easy extension.

## Design Philosophy
- Clean, professional interface suitable for business use
- Consistent color scheme and typography
- Responsive design with mobile considerations
- Intuitive navigation between related records
- Clear status indicators and visual feedback