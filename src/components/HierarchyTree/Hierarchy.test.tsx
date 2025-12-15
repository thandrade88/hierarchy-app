import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { HierarchyUser } from '../../types/user';
import HierarchyTree from './HierarchyTree';

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
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'BJ' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
  });

  it('handles empty users array', async () => {
    render(<HierarchyTree users={[]} />);

    const tree = await screen.queryByRole('tree');
    expect(tree).not.toBeInTheDocument();
  });
});
