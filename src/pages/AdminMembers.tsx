import { Button } from "@components/atoms/Buttons";
import { UserItemPreview } from "@components/decisionByAdmin/vote/UserItem";
import { useGetUserData } from "@utils/useGetUserData";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import s from "./AdminMembers.module.scss";

export const AdminMembers = () => {
  const { users, loading } = useGetUserData();
  const navigate = useNavigate();

  const entries = useMemo(() => Object.entries(users ?? {}), [users]);

  return (
    <div className={s.container}>
      <Button className={s.backBtn} variant="black" onClick={() => navigate("/admin")} inline>
        BACK
      </Button>
      <h2>회원 관리</h2>
      <div className={s.list}>
        {!loading && entries.length === 0 && <div>등록된 회원이 없습니다.</div>}
        {entries.map(([uid, u]) => {
          const info: BasicUser = {
            nickname: (u as any)?.nickname ?? "(미정)",
            photoURL: (u as any)?.photoURL ?? "",
            color: (u as any)?.color ?? "#2b2b2b",
          };
          return (
            <div key={uid} className={s.item}>
              <div className={s.left}>
                <UserItemPreview user={info} />
                <div className={s.name}>{info.nickname}</div>
              </div>
              <Button onClick={() => navigate(`/admin/members/${uid}`)} inline>
                수정
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
