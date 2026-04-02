export let _lastDetectedLayout = 'unknown';

export function setLastDetectedLayout(value) {
  _lastDetectedLayout = value;
}

export function detectLayout(el) {
  let node = el;
  while (node) {
    const tag = node.tagName?.toLowerCase();
    if (tag === 'hui-section')      return 'sections';
    if (tag === 'hui-masonry-view') return 'masonry';
    node = node.parentElement ?? node.getRootNode()?.host;
  }
  return 'unknown';
}
