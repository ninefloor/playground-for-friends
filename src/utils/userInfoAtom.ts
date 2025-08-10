import { atomWithStorage, createJSONStorage } from "jotai/utils";

const initState: UserInfo | null = null;

export const userInfoAtom = atomWithStorage<UserInfo | null>(
  "userInfo",
  initState,
  createJSONStorage(() => sessionStorage)
);
