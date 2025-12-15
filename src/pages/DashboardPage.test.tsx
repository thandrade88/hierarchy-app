import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import DashboardPage from '../pages/DashboardPage';
import userEvent from '@testing-library/user-event';
import { MOCK_LOGGED_USER, MOCK_USER_ITEM } from '../test/constants';
import { fetchAllUsers } from '../utils/api';

const mockLogout = vi.fn();

vi.mock('../utils/api', () => ({
  fetchAllUsers: vi.fn(),
}));

vi.mock('../utils/hierarchy', () => ({
  default: vi.fn((users) => users),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: MOCK_LOGGED_USER, logout: mockLogout }),
}));

describe('DashboardPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state, then render the hierarchy on success, and toggle expansion', async () => {
    vi.mocked(fetchAllUsers).mockResolvedValue([MOCK_USER_ITEM]);

    const user = userEvent.setup();

    render(<DashboardPage />);

    expect(await screen.findByText('Loading organization chart...')).toBeInTheDocument();
    expect(screen.queryByText('Loading organization chart...')).not.toBeInTheDocument();

    expect(screen.getByText('Anthony Xiouping')).toBeInTheDocument();

    const expandableButton = screen.getByRole('treeitem', { name: 'John Doe' });
    
    expandableButton.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    await user.keyboard(' ');
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

    await user.keyboard(' ');
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

    await user.click(expandableButton);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    await user.click(expandableButton);

    await user.click(expandableButton);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    await user.click(expandableButton);
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

  });

  it('should set error state and display error message on API failure', async () => {
    vi.mocked(fetchAllUsers).mockRejectedValue(new Error('Firebase API failed to respond.'));

    render(<DashboardPage />);

    expect(await screen.findByText('Loading organization chart...')).toBeInTheDocument();
    expect(screen.queryByText('Loading organization chart...')).not.toBeInTheDocument();

    expect(screen.getByText('Error: Firebase API failed to respond.')).toBeInTheDocument();

    expect(screen.getByText('Reload')).toBeInTheDocument();

  });

  it('should call the logout function when the link is clicked', async () => {
    vi.mocked(fetchAllUsers).mockResolvedValue([MOCK_USER_ITEM]);
    render(<DashboardPage />);

    expect(await screen.findByText('Loading organization chart...')).toBeInTheDocument();
    expect(screen.queryByText('Loading organization chart...')).not.toBeInTheDocument();

    expect(screen.getByText('Anthony Xiouping')).toBeInTheDocument();

    const logoutLink = screen.getByText('Logout');
    await userEvent.click(logoutLink);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});