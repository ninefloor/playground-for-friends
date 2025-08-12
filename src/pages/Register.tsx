import { UserProfileForm } from "@components/user/UserProfileForm";
import { auth, firestore, storage } from "@utils/firebase";
import { userInfoAtom } from "@utils/userInfoAtom";
import imageCompression from "browser-image-compression";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUserInfo = useSetAtom(userInfoAtom);

  const form = useForm<UserFormData>({ mode: "onSubmit" });
  const { handleSubmit, setError } = form;

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      let photoURL: string | undefined;
      if (data.image) {
        const compressedFile = await imageCompression(data.image, {
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
        color: data.color,
      });

      setUserInfo({
        uid: userCred.user.uid,
        nickname: data.nickname,
        photoURL: photoURL ?? "",
        createdAt: Date.now(),
        role: "USER",
        color: data.color,
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

  return (
    <UserProfileForm<UserFormData>
      form={form}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      submitLabel="가입하기"
      onBack={() => navigate(-1)}
      showEmail
      showPassword
    />
  );
};
