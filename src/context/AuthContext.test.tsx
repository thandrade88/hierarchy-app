import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, AuthContext, type AuthContextType } from '../context/AuthContext'; 
import { getUserBySecret } from '../utils/api';
import { encode } from '../utils/auth';

vi.mock('../utils/api', () => ({
    getUserBySecret: vi.fn(),
}));
vi.mock('../utils/auth', () => ({
    encode: vi.fn(),
}));


const MOCK_USER = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
};

const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password';
const TEST_SECRET = 'encoded-secret-123';

const TestConsumer = () => {
    const { user, isLoading, login, logout } = useContext(AuthContext) as AuthContextType;
    const [localError, setLocalError] = React.useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setLocalError(null);
            await login(TEST_EMAIL, TEST_PASSWORD);
        } catch (err) {
            setLocalError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <div>
            <div data-testid="user-email">{user?.email || 'null'}</div>
            <div data-testid="is-loading">{isLoading.toString()}</div>
            <div data-testid="login-error">{localError}</div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthProvider', () => {
    const userEventSetup = userEvent.setup();

    const renderAuthProvider = () => {
        return render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.mocked(getUserBySecret).mockResolvedValue(MOCK_USER);
        vi.mocked(encode).mockReturnValue(TEST_SECRET);
    });

    it('should initialize with null user if no user in localStorage', () => {
        renderAuthProvider();
        
        expect(screen.getByTestId('user-email')).toHaveTextContent('null');        
    });

    it('should initialize with user from localStorage', () => {
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        
        renderAuthProvider();
        
        expect(screen.getByTestId('user-email')).toHaveTextContent(MOCK_USER.email);
    });

    it('should handle successful login: update state and localStorage', async () => {
        renderAuthProvider();
        
        const loginButton = screen.getByRole('button', { name: 'Login' });
        await userEventSetup.click(loginButton);
        
        expect(encode).toHaveBeenCalledWith(TEST_EMAIL, TEST_PASSWORD);
        expect(getUserBySecret).toHaveBeenCalledWith(TEST_SECRET);
        expect(screen.getByTestId('user-email')).toHaveTextContent(MOCK_USER.email);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(MOCK_USER));
        expect(screen.getByTestId('login-error')).toHaveTextContent('');
    });

    it('should handle login error (invalid credentials)', async () => {
        vi.mocked(getUserBySecret).mockResolvedValue(null);
        
        renderAuthProvider();
        
        const loginButton = screen.getByRole('button', { name: 'Login' });
        await userEventSetup.click(loginButton);
        
        expect(screen.getByTestId('user-email')).toHaveTextContent('null');
        expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
        expect(localStorage.getItem('user')).toBeNull();        
    });

    it('should handle API exception and display error', async () => {
        const apiError = new Error('Network failed');
        vi.mocked(getUserBySecret).mockRejectedValue(apiError);
        
        renderAuthProvider();
        
        const loginButton = screen.getByText('Login');
        await userEventSetup.click(loginButton);
        
        expect(screen.getByTestId('login-error')).toHaveTextContent('Network failed');        
    });

    it('should handle logout: clear state and localStorage', async () => {
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        
        renderAuthProvider();

        expect(screen.getByTestId('user-email')).toHaveTextContent(MOCK_USER.email);
        
        const logoutButton = screen.getByText('Logout');
        await userEventSetup.click(logoutButton);
        
        expect(screen.getByTestId('user-email')).toHaveTextContent('null');
        expect(localStorage.getItem('user')).toBeNull();
    });
});