import { render, screen } from '@testing-library/react';
import App from './App';
import useAuth from './hooks/useAuth';
import { vi, describe, beforeEach, it, expect } from 'vitest';

vi.mock('./pages/LoginPage', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('./pages/DashboardPage', () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock('./pages/NotFoundPage', () => ({
  default: () => <div>Not Found Page</div>,
}));

vi.mock('./hooks/useAuth', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('App', () => {
  const mockedUseAuth = vi.mocked(useAuth);

  const renderWithRoute = (route: string) => {
    window.history.pushState({}, 'Test page', route);
    render(
        <App />
    );
  };

  const mockAuth = (isAuthenticated: boolean) => {
    mockedUseAuth.mockReturnValue({
      user : isAuthenticated ? { id: 1, email: 'test@test.com', firstName: 'Test', lastName: 'User' } : null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login page on "/" when not authenticated', () => {
    mockAuth(false);
    renderWithRoute('/');

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to login when accessing protected route unauthenticated', () => {
    mockAuth(false);
    renderWithRoute('/dashboard');

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', () => {
    mockAuth(true);
    renderWithRoute('/dashboard');

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('renders not found page for unknown routes', () => {
    mockAuth(false);
    renderWithRoute('/unknown');

    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('renders login page for login routes', () => {
    mockAuth(false);
    renderWithRoute('/login');

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });  
});
