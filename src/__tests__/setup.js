import { vi } from 'vitest';

// Mock ResizeObserver (used in card.js)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Register stub HA custom elements to prevent "not defined" errors
['ha-form', 'ha-entity-picker', 'ha-card'].forEach(tag => {
  if (!customElements.get(tag)) {
    customElements.define(tag, class extends HTMLElement {});
  }
});

// Helper: flush promises (useful for async tests)
global.flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));
