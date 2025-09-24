import { realtimeDB } from "@utils/firebase";
import { DataSnapshot, off, onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

export type RTDBList<T> = Record<string, T>;

/**
 * ### useRTDBList
 * RTDB 경로의 레코드 맵을 구독하는 훅
 * - `object`: 키-값 형태의 전체 object
 * - `array`: 렌더링 편의를 위한 `value[]`
 * - `loading`: 초기 데이터 로딩 상태
 * - `error`: 에러 발생 시 에러 정보
 */
export const useRTDBList = <T = unknown>(path?: string | null) => {
  const [object, setObject] = useState<RTDBList<T>>({});
  const [isLoading, setIsLoading] = useState<boolean>(!!path);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setIsLoading(false);
      setObject({});
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const reference = ref(realtimeDB, path);
    const handle = (snap: DataSnapshot) => {
      try {
        setObject((snap.val() as RTDBList<T>) ?? {});
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
    () => Object.entries(object).map((item) => item[1]),
    [object]
  );

  return { object, array, isLoading, error };
};
