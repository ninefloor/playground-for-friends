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

// RTDB shared types
type Decision = "L" | "R" | "";

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
}

type RTDBMap<T> = Record<string, T>;
