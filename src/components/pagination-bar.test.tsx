import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaginationBar } from './pagination-bar';

describe('PaginationBar', () => {
  it('ne s’affiche pas pour une seule page', () => {
    const { container } = render(
      <PaginationBar page={1} pageSize={12} total={5} onPageChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('navigue entre les pages', async () => {
    const onPageChange = vi.fn();
    render(<PaginationBar page={2} pageSize={12} total={30} onPageChange={onPageChange} />);
    expect(screen.getByText('Page 2 sur 3')).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: /suivant/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('désactive Suivant sur la dernière page', () => {
    render(<PaginationBar page={3} pageSize={12} total={30} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /suivant/i })).toBeDisabled();
  });
});
