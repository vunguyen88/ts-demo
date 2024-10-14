import { useContext } from 'react';
import { SelectedServiceContext } from '@/contexts/selected-service-context';
import { AuthContext } from '@/contexts/auth-context';

// Custom hook to use the context
export const useSelectedServiceContext = () => {
  const context = useContext(SelectedServiceContext);
  if (!context) {
    throw new Error('useSelectedServiceContext must be used within a SelectedServiceContextProvider');
  }
  return context;
};