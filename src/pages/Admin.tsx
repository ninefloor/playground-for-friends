import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { sha256 } from "@utils/hash";
import { userInfoAtom } from "@utils/userInfoAtom";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import { useAtomValue } from "jotai";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Admin.module.scss";

export const Admin = () => {
  const navigate = useNavigate();
  const user = useAtomValue(userInfoAtom);
  const { push: pushRoom } = useRTDBWrite("/rooms");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const routeHandler = ({
    currentTarget: { id },
  }: MouseEvent<HTMLButtonElement>) => {
    navigate(`/admin/${id}`);
  };
  return (
    <div className={s.container}>
      <Button className={s.backBtn} variant="black" onClick={() => navigate("/")} inline>
        BACK
      </Button>
      <h1>hello, nine</h1>
      <Button id="vote" onClick={routeHandler}>
        launch Vote
      </Button>
      <Button id="tier" onClick={routeHandler}>
        launch Tier
      </Button>
      <Button id="members" onClick={routeHandler}>
        members
      </Button>

      <div style={{ height: 16 }} />
      <h2>방 생성</h2>
      <div className={s.formContainer}>
        <div className={s.field}>
          <Input
            id="room-title"
            label="방 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="방 제목을 입력하세요"
          />
        </div>
        <div className={s.field}>
          <Input
            label="방 설명"
            id="room-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="방 설명을 입력하세요"
          />
        </div>
        <div className={s.field}>
          <Input
            label="비밀번호"
            id="room-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (없으면 비워두기)"
          />
        </div>
        <Button
          onClick={async () => {
            if (!title.trim()) {
              alert("방 제목을 입력하세요.");
              return;
            }
            setCreating(true);
            try {
              const passwordHash = password ? await sha256(password) : null;
              const key = await pushRoom({
                title: title.trim(),
                description: description.trim() || undefined,
                passwordHash,
                adminUid: user?.uid ?? "",
                createdAt: Date.now(),
                status: "open",
              });
              setTitle("");
              setDescription("");
              setPassword("");
              if (key) navigate(`/room/${key}/admin`);
            } catch {
              alert("방 생성 중 오류가 발생했습니다.");
            } finally {
              setCreating(false);
            }
          }}
          disabled={creating}
        >
          {creating ? "생성 중..." : "방 생성"}
        </Button>
      </div>
    </div>
  );
};
