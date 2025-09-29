import { Button } from "@components/atoms/Buttons";
import { UserCard } from "@components/decisionByAdmin/vote/UserItem";
import { useGetUserData } from "@utils/useGetUserData";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import s from "./AdminMembers.module.scss";

export const AdminMembers = () => {
  const { users, loading } = useGetUserData();
  const navigate = useNavigate();

  const entries = useMemo(() => Object.values(users), [users]);

  return (
    <div className={s.container}>
      <Button
        className={s.backBtn}
        variant="black"
        onClick={() => navigate("/admin")}
        inline
      >
        BACK
      </Button>
      <h2>회원 관리</h2>
      <div className={s.list}>
        {!loading && entries.length === 0 && <div>등록된 회원이 없습니다.</div>}
        {entries.map((user) => {
          return (
            <div key={user.uid} className={s.item}>
              <div className={s.left}>
                <UserCard user={user} />
                <div className={s.name}>{user.nickname}</div>
              </div>
              <Button
                onClick={() => navigate(`/admin/members/${user.uid}`)}
                inline
              >
                수정
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
