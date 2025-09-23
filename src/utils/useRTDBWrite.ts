import { realtimeDB } from "@utils/firebase";
import {
  push as fbPush,
  remove as fbRemove,
  set as fbSet,
  update as fbUpdate,
  ref,
} from "firebase/database";
import { useCallback, useMemo } from "react";

// 객체/배열 내부의 undefined 및 null 값을 재귀적으로 제거
const sanitizeForWrite = <T>(input: T): T => {
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

  if (Array.isArray(input)) {
    const mapped = (input as unknown[])
      .map((item) => sanitizeForWrite(item))
      .filter((item) => item !== undefined && item !== null);
    return mapped as unknown as T;
  }
  if (isObject(input)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      if (v === undefined || v === null) continue;
      out[k] = sanitizeForWrite(v as unknown);
    }
    return out as unknown as T;
  }
  return input;
};

/**
 * Realtime DB 쓰기 헬퍼(선택적 기본 경로 바인딩)
 * - `set(value)` / `update(patch)` / `push(value)`: 기본 경로에 직접 쓰기
 * - `setAt` / `updateAt` / `pushAt`: 기본 경로 + 하위 경로에 쓰기(기본 경로 없으면 절대 경로)
 */
export const useRTDBWrite = (basePath?: string) => {
  const buildPath = useCallback((p?: string) => {
    if (!p && !basePath) throw new Error("RTDB write path is not defined");
    if (!p) return basePath!;
    if (!basePath) return p;
    // 기본 경로와 하위 경로 사이에 슬래시가 하나만 있도록 보정
    return `${basePath.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
  }, [basePath]);

  const set = useCallback(async <Value = unknown>(value: Value): Promise<void> => {
    const r = ref(realtimeDB, buildPath());
    const sanitized = sanitizeForWrite(value);
    await fbSet(r, sanitized as unknown);
  }, [buildPath]);

  const update = useCallback(async <Patch extends Record<string, unknown>>(
    patch: Patch
  ): Promise<void> => {
    const r = ref(realtimeDB, buildPath());
    const sanitized = sanitizeForWrite(patch) as Record<string, unknown>;
    await fbUpdate(r, sanitized);
  }, [buildPath]);

  const push = useCallback(async <Value = unknown>(
    value: Value
  ): Promise<string | null> => {
    const r = ref(realtimeDB, buildPath());
    const sanitized = sanitizeForWrite(value);
    const res = await fbPush(r, sanitized as unknown);
    return res.key;
  }, [buildPath]);

  const setAt = useCallback(async <Value = unknown>(
    path: string,
    value: Value
  ): Promise<void> => {
    const r = ref(realtimeDB, buildPath(path));
    const sanitized = sanitizeForWrite(value);
    await fbSet(r, sanitized as unknown);
  }, [buildPath]);

  const updateAt = useCallback(async <Patch extends Record<string, unknown>>(
    path: string,
    patch: Patch
  ): Promise<void> => {
    const r = ref(realtimeDB, buildPath(path));
    const sanitized = sanitizeForWrite(patch) as Record<string, unknown>;
    await fbUpdate(r, sanitized);
  }, [buildPath]);

  const pushAt = useCallback(async <Value = unknown>(
    path: string,
    value: Value
  ): Promise<string | null> => {
    const r = ref(realtimeDB, buildPath(path));
    const sanitized = sanitizeForWrite(value);
    const res = await fbPush(r, sanitized as unknown);
    return res.key;
  }, [buildPath]);

  const updateMulti = useCallback(async (patch: Record<string, unknown>): Promise<void> => {
    // DB 루트에서 멀티-로케이션 업데이트 수행
    // 주의: 멀티 업데이트는 null을 이용한 삭제를 지원해야 하므로 sanitize를 적용하지 않음
    await fbUpdate(ref(realtimeDB), patch);
  }, []);

  const remove = useCallback(async (): Promise<void> => {
    const r = ref(realtimeDB, buildPath());
    await fbRemove(r);
  }, [buildPath]);

  const removeAt = useCallback(async (path: string): Promise<void> => {
    const r = ref(realtimeDB, buildPath(path));
    await fbRemove(r);
  }, [buildPath]);

  const methods = useMemo(
    () => ({
      set,
      update,
      push,
      setAt,
      updateAt,
      pushAt,
      updateMulti,
      remove,
      removeAt,
    }),
    [set, update, push, setAt, updateAt, pushAt, updateMulti, remove, removeAt]
  );

  return methods;
};
