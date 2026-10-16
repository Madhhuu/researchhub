import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  role: 'Research Admin' | 'Faculty';
  email: string;
  initials: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial user state from sessionStorage if available (persists through refresh for demo purposes)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = sessionStorage.getItem('rh_mock_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (profile: UserProfile) => {
    setUser(profile);
    sessionStorage.setItem('rh_mock_user', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('rh_mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
