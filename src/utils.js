import { GAP, ROW_HEIGHT } from './constants.js';

export function calcCols(w, itemSize) {
  const itemCols = Math.max(1, parseInt(itemSize) || 3);
  const colW     = (w - 11 * GAP) / 12;
  const itemW    = itemCols * colW + (itemCols - 1) * GAP;
  return Math.max(1, Math.floor((w + GAP) / (itemW + GAP)));
}

export function calcRows(w, h, itemSize) {
  if (!h || h < ROW_HEIGHT) return 1;
  const itemCols = Math.max(1, parseInt(itemSize) || 3);
  const colW     = (w - 11 * GAP) / 12;
  const itemW    = itemCols * colW + (itemCols - 1) * GAP;
  return Math.max(1, Math.floor((h + GAP) / (itemW + GAP)));
}

export function calcItemWidth(w, itemSize) {
  const itemCols = Math.max(1, parseInt(itemSize) || 3);
  const colW     = (w - 11 * GAP) / 12;
  return itemCols * colW + (itemCols - 1) * GAP;
}

export function getImageUrl(item, hassUrl) {
  const raw = item?.metadata?.images?.[0]?.url
    || item?.image?.url || item?.image || item?.thumbnail || null;
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  return `${hassUrl}/api/music_assistant/image_proxy?url=${encodeURIComponent(raw)}`;
}

export function getUri(item)  { return item?.uri  || item?.item_id || ''; }
export function getName(item) { return item?.name || item?.title   || ''; }
