import { UserProfileForm } from "@components/user/UserProfileForm";
import { firestore, storage } from "@utils/firebase";
import { useHeader } from "@utils/useHeader";
import imageCompression from "browser-image-compression";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export const AdminMemberEdit = () => {
  useHeader({
    title: "회원 정보 수정",
  });
  const navigate = useNavigate();
  const { uid } = useParams();
  const [initial, setInitial] = useState<Partial<UserInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminUserEditFormData>({ mode: "onSubmit" });
  const { handleSubmit, setValue } = form;

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      const snap = await getDoc<Partial<UserInfo>, Partial<UserInfo>>(
        doc(firestore, "users", uid)
      );
      const data = snap.data() ?? {};
      setInitial({
        uid,
        nickname: data.nickname ?? "",
        photoURL: data.photoURL ?? "",
        color: data.color ?? "#2b2b2b",
        role: data.role ?? "USER",
        createdAt: data.createdAt ?? Date.now(),
        customOrder: data?.customOrder ?? undefined,
      });
      setValue("nickname", data.nickname ?? "");
      setValue("color", data.color ?? "#2b2b2b");
      setValue("role", data.role ?? "USER");
      if (data?.customOrder !== undefined)
        setValue("customOrder", Number(data.customOrder));
    };
    load();
  }, [uid, setValue]);

  const initialPhoto = useMemo(() => initial?.photoURL ?? "", [initial]);

  const onSubmit = async (data: AdminUserEditFormData) => {
    if (!uid) return;
    try {
      setIsLoading(true);
      let photoURL: string | undefined | null = initial?.photoURL ?? null;
      if (data.image) {
        const compressedFile = await imageCompression(data.image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        });
        const ref = storageRef(storage, `profiles/${uid}`);
        await uploadBytes(ref, compressedFile);
        photoURL = await getDownloadURL(ref);
      }

      // Firestore 사용자 문서 업데이트 (Auth 프로필은 타 사용자 편집 불가)
      await updateDoc(doc(firestore, "users", uid), {
        nickname: data.nickname,
        photoURL: photoURL ?? null,
        color: data.color,
        role: data.role,
        ...(data.customOrder !== undefined
          ? { customOrder: data.customOrder }
          : {}),
      });

      navigate("/admin/members");
    } catch {
      alert("회원 정보 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserProfileForm
      isEdit={true}
      adminMode={true}
      form={form}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onBack={() => navigate(-1)}
      initialPhotoURL={initialPhoto}
    />
  );
};
