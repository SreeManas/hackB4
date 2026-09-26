import { useCallback, useState } from 'react';

type StorageKind = 'local' | 'session';

const getStore = (kind: StorageKind): Storage | null => {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null; // private mode / blocked storage
  }
};

/** useState persisted to localStorage or sessionStorage; fails soft when storage is unavailable. */
export function useStorage<T>(key: string, initialValue: T, kind: StorageKind = 'local') {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = getStore(kind)?.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next: T) => {
      setValue(next);
      try {
        getStore(kind)?.setItem(key, JSON.stringify(next));
      } catch {
        /* quota exceeded or blocked — keep in-memory value */
      }
    },
    [key, kind],
  );

  return [value, set] as const;
}
