import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders initials when no photoUrl is provided', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders an image when photoUrl is provided', () => {
    const testUrl = 'https://example.com/photo.jpg';
    render(<Avatar initials="JD" photoUrl={testUrl} />);
    const img = screen.getByAltText('JD');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', testUrl);    
  });  
});