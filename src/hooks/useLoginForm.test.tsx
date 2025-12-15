import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoginForm } from './useLoginForm';

const mockSubmitEvent = {
  preventDefault: vi.fn(),
  persist: vi.fn(),
} as any as React.FormEvent<HTMLFormElement>;

const mockChangeEvent = (id: string, value: string) => ({
  target: { id, value },
  persist: vi.fn(),
} as any as React.ChangeEvent<HTMLInputElement>);

const mockLogin = vi.fn();
vi.mock('./useAuth', () => ({
  __esModule: true,
  default: () => ({
    login: mockLogin,
    user: null,
    logout: vi.fn(),
    isLoading: false,
  }),
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockLogin.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLoginForm());
    
    expect(result.current.formData).toEqual({
      email: '',
      password: '',
    });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should update formData when handleChange is called', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange(mockChangeEvent('email', 'test@example.com'));
    });

    expect(result.current.formData).toEqual({
      email: 'test@example.com',
      password: '',
    });

    act(() => {
      result.current.handleChange(mockChangeEvent('password', 'secret123'));
    });

    expect(result.current.formData).toEqual({
      email: 'test@example.com',
      password: 'secret123',
    });
  });

  it('should set error state and not call login if email is empty', async () => {
    const { result } = renderHook(() => useLoginForm());
    
    act(() => {
      result.current.handleChange(mockChangeEvent('password', 'password123'));
    });

    await act(async () => {
      await result.current.handleSubmit(mockSubmitEvent);
    });
    
    expect(result.current.error).toBe('Please fill in all fields');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set error state and not call login if password is empty', async () => {
    const { result } = renderHook(() => useLoginForm());
    
    act(() => {
      result.current.handleChange(mockChangeEvent('email', 'test@example.com'));
    });

    await act(async () => {
      await result.current.handleSubmit(mockSubmitEvent);
    });
    
    expect(result.current.error).toBe('Please fill in all fields');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('should call login with correct credentials and handle success', async () => {
    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      result.current.handleChange(mockChangeEvent('email', 'user@example.com'));
      result.current.handleChange(mockChangeEvent('password', 'secure123'));
    });

    result.current.handleSubmit(mockSubmitEvent);
    expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'secure123');
  });

  it('should handle login failure and set error state', async () => {
    const error = new Error('Authentication failed');
    mockLogin.mockRejectedValueOnce(error);
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange(mockChangeEvent('email', 'wrong@example.com'));
      result.current.handleChange(mockChangeEvent('password', 'wrongpass'));
    });

    await act(async () => {
      await result.current.handleSubmit(mockSubmitEvent);
    });

    expect(result.current.error).toBe('Invalid email or password');
    expect(result.current.isLoading).toBe(false);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    
    consoleErrorSpy.mockRestore();
  });
});