import { useSyncExternalStore } from 'react';

let activeSectionIndex = 0;
const listeners = new Set<() => void>();

export function setActiveSectionIndex(index: number) {
  if (activeSectionIndex === index) return;
  activeSectionIndex = index;
  listeners.forEach((listener) => listener());
}

export function getActiveSectionIndex() {
  return activeSectionIndex;
}

export function useActiveSectionIndex() {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    getActiveSectionIndex,
    () => 0,
  );
}

/** Per-section subscription — React bails out when this section's active state is unchanged. */
export function useIsSectionActive(index: number) {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => getActiveSectionIndex() === index,
    () => index === 0,
  );
}
