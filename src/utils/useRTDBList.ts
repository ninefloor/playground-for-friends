import { realtimeDB } from "@utils/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

export type RTDBList<T> = Record<string, T>;

export function useRTDBList<T = unknown>(path: string) {
  const [items, setItems] = useState<RTDBList<T>>({});

  useEffect(() => {
    const reference = ref(realtimeDB, path);
    const handle = (snap: DataSnapshot) => {
      setItems((snap.val() as RTDBList<T>) ?? {});
    };
    onValue(reference, handle);
    return () => off(reference, "value", handle);
  }, [path]);

  const array = useMemo(
    () => Object.entries(items).map(([key, value]) => ({ key, value })),
    [items]
  );

  return { items, array };
}

