import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { HierarchyUser } from '../../types/user';
import HierarchyTree from './HierarchyTree';
import HierarchyItem from './HierarchyItem';
import userEvent from '@testing-library/user-event';

const mockUser: HierarchyUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  email: 'john@example.com',
  photo: 'https://example.com/photo.jpg',
  initials: 'JD',
  isManager: true,
  reports: [
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      photo: 'https://example.com/jane.jpg',
      initials: 'JS',
      isManager: false,
      reports: []
    }
  ]
};

describe('HierarchyItem', () => {
  it('renders user information correctly with expand icon', () => {
    render(<HierarchyItem {...mockUser} />);
    
    expect(screen.getByText('+')).toBeInTheDocument(); 
    expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
    expect(screen.getByText('John Doe john@example.com')).toBeInTheDocument();
  });

  it('renders user information correctly with - icon if user is not a manager', () => {
    const userWithoutReports = { ...mockUser, reports: [] };
    render(<HierarchyItem {...userWithoutReports} />);
    
    expect(screen.getByText('-')).toBeInTheDocument(); 
    expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
    expect(screen.getByText('John Doe john@example.com')).toBeInTheDocument();
  });

  it('toggles expansion with keyboard', async () => {
    const user = userEvent.setup();
    render(<HierarchyItem {...mockUser} />);
        
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();    
    
    const expandableButton = screen.getByRole('button', { name: 'John Doe' });
    expandableButton.focus();        
    await user.keyboard('{Enter}');   
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();    
    
    await user.keyboard(' ');
    expect(screen.queryByText(/Jane Smith/)).not.toBeInTheDocument();
    
    await user.keyboard(' ');
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    
    await user.keyboard('{Enter}');
    expect(screen.queryByText(/Jane Smith/)).not.toBeInTheDocument();
  });  

  it('does not show expand icon when user has no reports', () => {
    const userWithoutReports = { ...mockUser, reports: [] };
    render(<HierarchyItem {...userWithoutReports} />);
    
    expect(screen.queryByText('+')).not.toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

describe('HierarchyTree', () => {
  it('renders a list of users', () => {
    const users: HierarchyUser[] = [
      { ...mockUser, id: 1 },
      { 
        ...mockUser, 
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        fullName: 'Bob Johnson',
        email: 'bob@example.com',        
        initials: 'BJ',
        isManager: false,
        reports: [] 
      }
    ];
    
    render(<HierarchyTree users={users} />);
    
    expect(screen.getByText('John Doe john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson bob@example.com')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'BJ' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
  });

  it('handles empty users array', async () => {
    render(<HierarchyTree users={[]} />);

    const tree = await screen.queryByRole('tree');
    expect(tree).not.toBeInTheDocument();
  });
});
