import { realtimeDB } from "@utils/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

export type RTDBList<T> = Record<string, T>;

/**
 * RTDB 경로의 레코드 맵을 구독하는 훅
 * - `items`: 키-값 형태의 전체 맵
 * - `array`: 렌더링 편의를 위한 `{ key, value }[]`
 * - `loading`: 초기 데이터 로딩 상태
 * - `error`: 에러 발생 시 에러 정보
 */
export const useRTDBList = <T = unknown>(path?: string | null) => {
  const [items, setItems] = useState<RTDBList<T>>({});
  const [isLoading, setIsLoading] = useState<boolean>(!!path);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setIsLoading(false);
      setItems({});
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const reference = ref(realtimeDB, path);
    const handle = (snap: DataSnapshot) => {
      try {
        setItems((snap.val() as RTDBList<T>) ?? {});
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("데이터 처리 중 오류가 발생했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    const errorHandle = (err: Error) => {
      setError(err);
      setIsLoading(false);
    };

    onValue(reference, handle, errorHandle);
    return () => off(reference, "value", handle);
  }, [path]);

  const array = useMemo(
    () => Object.entries(items).map(([key, value]) => ({ key, value })),
    [items]
  );

  return { items, array, isLoading, error };
};
