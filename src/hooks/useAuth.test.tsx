import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useAuth from '../hooks/useAuth';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

const MOCK_AUTH_USER = {
  id: 1,
  email: 'test@hook.com',
  firstName: 'Test',
  lastName: 'Hook',
};

const mockLogin = vi.fn();
const mockLogout = vi.fn();

const MOCK_AUTH_VALUE: AuthContextType = {
  user: MOCK_AUTH_USER,
  login: mockLogin,
  logout: mockLogout,
  isLoading: false,
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={MOCK_AUTH_VALUE}>
    {children}
  </AuthContext.Provider>
);

describe('useAuth', () => {
  it('returns the current context value when inside AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    expect(result.current.user).toEqual(MOCK_AUTH_USER);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.login).toBeDefined();
    expect(result.current.logout).toBeDefined();
  });

  it('throws when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('returns null user when not authenticated', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthContext.Provider
        value={{
          user: null,
          login: mockLogin,
          logout: mockLogout,
          isLoading: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('returns loading state correctly', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthContext.Provider
        value={{
          user: null,
          login: mockLogin,
          logout: mockLogout,
          isLoading: true,
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('exposes stable login and logout references', () => {
    const { result, rerender } = renderHook(() => useAuth(), {
      wrapper: Wrapper,
    });

    const { login, logout } = result.current;

    rerender();

    expect(result.current.login).toBe(login);
    expect(result.current.logout).toBe(logout);
  });

  it('updates when context value changes', () => {
    let contextValue = { ...MOCK_AUTH_VALUE };

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(MOCK_AUTH_USER);

    contextValue = {
      ...contextValue,
      user: null,
    };

    rerender();

    expect(result.current.user).toBeNull();
  });
});
