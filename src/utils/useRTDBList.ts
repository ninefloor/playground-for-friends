import { realtimeDB } from "@utils/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

export type RTDBList<T> = Record<string, T>;

/**
 * RTDB 경로의 레코드 맵을 구독하는 훅
 * - `items`: 키-값 형태의 전체 맵
 * - `array`: 렌더링 편의를 위한 `{ key, value }[]`
 */
export const useRTDBList = <T = unknown>(path?: string | null) => {
  const [items, setItems] = useState<RTDBList<T>>({});

  useEffect(() => {
    if (!path) return;
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
};
