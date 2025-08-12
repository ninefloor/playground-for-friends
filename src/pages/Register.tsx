import { UserProfileForm } from "@components/user/UserProfileForm";
import { auth, firestore, storage } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import imageCompression from "browser-image-compression";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
 

export const Register = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>("#2b2b2b");
  const setUserInfo = useSetAtom(userInfoAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<UserFormData>({ mode: "onSubmit" });

  const user = watch();

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      let photoURL: string | undefined;
      if (file) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        });
        const storageRef = ref(storage, `profiles/${userCred.user.uid}`);
        await uploadBytes(storageRef, compressedFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(userCred.user, {
        displayName: data.nickname,
        photoURL,
      });

      await setDoc(doc(firestore, "users", userCred.user.uid), {
        nickname: data.nickname,
        photoURL: photoURL ?? null,
        createdAt: Date.now(),
        role: "USER",
        color: selectedColor,
      });

      setUserInfo({
        uid: userCred.user.uid,
        nickname: data.nickname,
        photoURL: photoURL ?? "",
        createdAt: Date.now(),
        role: "USER",
        color: selectedColor,
      });

      navigate("/");
    } catch (error: unknown) {
      const code =
        typeof error === "object" && error && "code" in error
          ? (error as { code?: string }).code
          : undefined;
      if (code === "auth/email-already-in-use") {
        setError(
          "email",
          { message: "이미 사용 중인 이메일입니다." },
          { shouldFocus: true }
        );
        return;
      }
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <UserProfileForm<UserFormData>
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      nicknameValue={user.nickname}
      selectedColor={selectedColor}
      onSelectColor={setSelectedColor}
      previewUrl={previewUrl}
      onChangeFile={onChangeFile}
      isLoading={isLoading}
      submitLabel="가입하기"
      onBack={() => navigate(-1)}
      showEmail
      showPassword
    />
  );
};
