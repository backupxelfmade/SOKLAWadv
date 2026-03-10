import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getCache, setCache } from '../lib/cache';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Service = {
  id: string;
  slug?: string;
  title: string;
  excerpt?: string;
  description?: string;
  header_image?: string;
  icon?: string;
  overview?: string;
  key_services?: string[];
  why_choose_us?: { title: string; description: string }[];
  process?: { title: string; description: string }[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  category?: string;
  image?: string;
  specialization?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  description?: string;
  experience?: string;
  expertise?: string[];
  education?: string[];
  achievements?: string[];
  languages?: string[];
  admissions?: string[];
  qualifications?: string[];
  display_order?: number;
};

export type Career = {
  id: string;
  title: string;
  description: string;
  department?: string;
  location?: string;
  type?: string;
  experience?: string;
  is_active?: boolean;
  deadline?: string;
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

const CACHE_KEY = 'site_data_v7';
const CACHE_TTL = 1000 * 60 * 60;

// ── Helpers ───────────────────────────────────────────────────────────────────

function toArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function toJsonArray<T>(val: unknown): T[] {
  if (!val) return [];
  if (Array.isArray(val)) return val as T[];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function buildWhyChooseUs(s: any): { title: string; description: string }[] {
  const fromJson = toJsonArray<{ title: string; description: string }>(s.why_choose_us);
  if (fromJson.length > 0) return fromJson;
  const result: { title: string; description: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    const title = s[`why_choose_us_${i}_title`];
    const description = s[`why_choose_us_${i}_description`];
    if (!title) break;
    result.push({ title, description: description ?? '' });
  }
  return result;
}

function buildProcess(s: any): { title: string; description: string }[] {
  const fromJson = toJsonArray<{ title: string; description: string }>(s.process);
  if (fromJson.length > 0) return fromJson;
  const result: { title: string; description: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    const title = s[`process_step_${i}_title`];
    const description = s[`process_step_${i}_description`];
    if (!title) break;
    result.push({ title, description: description ?? '' });
  }
  return result;
}

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
          .from('legal_services')
          .select(`
            id, slug, title, excerpt, description,
            header_image, icon, overview, key_services,
            why_choose_us,
            why_choose_us_1_title, why_choose_us_1_description,
            why_choose_us_2_title, why_choose_us_2_description,
            why_choose_us_3_title, why_choose_us_3_description,
            why_choose_us_4_title, why_choose_us_4_description,
            why_choose_us_5_title, why_choose_us_5_description,
            process,
            process_step_1_title, process_step_1_description,
            process_step_2_title, process_step_2_description,
            process_step_3_title, process_step_3_description,
            process_step_4_title, process_step_4_description,
            process_step_5_title, process_step_5_description
          `),

        supabase
          .from('team_members')
          .select(`
            id, name, role, category, image, specialization,
            email, phone, linkedin, description, experience,
            expertise, education, achievements,
            languages, admissions, qualifications,
            display_order
          `)
          .order('display_order', { ascending: true })
          .order('name',          { ascending: true }),

        supabase
          .from('job_positions')
          .select(`
            id, title, description, department,
            location, type, experience, is_active,
            deadline
          `),

      ]);

      if (services.error) throw services.error;
      if (team.error)     throw team.error;
      if (careers.error)  throw careers.error;

      const result: AppData = {
        services: (services.data ?? []).map((s) => ({
          ...s,
          key_services:  toArray(s.key_services),
          why_choose_us: buildWhyChooseUs(s),
          process:       buildProcess(s),
        })),

        team: (team.data ?? []).map((m) => ({
          ...m,
          expertise:      toArray(m.expertise),
          education:      toArray(m.education),
          achievements:   toArray(m.achievements),
          languages:      toArray(m.languages),
          admissions:     toArray(m.admissions),
          qualifications: toArray(m.qualifications),
        })),

        careers: careers.data ?? [],
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
