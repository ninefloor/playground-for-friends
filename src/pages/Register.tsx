import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { UserItemPreview } from "@components/decisionByAdmin/vote/UserItem";
import { Loading } from "@components/Loading";
import { auth, firestore, storage } from "@utils/firebase";
import imageCompression from "browser-image-compression";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import s from "./Register.module.scss";

const colorPalette: string[] = [
  "#e53e3e", // red-600
  "#dd6b20", // orange-600
  "#d97706", // amber-600
  "#ca8a04", // yellow-600
  "#84cc16", // lime-600
  "#16a34a", // green-600
  "#059669", // emerald-600
  "#0d9488", // teal-600
  "#0891b2", // cyan-600
  "#0284c7", // sky-600
  "#2563eb", // blue-600
  "#4f46e5", // indigo-600
  "#7c3aed", // violet-600
  "#9333ea", // purple-600
  "#c026d3", // fuchsia-600
  "#db2777", // pink-600
  "#e11d48", // rose-600
  "#475569", // slate-600
  "#4b5563", // gray-600
  "#525252", // neutral-600
  "#57534e", // stone-600
  "#2b2b2b", // black
];

export const Register = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>("#2b2b2b");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<UserFormData>({ mode: "onSubmit" });

  const user = watch();

  console.log(user);

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
    <div className={s.container}>
      {isLoading && <Loading />}

      <form
        className={s.formContainer}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={s.uploaderContainer}>
          <label htmlFor="profile" className={s.uploaderLabel}>
            <UserItemPreview
              user={{
                nickname: user.nickname || "nickname",
                color: selectedColor,
                photoURL: previewUrl || "",
                uid: "",
                createdAt: new Date().getTime(),
                role: "USER",
              }}
            />

            <div className={s.placeholder}>이미지 선택</div>
          </label>
          <input
            id="profile"
            type="file"
            accept="image/*"
            onChange={onChangeFile}
            hidden
          />
        </div>

        <Input
          id="email"
          label="이메일"
          type="email"
          {...register("email", {
            required: "이메일을 입력해주세요.",
            pattern: {
              value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
              message: "올바른 이메일 형식이 아닙니다.",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          id="password"
          label="비밀번호"
          type="password"
          placeholder="6자 이상"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 6,
              message: "비밀번호는 6자 이상이어야 합니다.",
            },
          })}
          error={errors.password?.message}
        />

        <Input
          id="nickname"
          label="닉네임"
          type="text"
          placeholder="2자 이상 8자 이하"
          {...register("nickname", {
            required: "닉네임을 입력해주세요.",
            pattern: {
              value: /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z0-9]+$/,
              message: "닉네임은 한글, 영문, 숫자만 입력해주세요.",
            },
            minLength: { value: 2, message: "닉네임은 2자 이상이어야 합니다." },
            maxLength: {
              value: 8,
              message: "닉네임은 8자 이하로 입력해주세요.",
            },
          })}
          error={errors.nickname?.message}
        />

        <div>
          <h2 className={s.desc}>퍼스널 컬러</h2>
          <div className={s.colorGrid}>
            {colorPalette.map((hex) => (
              <button
                key={hex}
                type="button"
                className={`${s.colorSwatch} ${
                  selectedColor === hex ? s.selected : ""
                }`}
                style={{ backgroundColor: hex }}
                aria-label={`select color ${hex}`}
                onClick={() => setSelectedColor(hex)}
                title={hex}
              />
            ))}
          </div>
        </div>

        <div className={s.actions}>
          <Button type="submit">가입하기</Button>
          <Button type="button" variant="tertiary" onClick={() => navigate(-1)}>
            뒤로가기
          </Button>
        </div>
      </form>
    </div>
  );
};
