/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, USE_MOCK_AUTH } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user storage
const STORAGE_KEY = 'cyberguard_users';
const SESSION_KEY = 'cyberguard_session';

interface MockUser {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

function getMockUsers(): MockUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getMockSession(): { email: string; id: string } | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveMockSession(email: string, id: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, id }));
}

function clearMockSession() {
  localStorage.removeItem(SESSION_KEY);
}

function createMockUser(email: string): User {
  return {
    id: Math.random().toString(36).substring(7),
    email,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      // Mock authentication using localStorage
      const mockSession = getMockSession();
      if (mockSession) {
        const mockUser = createMockUser(mockSession.email);
        mockUser.id = mockSession.id;
        setUser(mockUser);
        setSession({ user: mockUser } as Session);
      }
      setLoading(false);
    } else {
      // Real Supabase authentication
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Auth session error:', error);
          setLoading(false);
        });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    if (USE_MOCK_AUTH) {
      // Mock sign up
      const users = getMockUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return { error: 'User already exists' };
      }

      if (!email || !password) {
        return { error: 'Email and password are required' };
      }

      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      const newUser: MockUser = {
        id: Math.random().toString(36).substring(7),
        email,
        password,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      saveMockUsers(users);

      // Auto sign in
      const mockUser = createMockUser(email);
      mockUser.id = newUser.id;
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      saveMockSession(email, newUser.id);

      return { error: null };
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (USE_MOCK_AUTH) {
      // Mock sign in
      const users = getMockUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { error: 'Invalid email or password' };
      }

      const mockUser = createMockUser(email);
      mockUser.id = user.id;
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      saveMockSession(email, user.id);

      return { error: null };
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    }
  };

  const signOut = async () => {
    if (USE_MOCK_AUTH) {
      // Mock sign out
      setUser(null);
      setSession(null);
      clearMockSession();
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
