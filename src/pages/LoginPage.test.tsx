import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../components/LoginForm/LoginForm', () => ({
  __esModule: true,
  default: () => <div data-testid="login-form">Login Form</div>,
}));

describe('LoginPage', () => {
  const renderLoginPage = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders the login page as expected', () => {
    renderLoginPage();
    expect(screen.getByText('Please login')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

});
