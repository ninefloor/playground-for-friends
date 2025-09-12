import { realtimeDB } from "@utils/firebase";
import { push as fbPush, ref, set as fbSet, update as fbUpdate } from "firebase/database";

/**
 * Realtime DB write helpers bound to an optional base path.
 * - set(value) / update(patch) / push(value) use the base path directly.
 * - setAt/ updateAt/ pushAt write to base + relative path, or to absolute when base is omitted.
 */
export function useRTDBWrite(basePath?: string) {
  const buildPath = (p?: string) => {
    if (!p && !basePath) throw new Error("RTDB write path is not defined");
    if (!p) return basePath!;
    if (!basePath) return p;
    // ensure exactly one slash between base and child
    return `${basePath.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
  };

  async function set<Value = unknown>(value: Value): Promise<void> {
    const r = ref(realtimeDB, buildPath());
    await fbSet(r, value as unknown);
  }

  async function update<Patch extends Record<string, unknown>>(patch: Patch): Promise<void> {
    const r = ref(realtimeDB, buildPath());
    await fbUpdate(r, patch as Record<string, unknown>);
  }

  async function push<Value = unknown>(value: Value): Promise<string | null> {
    const r = ref(realtimeDB, buildPath());
    const res = await fbPush(r, value as unknown);
    return res.key;
  }

  async function setAt<Value = unknown>(path: string, value: Value): Promise<void> {
    const r = ref(realtimeDB, buildPath(path));
    await fbSet(r, value as unknown);
  }

  async function updateAt<Patch extends Record<string, unknown>>(path: string, patch: Patch): Promise<void> {
    const r = ref(realtimeDB, buildPath(path));
    await fbUpdate(r, patch as Record<string, unknown>);
  }

  async function pushAt<Value = unknown>(path: string, value: Value): Promise<string | null> {
    const r = ref(realtimeDB, buildPath(path));
    const res = await fbPush(r, value as unknown);
    return res.key;
  }

  async function updateMulti(patch: Record<string, unknown>): Promise<void> {
    // multi-location update at DB root
    await fbUpdate(ref(realtimeDB), patch);
  }

  return { set, update, push, setAt, updateAt, pushAt, updateMulti };
}
