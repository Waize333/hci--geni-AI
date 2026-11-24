import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DEPARTMENTS, childrenOf } from '@meridian/taxonomy';
import { MenuLab } from '../src/lab/MenuLab';

beforeEach(() => {
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: false, media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn()
  }));
});

afterEach(() => window.history.replaceState(null, '', '/'));

it.each(['A', 'B', 'C', 'D', 'E', 'F'])('opens menu %s from a homepage preview link', (id) => {
  window.history.replaceState(null, '', `/lab?menu=${id}`);
  render(<MenuLab />);
  expect(screen.getByLabelText('Menu')).toHaveValue(id);
  expect(screen.getByTestId(`menu-${id.toLowerCase()}`)).toBeInTheDocument();
});

it.each(['', 'unknown', 'b'])('uses the default layout for an invalid menu parameter %s', (id) => {
  window.history.replaceState(null, '', `/lab?menu=${id}`);
  render(<MenuLab />);
  expect(screen.getByLabelText('Menu')).toHaveValue('A');
});

it('restarts the selected layout and clears the previous navigation events', () => {
  window.history.replaceState(null, '', '/lab?menu=B');
  render(<MenuLab />);
  const department = DEPARTMENTS[0]!;
  const collection = childrenOf(department.id)[0]!;
  fireEvent.click(document.querySelector(`[data-node-id="${department.id}"]`)!);
  fireEvent.click(document.querySelector(`[data-node-id="${collection.id}"]`)!);
  expect(screen.getByRole('complementary', { name: 'Lab events' })).toHaveTextContent(collection.label);
  fireEvent.click(screen.getByRole('button', { name: 'Restart preview' }));
  expect(screen.getByLabelText('Menu')).toHaveValue('B');
  expect(document.querySelector(`[data-node-id="${department.id}"]`)).toHaveAttribute('aria-expanded', 'false');
  expect(document.querySelector(`[data-node-id="${collection.id}"]`)).toBeNull();
  expect(screen.getByRole('complementary', { name: 'Lab events' })).not.toHaveTextContent(collection.label);
});

it('browser Back closes the product without navigating the obscured menu', () => {
  render(<MenuLab />);
  fireEvent.change(screen.getByLabelText('Menu'), { target: { value: 'B' } });
  const department = DEPARTMENTS[0]!;
  const collection = childrenOf(department.id)[0]!;
  const leaf = childrenOf(collection.id)[0]!;
  const click = (id: string) => fireEvent.click(document.querySelector(`[data-node-id="${id}"]`)!);
  click(department.id); click(collection.id); click(leaf.id);
  expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  expect(screen.getByTestId('menu-b')).toHaveAttribute('inert');
  fireEvent.popState(window);
  expect(screen.queryByTestId('product-detail')).not.toBeInTheDocument();
  expect(document.querySelector(`[data-node-id="${leaf.id}"]`)).not.toBeNull();
});
