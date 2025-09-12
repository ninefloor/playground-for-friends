import { realtimeDB } from "@utils/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export function useRTDBValue<T = unknown>(path?: string | null) {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    if (!path) return;
    const reference = ref(realtimeDB, path);
    const handle = (snap: DataSnapshot) => {
      setValue((snap.val() as T) ?? null);
    };
    onValue(reference, handle);
    return () => off(reference, "value", handle);
  }, [path]);

  return { value };
}
