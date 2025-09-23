import { realtimeDB } from "@utils/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

/**
 * RTDB 단일 경로의 값을 구독하는 훅
 * - `path`가 falsy이면 구독하지 않음
 * - `loaded`: 최초 스냅샷을 수신했는지 여부(삭제/미생성 null과 초기 로딩 null 구분용)
 */
export const useRTDBValue = <T = unknown>(path?: string | null) => {
  const [value, setValue] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!!path);

  useEffect(() => {
    if (!path) {
      setIsLoading(false);
      setValue(null);
      return;
    }

    // path가 변경되면 즉시 로딩 상태로 전환
    setIsLoading(true);
    setValue(null);

    const reference = ref(realtimeDB, path);
    const handle = (snap: DataSnapshot) => {
      setValue((snap.val() as T) ?? null);
      setIsLoading(false);
    };

    const errorHandle = (err: Error) => {
      console.error("RTDB Value Error:", err);
      setIsLoading(false);
    };

    onValue(reference, handle, errorHandle);
    return () => off(reference, "value", handle);
  }, [path]);

  return { value, isLoading };
};
