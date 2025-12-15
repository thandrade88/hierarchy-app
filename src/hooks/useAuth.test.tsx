// src/__tests__/useAuth.test.tsx

import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import useAuth from '../hooks/useAuth';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

const MOCK_AUTH_USER = {
    id: 1,
    email: 'test@hook.com',
    firstName: 'Test',
    lastName: 'Hook',
};

const MOCK_AUTH_VALUE: AuthContextType = {
  user: MOCK_AUTH_USER,
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthContext.Provider value={MOCK_AUTH_VALUE}>
      {children}
    </AuthContext.Provider>
  );

describe('useAuth', () => {

  it('should return the current context value when rendered inside AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    
    expect(result.current.user).toEqual(MOCK_AUTH_VALUE.user);
    expect(result.current.isLoading).toBe(MOCK_AUTH_VALUE.isLoading);
    
    expect(result.current.login).toBeDefined();
    expect(result.current.logout).toBeDefined();
  });

  
});