import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

test('renders login form and allows typing', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Check if elements are present
  const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
  const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
  const loginButton = screen.getByRole('button', { name: /login/i });

  // Simulate user typing
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
  expect(loginButton).toBeInTheDocument();
});
