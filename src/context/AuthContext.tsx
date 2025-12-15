import React, { createContext, useState } from 'react';
import type { UserData } from '../types/user';
import { encode } from '../utils/auth';
import { getUserBySecret } from '../utils/api';


export type AuthContextType = {
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);


export function AuthProvider({ children }: { children: React.ReactNode }) {  
  const initialUser = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')!) as UserData 
    : null;
  
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
   
      const secret = encode(email, password);   
      const foundUser = await getUserBySecret(secret);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
    {children}
  </AuthContext.Provider>
  );
};

