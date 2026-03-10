import { useAppData } from '../context/AppDataContext';

// ServicesPage destructures: { services, loading, error, refresh }
export function useServices() {
  const { data, loading, error, refresh } = useAppData();
  return {
    services: data?.services ?? [],
    loading,
    error,
    refresh,
  };
}

// TeamPage destructures: { team, loading, error }
export function useTeam() {
  const { data, loading, error, refresh } = useAppData();
  return {
    team:    data?.team ?? [],
    loading,
    error,
    refresh,
  };
}

// CareersPage destructures: { careers, loading }
export function useCareers() {
  const { data, loading, error, refresh } = useAppData();
  return {
    careers: data?.careers ?? [],
    loading,
    error,
    refresh,
  };
}
