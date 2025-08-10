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
