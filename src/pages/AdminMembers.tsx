import { Button } from "@components/atoms/Buttons";
import { ItemGrid } from "@components/atoms/ItemGrid";
import { UserCard } from "@components/decisionByAdmin/vote/UserItem";
import { useGetUserData } from "@utils/useGetUserData";
import { useHeader } from "@utils/useHeader";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import s from "./AdminMembers.module.scss";

export const AdminMembers = () => {
  useHeader({
    title: "회원 관리",
  });

  const { users, loading } = useGetUserData();
  const navigate = useNavigate();

  const entries = useMemo(() => Object.values(users), [users]);

  return (
    <div className={s.container}>
      <ItemGrid className={s.list}>
        {!loading && entries.length === 0 && <div>등록된 회원이 없습니다.</div>}
        {entries.map((user) => {
          return (
            <ItemGrid.Item key={user.uid} className={s.item}>
              <UserCard user={user} />
              <Button
                onClick={() => navigate(`/admin/members/${user.uid}`)}
                inline
              >
                수정
              </Button>
            </ItemGrid.Item>
          );
        })}
      </ItemGrid>
    </div>
  );
};
