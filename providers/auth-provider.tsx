'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import Cookies from 'js-cookie';

import { jwtDecode } from 'jwt-decode';

import {
  AuthContextType,
  User,
} from '@/types/auth';

const AuthContext =
  createContext<AuthContextType | null>(
    null,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const storedToken =
      Cookies.get('token');

    if (
      storedToken &&
      storedToken.split('.').length === 3
    ) {
      try {
        const decoded: User =
          jwtDecode(storedToken);

        setUser(decoded);

        setToken(storedToken);
      } catch (error) {
        console.error(
          'Invalid token:',
          error,
        );

        Cookies.remove('token');

        setUser(null);

        setToken(null);
      }
    } else {
      Cookies.remove('token');
    }

    setLoading(false);
  }, []);

  const login = (
    newToken: string,
  ) => {
    try {
      if (
        !newToken ||
        newToken.split('.').length !== 3
      ) {
        throw new Error(
          'Invalid JWT token',
        );
      }

      Cookies.set('token', newToken, {
        expires: 7,
      });

      const decoded: User =
        jwtDecode(newToken);

      setUser(decoded);

      setToken(newToken);
    } catch (error) {
      console.error(
        'Login token error:',
        error,
      );
    }
  };

  const logout = () => {
    Cookies.remove('token');

    setUser(null);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        token,

        loading,

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    );
  }

  return context;
};