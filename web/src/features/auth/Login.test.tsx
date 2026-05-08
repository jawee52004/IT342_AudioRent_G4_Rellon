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
  const emailInput = screen.getByPlaceholderName(/email/i);
  const passwordInput = screen.getByPlaceholderName(/password/i);
  const loginButton = screen.getByRole('button', { name: /login/i });

  // Simulate user typing
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
  expect(loginButton).toBeInTheDocument();
});
