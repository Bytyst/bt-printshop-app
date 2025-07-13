import { useState, useCallback } from 'react';
import { NavigationContext } from '../types';

export function useNavigation() {
  const [context, setContext] = useState<NavigationContext>({
    activeTab: 'calendar'
  });

  const navigateToClient = useCallback((clientId: string) => {
    setContext({
      activeTab: 'clients',
      selectedClientId: clientId
    });
  }, []);

  const navigateToQuote = useCallback((quoteId: string, clientId?: string) => {
    setContext({
      activeTab: 'quotes',
      selectedQuoteId: quoteId,
      selectedClientId: clientId
    });
  }, []);

  const navigateToInvoice = useCallback((invoiceId: string, clientId?: string) => {
    setContext({
      activeTab: 'invoices',
      selectedInvoiceId: invoiceId,
      selectedClientId: clientId
    });
  }, []);

  const navigateToTab = useCallback((tab: string) => {
    setContext(prev => ({
      ...prev,
      activeTab: tab
    }));
  }, []);

  const createInvoiceFromQuote = useCallback((quoteId: string) => {
    // This will be implemented to convert quote to invoice
    setContext({
      activeTab: 'invoices',
      selectedQuoteId: quoteId
    });
  }, []);

  const createQuoteForClient = useCallback((clientId: string) => {
    setContext({
      activeTab: 'quotes',
      selectedClientId: clientId
    });
  }, []);

  return {
    context,
    navigateToClient,
    navigateToQuote,
    navigateToInvoice,
    navigateToTab,
    createInvoiceFromQuote,
    createQuoteForClient
  };
}