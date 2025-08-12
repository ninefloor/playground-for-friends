import { UserProfileForm } from "@components/user/UserProfileForm";
import { auth, firestore, storage } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import imageCompression from "browser-image-compression";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const currentUser = useAtomValue(userInfoAtom);
  const setUserInfo = useSetAtom(userInfoAtom);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserEditFormData>({
    mode: "onSubmit",
    defaultValues: {
      email: currentUser ? undefined : undefined,
      nickname: currentUser?.nickname ?? "",
      color: currentUser?.color ?? "#2b2b2b",
    },
  });
  const { handleSubmit, setValue } = form;

  useEffect(() => {
    if (currentUser) {
      setValue("nickname", currentUser.nickname);
      setValue("color", currentUser.color);
    }
  }, [currentUser, setValue]);

  // preview 관리는 폼 컴포넌트 내부에서 처리

  const onSubmit = async (data: UserEditFormData) => {
    if (!auth.currentUser || !currentUser) return;
    try {
      setIsLoading(true);

      let photoURL: string | undefined | null = currentUser.photoURL ?? null;
      if (data.image) {
        const compressedFile = await imageCompression(data.image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        });
        const storageRef = ref(storage, `profiles/${currentUser.uid}`);
        await uploadBytes(storageRef, compressedFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Firebase Auth 프로필 업데이트
      await updateProfile(auth.currentUser, {
        displayName: data.nickname,
        photoURL: photoURL ?? undefined,
      });

      // Firestore 사용자 문서 업데이트
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        nickname: data.nickname,
        photoURL: photoURL ?? null,
        color: data.color,
      });

      // 전역 상태 갱신
      setUserInfo({
        ...currentUser,
        nickname: data.nickname,
        photoURL: photoURL ?? "",
        color: data.color,
      });

      navigate("/");
    } catch {
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserProfileForm
      isEdit={true}
      form={form}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onBack={() => navigate(-1)}
      initialPhotoURL={currentUser?.photoURL}
    />
  );
};
