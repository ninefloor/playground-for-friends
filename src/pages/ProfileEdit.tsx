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

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    currentUser?.color ?? "#2b2b2b"
  );

  const form = useForm<UserEditFormData>({
    mode: "onSubmit",
    defaultValues: {
      email: currentUser ? undefined : undefined,
      nickname: currentUser?.nickname ?? "",
      color: currentUser?.color ?? "#2b2b2b",
    },
  });
  const { handleSubmit, setValue, watch } = form;
  const formValues = watch();

  useEffect(() => {
    if (currentUser) {
      setValue("nickname", currentUser.nickname);
      setValue("color", currentUser.color);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] ?? null;
    setFile(newFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: UserEditFormData) => {
    if (!auth.currentUser || !currentUser) return;
    try {
      setIsLoading(true);

      let photoURL: string | undefined | null = currentUser.photoURL ?? null;
      if (file) {
        const compressedFile = await imageCompression(file, {
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
        color: selectedColor,
      });

      // 전역 상태 갱신
      setUserInfo({
        ...currentUser,
        nickname: data.nickname,
        photoURL: photoURL ?? "",
        color: selectedColor,
      });

      navigate("/");
    } catch (e) {
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserProfileForm<UserEditFormData>
      form={form}
      onSubmit={handleSubmit(onSubmit)}
      selectedColor={selectedColor}
      onSelectColor={(hex) => {
        setSelectedColor(hex);
        setValue("color", hex);
      }}
      previewUrl={previewUrl}
      onChangeFile={onChangeFile}
      isLoading={isLoading}
      submitLabel="수정하기"
      onBack={() => navigate(-1)}
      showEmail={false}
      showPassword={false}
    />
  );
};
