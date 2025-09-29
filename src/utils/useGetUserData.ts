import { firestore } from "@utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useGetUserData = () => {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollectionRef = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);
        const users = Object.fromEntries(
          usersSnapshot.docs.map((doc) => [doc.id, doc.data()])
        );
        setUsers(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, loading };
};
