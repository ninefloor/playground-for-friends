import { realtimeDB } from "@utils/firebase";
import {
  onValue,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
  off,
  DataSnapshot,
} from "firebase/database";

import { useCallback, useEffect, useState } from "react";

export const useRealtimeDB = (src: string, isLoad: boolean = true) => {
  const [data, setData] = useState(null);
  const reference = ref(realtimeDB, src);

  useEffect(() => {
    const lastOfOneQuery = query(
      reference,
      orderByChild("createdAt"),
      limitToLast(1)
    );

    let isFirstLoad = isLoad;

    const handleValueChange = (snapshot: DataSnapshot) => {
      if (isFirstLoad) {
        isFirstLoad = false;
        return;
      }

      const res = snapshot.val();
      if (res) {
        const data = res[Object.keys(res)[0]];
        setData(data);
      }
    };

    onValue(lastOfOneQuery, handleValueChange);

    return () => {
      off(lastOfOneQuery, "value", handleValueChange);
    };
  }, []);

  const pushData = useCallback(
    async (data: unknown) => {
      await push(reference, data);
    },
    [reference]
  );

  return { data, push: pushData };
};
