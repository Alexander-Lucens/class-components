import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage', () => {
  const renderNotFoundPage = () => {
    return render(
      <NotFoundPage />
    );
  };

  it('renders 404 page with error message', () => {
    renderNotFoundPage();

    const heading = screen.getByText(/404 - Page Not Found/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays friendly error message', () => {
    renderNotFoundPage();

    const message = screen.getByText(/the page you're looking for doesn't exist/i);
    expect(message).toBeInTheDocument();
  });

  it('renders back to home button', () => {
    renderNotFoundPage();

    const button = screen.getByRole('button', { name: /Back to Home/i });
    expect(button).toBeInTheDocument();
  });

  it('renders header with navigation', () => {
    renderNotFoundPage();

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();

    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();
  });

  it('button is clickable', async () => {
    renderNotFoundPage();

    const button = screen.getByRole('button', { name: /Back to Home/i });
    await userEvent.click(button);

    // Button should be clickable without errors
    expect(button).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    renderNotFoundPage();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    const section = main.querySelector('.results-panel');
    expect(section).toBeInTheDocument();
  });
});
