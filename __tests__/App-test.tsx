import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  test('RENDER APP', () => {
    render(<App />);
  });
});

test('renders correctly', async () => {
  // Idiom: no need to capture render output, as we will use `screen` for queries.
  const appScreen = render(<App />);
  appScreen.getByTestId('Login Screen');
  fireEvent.changeText(appScreen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(appScreen.getByLabelText('Password'), 'admin1');

  // // Hint: we can use `getByRole` to find our button with given text.
  fireEvent.press(appScreen.getByRole('button', {name: 'Sign In'}));

  expect(
    await screen.findByRole('header', {name: 'Welcome admin!'}),
  ).toBeTruthy();
});

test('User will see errors for incorrect credentials', async () => {
  const appScreen = render(<App />);
  appScreen.getByTestId('Login Screen');
  fireEvent.changeText(appScreen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(appScreen.getByLabelText('Password'), 'admiadsan1');

  fireEvent.press(appScreen.getByRole('button', {name: 'Sign In'}));

  // Hint: you can use custom Jest Native matcher to check text content.
  expect(await appScreen.findByRole('alert')).toHaveTextContent(
    'Incorrect username or password',
  );

  expect(
    appScreen.getByRole('header', {name: 'Sign in to Example App'}),
  ).toBeTruthy();
  expect(appScreen.getByLabelText('Username')).toBeTruthy();
  expect(appScreen.getByLabelText('Password')).toBeTruthy();
});

test('User can sign in after incorrect attempt', async () => {
  const appScreen = render(<App />);
  appScreen.getByTestId('Login Screen');
  fireEvent.changeText(appScreen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(appScreen.getByLabelText('Password'), 'admiadsan1');

  fireEvent.press(appScreen.getByRole('button', {name: 'Sign In'}));

  // Hint: you can use custom Jest Native matcher to check text content.
  expect(await appScreen.findByRole('alert')).toHaveTextContent(
    'Incorrect username or password',
  );

  fireEvent.changeText(appScreen.getByLabelText('Password'), 'admin1');
  fireEvent.press(appScreen.getByRole('button', {name: 'Sign In'}));

  expect(
    await screen.findByRole('header', {name: 'Welcome admin!'}),
  ).toBeTruthy();
  expect(
    appScreen.queryByRole('header', {name: 'Sign in to Example App'}),
  ).toBeFalsy();
  expect(appScreen.queryByLabelText('Username')).toBeFalsy();
  expect(appScreen.queryByLabelText('Password')).toBeFalsy();
});
