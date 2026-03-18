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
  display_order?: number;
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

export type TeamCategory = {
  id: string;
  name: string;
  display_order: number;
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
  services:       Service[];
  team:           TeamMember[];
  careers:        Career[];
  teamCategories: TeamCategory[];
};

type AppDataContextType = {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// ── Context ───────────────────────────────────────────────────────────────────

const AppDataContext = createContext<AppDataContextType | null>(null);

const CACHE_KEY = 'site_data_v10';  // ← bumped: picks up display_order fix
const CACHE_TTL = 1000 * 60 * 60;

// ── Helpers ───────────────────────────────────────────────────────────────────

function toArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const s = val.trim();

    // PostgreSQL array literal: {"Divorce and Separation","Child Custody"}
    if (s.startsWith('{') && s.endsWith('}')) {
      return s
        .slice(1, -1)
        .match(/("(?:[^"\\\\]|\\\\.)*"|[^,]+)/g)
        ?.map((item) => item.replace(/^"|"$/g, '').trim())
        .filter(Boolean) ?? [];
    }

    // JSON array: ["Divorce and Separation","Child Custody"]
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? parsed : [s];
    } catch {
      return s.split(',').map((x) => x.trim()).filter(Boolean);
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

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(() => getCache<AppData>(CACHE_KEY));
  const [loading, setLoading] = useState(!getCache(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    try {
      const [services, team, careers, teamCategories] = await Promise.all([

        supabase
          .from('legal_services')
          .select(`
            id, slug, title, excerpt, description,
            header_image, icon, overview, display_order,
            key_services, why_choose_us, process
          `)
          .order('display_order', { ascending: true })  // ← Fixed
          .order('title',         { ascending: true }), // ← Fallback

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

        supabase
          .from('team_categories')
          .select('id, name, display_order')
          .order('display_order', { ascending: true }),

      ]);

      if (services.error)       throw services.error;
      if (team.error)           throw team.error;
      if (careers.error)        throw careers.error;
      if (teamCategories.error) throw teamCategories.error;

      const result: AppData = {
        services: (services.data ?? []).map((s) => ({
          ...s,
          key_services:  toArray(s.key_services),
          why_choose_us: toJsonArray<{ title: string; description: string }>(s.why_choose_us),
          process:       toJsonArray<{ title: string; description: string }>(s.process),
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

        teamCategories: teamCategories.data ?? [],
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
