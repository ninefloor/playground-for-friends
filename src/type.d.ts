interface UserInfo {
  uid: string;
  nickname: string;
  photoURL: string;
  createdAt: number;
  role: "USER" | "ADMIN";
  color: string;
  customOrder?: number;
}

interface UserFormData {
  email: string;
  nickname: string;
  password: string;
  image?: File | null;
  color: string;
}

type UserEditFormData = Omit<UserFormData, "password">;

type AdminUserEditFormData = UserEditFormData & {
  role: "USER" | "ADMIN";
  customOrder?: number;
};

// RTDB 공용 타입
type Decision = "L" | "R" | "GIVE_UP" | "";

interface ReactionPayload {
  emoji: string;
  createdAt: number;
  duration: number;
}

type ReactionQueue = Record<string, ReactionPayload>;

interface RoomMeta {
  title: string;
  description?: string;
  passwordHash: string | null;
  adminUid: string;
  createdAt: number;
  status: "open" | "closed";
}

interface RoomParticipant {
  uid: string;
  nickname: string;
  photoURL: string;
  color: string;
  role: "ADMIN" | "PARTICIPANT";
  joinedAt: number;
  decision: Decision;
  customOrder?: number;
}

type RTDBMap<T> = Record<string, T>;
