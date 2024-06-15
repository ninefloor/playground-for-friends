import { atom, AtomEffect } from "recoil";

const initState: UserInfo = {
  userId: null,
  name: null,
};

const sessionStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const savedValue =
      typeof window !== "undefined"
        ? sessionStorage.getItem(key)
        : JSON.stringify(initState);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? sessionStorage.removeItem(key)
        : sessionStorage.setItem(key, JSON.stringify(newValue));
    });
  };

const userInfo = atom<UserInfo>({
  key: "userInfo",
  default: initState,
  effects: [sessionStorageEffect("userInfo")],
});

export default userInfo;
