import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export type MaintenanceSettings = {
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  maintenanceUntil: string | null;
};

type MaintenanceContextValue = {
  settings: MaintenanceSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
};

const MaintenanceContext = createContext<MaintenanceContextValue | undefined>(undefined);

export const MaintenanceProvider = ({ children }: { children: React.ReactNode }) => {
  const query = useQuery({
    queryKey: ['publicMaintenanceSettings'],
    queryFn: () => api.get<MaintenanceSettings>('/settings/maintenance'),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnMount: 'always',
    retry: 2
  });

  return (
    <MaintenanceContext.Provider value={{
      settings: query.data,
      isLoading: query.isLoading,
      error: query.error,
      retry: () => { void query.refetch(); }
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) throw new Error('useMaintenance must be used within MaintenanceProvider');
  return context;
};
