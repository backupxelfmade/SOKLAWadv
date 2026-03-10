import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getCache, setCache } from '../lib/cache';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Service = {
  id: string;
  slug?: string;
  title: string;
  excerpt?: string;           // hover text on ServicesPage cards
  description?: string;       // hero subtitle on ServiceDetailPage
  header_image?: string;      // background image on ServicesPage cards
  icon?: string;              // Lucide icon name on ServiceDetailPage
  overview?: string;          // Overview section
  key_services?: string[];    // Key Services checklist
  why_choose_us?: {
    title: string;
    description: string;
  }[];
  process?: {
    title: string;
    description: string;
  }[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  category?: string;          // Partners / Associates / etc.
  image?: string;
  specialization?: string;    // subtitle on card
  email?: string;
  phone?: string;
  linkedin?: string;
  description?: string;       // About section in modal
  experience?: string;        // Experience section in modal
  expertise?: string[];       // Areas of Expertise tags
  education?: string[];       // Education list
  achievements?: string[];    // Key Achievements list
  languages?: string[];       // Languages — TeamDirectory detail view
  admissions?: string[];      // Bar admissions — TeamDirectory detail view
  qualifications?: string[];  // Short credential pills on directory card
};

export type Career = {
  id: string;
  title: string;
  description: string;
  department?: string;        // shown under title on position card
  location?: string;          // MapPin badge
  type?: string;              // Clock badge (Full-time, Part-time, etc.)
  experience?: string;        // Briefcase badge
  deadline?: string;
  is_active?: boolean;        // filters inactive positions client-side
};

type AppData = {
  services: Service[];
  team: TeamMember[];
  careers: Career[];
};

type AppDataContextType = {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// ── Context ───────────────────────────────────────────────────────────────────

const AppDataContext = createContext<AppDataContextType | null>(null);

const CACHE_KEY = 'site_data';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(() => getCache<AppData>(CACHE_KEY));
  const [loading, setLoading] = useState(!getCache(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    try {
      const [services, team, careers] = await Promise.all([

        supabase
          .from('services')
          .select(`
            id,
            slug,
            title,
            excerpt,
            description,
            header_image,
            icon,
            overview,
            key_services,
            why_choose_us,
            process
          `),

        supabase
          .from('team')
          .select(`
            id,
            name,
            role,
            category,
            image,
            specialization,
            email,
            phone,
            linkedin,
            description,
            experience,
            expertise,
            education,
            achievements,
            languages,
            admissions,
            qualifications
          `),

        supabase
          .from('careers')
          .select(`
            id,
            title,
            description,
            department,
            location,
            type,
            experience,
            deadline,
            is_active
          `),

      ]);

      if (services.error) throw services.error;
      if (team.error)     throw team.error;
      if (careers.error)  throw careers.error;

      const result: AppData = {
        services: services.data ?? [],
        team:     team.data     ?? [],
        careers:  careers.data  ?? [],
      };

      setData(result);
      setCache(CACHE_KEY, result, CACHE_TTL);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load site data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!data) fetchAll();
  }, []);

  return (
    <AppDataContext.Provider value={{ data, loading, error, refresh: fetchAll }}>
      {children}
    </AppDataContext.Provider>
  );
}

// ── Internal hook ─────────────────────────────────────────────────────────────

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
