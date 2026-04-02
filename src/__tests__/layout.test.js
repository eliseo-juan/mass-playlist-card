import { describe, it, expect, beforeEach } from 'vitest';
import { detectLayout, setLastDetectedLayout, _lastDetectedLayout } from '../layout.js';

// Register custom elements for layout detection
if (!customElements.get('hui-section')) {
  customElements.define('hui-section', class extends HTMLElement {});
}
if (!customElements.get('hui-masonry-view')) {
  customElements.define('hui-masonry-view', class extends HTMLElement {});
}

// ─── detectLayout ─────────────────────────────────────────────────────────────

describe('detectLayout', () => {
  it('returns "sections" when ancestor tag is hui-section', () => {
    const section = document.createElement('hui-section');
    const child   = document.createElement('div');
    section.appendChild(child);
    document.body.appendChild(section);

    expect(detectLayout(child)).toBe('sections');

    document.body.removeChild(section);
  });

  it('returns "masonry" when ancestor tag is hui-masonry-view', () => {
    const masonry = document.createElement('hui-masonry-view');
    const child   = document.createElement('div');
    masonry.appendChild(child);
    document.body.appendChild(masonry);

    expect(detectLayout(child)).toBe('masonry');

    document.body.removeChild(masonry);
  });

  it('returns "unknown" when no known ancestor is found', () => {
    const div   = document.createElement('div');
    const inner = document.createElement('span');
    div.appendChild(inner);
    document.body.appendChild(div);

    expect(detectLayout(inner)).toBe('unknown');

    document.body.removeChild(div);
  });

  it('returns "unknown" for a detached element', () => {
    const el = document.createElement('div');
    expect(detectLayout(el)).toBe('unknown');
  });

  it('detects "sections" through shadow DOM using getRootNode().host', () => {
    // Create a hui-section host that contains a shadow-DOM child
    const section = document.createElement('hui-section');
    document.body.appendChild(section);

    // Create a custom element whose shadow root contains the element under test
    const host   = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const inner  = document.createElement('div');
    shadow.appendChild(inner);
    section.appendChild(host);

    // inner's parentElement is null (inside shadow), so traversal uses getRootNode().host
    expect(detectLayout(inner)).toBe('sections');

    document.body.removeChild(section);
  });

  it('detects "masonry" through shadow DOM using getRootNode().host', () => {
    const masonry = document.createElement('hui-masonry-view');
    document.body.appendChild(masonry);

    const host   = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const inner  = document.createElement('div');
    shadow.appendChild(inner);
    masonry.appendChild(host);

    expect(detectLayout(inner)).toBe('masonry');

    document.body.removeChild(masonry);
  });
});

// ─── setLastDetectedLayout ────────────────────────────────────────────────────

describe('setLastDetectedLayout', () => {
  beforeEach(() => {
    // Reset to known state before each test
    setLastDetectedLayout('unknown');
  });

  it('updates _lastDetectedLayout to "sections"', async () => {
    setLastDetectedLayout('sections');
    // Re-import to get updated binding value
    const mod = await import('../layout.js');
    expect(mod._lastDetectedLayout).toBe('sections');
  });

  it('updates _lastDetectedLayout to "masonry"', async () => {
    setLastDetectedLayout('masonry');
    const mod = await import('../layout.js');
    expect(mod._lastDetectedLayout).toBe('masonry');
  });

  it('updates _lastDetectedLayout to "unknown"', async () => {
    setLastDetectedLayout('sections');
    setLastDetectedLayout('unknown');
    const mod = await import('../layout.js');
    expect(mod._lastDetectedLayout).toBe('unknown');
  });
});
