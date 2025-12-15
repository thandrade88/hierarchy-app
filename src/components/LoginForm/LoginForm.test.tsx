import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    user: null,
    login: mockLogin,
    logout: mockLogout,
    isLoading: false,
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginForm', () => {
  const email = 'test@example.com', password = 'password';

  it('should call login with correct credentials and show loading state', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email:'), email);
    await user.type(screen.getByLabelText('Password:'), password);
    const loginButton = screen.getByText('Login');
    
    expect(loginButton).not.toBeDisabled();
    
    await user.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith(email, password);    
  });

  it('should display an error message on failed login attempt', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText('Email:'), email);
    await user.type(screen.getByLabelText('Password:'), password);

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledTimes(1);      
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    
  });

  it('should NOT call login if fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const loginButton = screen.getByText('Login');

    await user.click(loginButton);   

    expect(mockLogin).not.toHaveBeenCalled();
    expect(loginButton).not.toBeDisabled();   

  });
});