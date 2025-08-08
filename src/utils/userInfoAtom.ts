import { atomWithStorage, createJSONStorage } from "jotai/utils";

const initState: UserInfo = {
  userId: null,
  name: null,
};

const userInfo = atomWithStorage<UserInfo>(
  "userInfo",
  initState,
  createJSONStorage(() => sessionStorage)
);

export default userInfo;
