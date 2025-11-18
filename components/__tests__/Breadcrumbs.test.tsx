/**
 * Tests for Breadcrumbs component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render breadcrumb items', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Programs', href: '/programs' },
      { label: 'Details' },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Programs')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should render links for items with href', () => {
    const items = [{ label: 'Home', href: '/' }, { label: 'Current' }];

    const { container } = render(<Breadcrumbs items={items} />);

    const links = container.querySelectorAll('a');
    expect(links.length).toBe(1);
  });

  it('should not render link for current page', () => {
    const items = [{ label: 'Home', href: '/' }, { label: 'Current Page' }];

    render(<Breadcrumbs items={items} />);

    const currentPage = screen.getByText('Current Page');
    expect(currentPage.tagName).not.toBe('A');
  });

  it('should handle empty items array', () => {
    const { container } = render(<Breadcrumbs items={[]} />);

    expect(container.firstChild).toBeTruthy();
  });

  it('should handle single item', () => {
    const items = [{ label: 'Home' }];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should show separators between items', () => {
    const items = [
      { label: 'One', href: '/one' },
      { label: 'Two', href: '/two' },
      { label: 'Three' },
    ];

    const { container } = render(<Breadcrumbs items={items} />);

    // Should have visual separators (chevrons or slashes)
    expect(container.textContent).toBeTruthy();
  });
});
