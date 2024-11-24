  import React, { createContext, useState, useEffect, useContext } from 'react';
  import authService from './authService';

  interface AuthContextType {
    isLoggedIn: boolean;
    login: (data: any) => Promise<void>; 
    logout: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    }, []); // Add an empty dependency array to run this effect only once

    const login = async (data: any) => {
      const response = await authService.login(data);
      localStorage.setItem('token', response.access_token);
      setIsLoggedIn(true);
    };

    const logout = async () => {
      await authService.logout();
      setIsLoggedIn(false);
    };

    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuthProvided = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthProvided must be used within an AuthProvider');
    }
    return context;
  };
