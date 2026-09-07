import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { TechnoglobeApi } from '../lib/api';

export const SEEDED_ADMIN = {
  name: 'Sajibur Rahman',
  email: 'admin@technoglobe.com',
  password: 'admin123',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  getAdminCredentials: () => { email: string; password: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'technoglobe_auth_user';
const AUTH_TOKEN_KEY = 'technoglobe_token';
const REGISTERED_USERS_KEY = 'technoglobe_registered_accounts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Try Live Backend API
      const response = await TechnoglobeApi.login(normalizedEmail, password);
      const authUser: AuthUser = {
        id: response.admin.id,
        name: response.admin.name,
        email: response.admin.email,
        role: response.admin.role,
        avatarUrl: SEEDED_ADMIN.avatarUrl
      };
      setUser(authUser);
      setToken(response.accessToken);
    } catch (apiError: any) {
      // 2. Offline / Mock fallback if backend server is not currently reachable
      console.warn('Backend API login unavailable or rejected, trying local verification:', apiError.message);

      // Check against seeded Admin credentials
      if (
        normalizedEmail === SEEDED_ADMIN.email.toLowerCase() &&
        password === SEEDED_ADMIN.password
      ) {
        const adminUser: AuthUser = {
          id: 'admin-seeded-1',
          name: SEEDED_ADMIN.name,
          email: SEEDED_ADMIN.email,
          role: 'ADMIN',
          avatarUrl: SEEDED_ADMIN.avatarUrl
        };
        const mockToken = `token_mock_${Date.now()}`;
        setUser(adminUser);
        setToken(mockToken);
        return;
      }

      // Check against locally registered accounts
      const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredUsers: Array<AuthUser & { password: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const matched = registeredUsers.find(
        u => u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (matched) {
        const authUser: AuthUser = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          avatarUrl: matched.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        const mockToken = `token_mock_${Date.now()}`;
        setUser(authUser);
        setToken(mockToken);
        return;
      }

      // If invalid
      throw new Error(
        apiError?.message && !apiError.message.includes('status') && !apiError.message.includes('Failed to fetch')
          ? apiError.message
          : 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'ADMIN') => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Try Live Backend API
      const response = await TechnoglobeApi.register({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role
      });
      const authUser: AuthUser = {
        id: response.admin.id,
        name: response.admin.name,
        email: response.admin.email,
        role: response.admin.role,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      setUser(authUser);
      setToken(response.accessToken);
    } catch (apiError: any) {
      // 2. Offline fallback
      console.warn('Backend API register unavailable, falling back to local registration:', apiError.message);

      const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredUsers: Array<AuthUser & { password: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (
        normalizedEmail === SEEDED_ADMIN.email.toLowerCase() ||
        registeredUsers.some(u => u.email.toLowerCase() === normalizedEmail)
      ) {
        throw new Error('An account with this email already exists');
      }

      const newAccount = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role as 'ADMIN' | 'STAFF',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };

      registeredUsers.push(newAccount);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));

      const authUser: AuthUser = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
        avatarUrl: newAccount.avatarUrl
      };
      setUser(authUser);
      setToken(`token_mock_${Date.now()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const getAdminCredentials = () => {
    return {
      email: SEEDED_ADMIN.email,
      password: SEEDED_ADMIN.password
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      getAdminCredentials
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
