import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HierarchyItem from '../HierarchyItem/HierarchyItem';
import userEvent from '@testing-library/user-event';
import { MOCK_USER_ITEM } from '../../test/constants';

describe('HierarchyItem', () => {
    it('renders user information correctly with expand icon', () => {
      render(<HierarchyItem {...MOCK_USER_ITEM} />);
      
      expect(screen.getByText('+')).toBeInTheDocument(); 
      expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  
    it('renders user information correctly with - icon if user is not a manager', () => {
      const userWithoutReports = { ...MOCK_USER_ITEM, reports: [] };
      render(<HierarchyItem {...userWithoutReports} />);
      
      expect(screen.getByText('-')).toBeInTheDocument(); 
      expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  
    it('toggles expansion with keyboard', async () => {
      const user = userEvent.setup();
      render(<HierarchyItem {...MOCK_USER_ITEM} />);
          
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();    
      
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
    });  
  
    it('toggles expansion with click', async () => {
      const user = userEvent.setup();
      render(<HierarchyItem {...MOCK_USER_ITEM} />);
          
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();    
      
      const expandableButton = screen.getByRole('treeitem', { name: 'John Doe' });
      await user.click(expandableButton);        

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();    
      
      await user.click(expandableButton);    
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      
      await user.click(expandableButton);    
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      
      await user.click(expandableButton);    
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });  
  
    it('does not show expand icon when user has no reports', () => {
      const userWithoutReports = { ...MOCK_USER_ITEM , reports: [] };
      render(<HierarchyItem {...userWithoutReports} />);
      
      expect(screen.queryByText('+')).not.toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });