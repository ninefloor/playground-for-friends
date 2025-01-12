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

import { useEffect, useState } from "react";

interface DecisionData {
  createdAt: number;
  decision: string;
  name: string;
}
export const useUserDecision = (userIds: string[]) => {
  const [decisions, setDecisions] = useState<{
    [key: string]: DecisionData | null;
  }>({});
  const [pushDecisions, setPushDecisions] = useState<{
    [key: string]: (data: DecisionData) => Promise<void> | null;
  }>({});

  useEffect(() => {
    const listeners = userIds.map((userId) => {
      const reference = ref(realtimeDB, `/userDecision/${userId}`);
      const decisionQuery = query(
        reference,
        orderByChild("createdAt"),
        limitToLast(1)
      );

      let isFirstLoad = true;

      const pushData = async (data: DecisionData) => {
        await push(reference, data);
      };

      setPushDecisions((prev) => ({ ...prev, [userId]: pushData }));

      const handleValueChange = (snapshot: DataSnapshot) => {
        if (isFirstLoad) {
          isFirstLoad = false;
          return;
        }

        const data = snapshot.val();
        if (data) {
          const key = Object.keys(data)[0];
          setDecisions((prevDecisions) => ({
            ...prevDecisions,
            [userId]: data[key],
          }));
        } else {
          setDecisions((prevDecisions) => ({
            ...prevDecisions,
            [userId]: null,
          }));
        }
      };

      onValue(decisionQuery, handleValueChange);

      return () => {
        off(decisionQuery, "value", handleValueChange);
      };
    });

    return () => {
      listeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [userIds]);

  return { decisions, pushDecisions };
};
