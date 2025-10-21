import avatar from "@assets/images/avatar.svg";
import { ContextMenu } from "@components/atoms/ContextMenu";
import { transition } from "@ssgoi/react";
import { fly } from "@ssgoi/react/transitions";
import { useRTDBList } from "@utils/useRTDBList";
import { useRTDBWrite } from "@utils/useRTDBWrite";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import s from "./UserItem.module.scss";

type BasicUser = Pick<UserInfo, "nickname" | "photoURL" | "color">;
interface UserCardProps {
  user: BasicUser;
}

interface ReactionBubbleProps {
  payload: ReactionPayload;
}

const ReactionBubble: FC<ReactionBubbleProps> = ({ payload }) => {
  const randomOffset = useMemo(() => Math.random() * 40 - 20, []);

  return (
    <div
      className={s.reactionBubble}
      style={
        {
          "--random-x": `${randomOffset}px`,
          animationDuration: `${payload.duration}ms`,
        } as React.CSSProperties
      }
    >
      <span>{payload.emoji}</span>
    </div>
  );
};

export const UserCard = ({ user }: UserCardProps) => {
  const { nickname } = user;

  const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nickname);

  return (
    <div className={s.decisionContainer}>
      <div
        className={s.user}
        style={{
          borderColor: user.color,
        }}
      >
        {user.photoURL ? (
          <div
            className={s.userImage}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          />
        ) : (
          <img className={s.userImage} src={avatar} alt="avatar" />
        )}
      </div>
      <div className={`${s.text} ${isIncludeKorean ? s.korean : ""}`}>
        {nickname}
      </div>
    </div>
  );
};

interface AdminBoardUserCardProps {
  roomId: string;
  uid: string;
  user: RoomParticipant;
}

export const WaitingUserCard = ({
  roomId,
  uid,
  user,
}: AdminBoardUserCardProps) => {
  const basePath = `/roomsParticipants/${roomId}/${uid}`;
  const writer = useRTDBWrite(basePath);
  const { nickname } = user;
  const cardTransition = transition({
    key: "user-card",
    ...fly({
      opacity: 0,
      x: 0,
      y: 10,
      spring: {
        stiffness: 500,
        damping: 30,
      },
    }),
  });

  const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nickname);

  const setDecision = useCallback(
    async (value: Decision) => {
      await writer.setAt("decision", value);
    },
    [writer]
  );

  const kick = useCallback(async () => {
    await writer.remove();
  }, [writer]);

  const menus = useMemo(
    () => [
      { key: "L", label: "L", onSelect: () => setDecision("L") },
      { key: "R", label: "R", onSelect: () => setDecision("R") },
      {
        key: "GIVE_UP",
        label: "GIVE UP",
        onSelect: () => setDecision("GIVE_UP"),
      },
      { key: "CLEAR", label: "CLEAR", onSelect: () => setDecision("") },
      { key: "KICK", label: "KICK", onSelect: kick, danger: true },
    ],
    [setDecision, kick]
  );

  return (
    <div className={s.container} ref={cardTransition}>
      <div className={s.user}>
        {user.photoURL ? (
          <div
            className={s.userImage}
            style={{
              backgroundImage: `url(${user.photoURL})`,
            }}
          />
        ) : (
          <img className={s.userImage} src={avatar} alt="avatar" />
        )}
        <div
          className={s.textBg}
          style={{
            background: `linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, ${user.color} 100%)`,
          }}
        />
        <div className={`${s.text} ${isIncludeKorean ? s.korean : ""}`}>
          {nickname}
        </div>
      </div>
      <ContextMenu menus={menus} className={s.contextMenu} />
    </div>
  );
};

interface DecisionUserCardProps extends AdminBoardUserCardProps {
  x?: number;
  y?: number;
}

export const DecisionUserCard = memo(
  ({ roomId, uid, user, x, y }: DecisionUserCardProps) => {
    const basePath = `/roomsParticipants/${roomId}/${uid}`;
    const writer = useRTDBWrite(basePath);
    const reactionWriter = useRTDBWrite(`/roomsReactions/${roomId}/${uid}`);
    const { nickname } = user;
    const { object: reactionQueue } = useRTDBList<ReactionPayload>(
      `/roomsReactions/${roomId}/${uid}`
    );
    const reactionEntries = useMemo(() => {
      return Object.entries(reactionQueue ?? {})
        .filter((entry): entry is [string, ReactionPayload] => {
          const payload = entry[1];
          return !!payload?.emoji;
        })
        .sort((a, b) => a[1].createdAt - b[1].createdAt);
    }, [reactionQueue]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
      new Map()
    );

    useEffect(() => {
      const timers = timersRef.current;

      reactionEntries.forEach(([key, payload]) => {
        if (timers.has(key)) return;

        const elapsed = Date.now() - payload.createdAt;
        const remaining = Math.max(payload.duration - elapsed, 0);

        if (remaining === 0) {
          void reactionWriter.removeAt(key);
          return;
        }

        const timer = setTimeout(() => {
          void reactionWriter.removeAt(key);
          timers.delete(key);
        }, remaining);

        timers.set(key, timer);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
      };
    }, [reactionEntries, reactionWriter]);

    const setDecision = useCallback(
      async (value: Decision) => {
        await writer.setAt("decision", value);
      },
      [writer]
    );

    const kick = useCallback(async () => {
      await writer.remove();
    }, [writer]);

    const menus = useMemo(
      () => [
        { key: "L", label: "L", onSelect: () => setDecision("L") },
        { key: "R", label: "R", onSelect: () => setDecision("R") },
        {
          key: "GIVE_UP",
          label: "GIVE UP",
          onSelect: () => setDecision("GIVE_UP"),
        },
        { key: "CLEAR", label: "CLEAR", onSelect: () => setDecision("") },
        { key: "KICK", label: "KICK", onSelect: kick, danger: true },
      ],
      [setDecision, kick]
    );

    const isIncludeKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(nickname);
    const decisionColor =
      user.decision === "L"
        ? "#ec4758"
        : user.decision === "R"
        ? "#1a7bb9"
        : null;
    return (
      <div
        className={s.decisionContainer}
        style={x && y ? { transform: `translate(${x}px, ${y}px)` } : {}}
      >
        <div
          className={s.user}
          style={{
            borderColor: user.color,
            boxShadow: `0 0 12px 0 ${decisionColor ?? user.color}`,
          }}
        >
          {user.photoURL ? (
            <div
              className={s.userImage}
              style={{
                backgroundImage: `url(${user.photoURL})`,
              }}
            />
          ) : (
            <img className={s.userImage} src={avatar} alt="avatar" />
          )}
          {user.decision === "GIVE_UP" && (
            <div className={s.giveUp}>GIVE UP</div>
          )}
        </div>
        <div className={`${s.text} ${isIncludeKorean ? s.korean : ""}`}>
          {nickname}
        </div>
        <div className={s.reactionsContainer}>
          {reactionEntries.map(([key, payload]) => (
            <ReactionBubble key={key} payload={payload} />
          ))}
        </div>
        <ContextMenu menus={menus} className={s.contextMenu} />
      </div>
    );
  }
);
