import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { UserItemPreview } from "@components/decisionByAdmin/vote/UserItem";
import { Loading } from "@components/Loading";
import s from "@pages/Register.module.scss";
import type { BaseSyntheticEvent, ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

const colorPalette: string[] = [
  "#e53e3e",
  "#dd6b20",
  "#d97706",
  "#ca8a04",
  "#84cc16",
  "#16a34a",
  "#059669",
  "#0d9488",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#db2777",
  "#e11d48",
  "#475569",
  "#4b5563",
  "#525252",
  "#57534e",
  "#2b2b2b",
];

type Props =
  | {
      isEdit: false;
      form: UseFormReturn<UserFormData>;
      onSubmit: (e?: BaseSyntheticEvent) => void;
      isLoading?: boolean;
      submitLabel: string;
      onBack: () => void;
      initialPhotoURL?: string;
    }
  | {
      isEdit: true;
      form: UseFormReturn<UserEditFormData>;
      onSubmit: (e?: BaseSyntheticEvent) => void;
      isLoading?: boolean;
      submitLabel: string;
      onBack: () => void;
      initialPhotoURL?: string;
    };

export const UserProfileForm = (props: Props) => {
  const {
    form,
    onSubmit,
    isLoading,
    submitLabel,
    onBack,
    // isEdit 으로 분기 처리
    initialPhotoURL,
  } = props;

  const isEdit = props.isEdit;
  const regForm = (isEdit ? null : (form as UseFormReturn<UserFormData>));
  const editForm = (isEdit ? (form as UseFormReturn<UserEditFormData>) : null);
  const nicknameValue = isEdit
    ? (editForm!.watch("nickname") ?? "")
    : (regForm!.watch("nickname") ?? "");
  const selectedColor = isEdit
    ? (editForm!.watch("color") ?? "#2b2b2b")
    : (regForm!.watch("color") ?? "#2b2b2b");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    if (isEdit) {
      (editForm as UseFormReturn<UserEditFormData>).setValue("image", newFile, {
        shouldDirty: true,
      });
    } else {
      (regForm as UseFormReturn<UserFormData>).setValue("image", newFile, {
        shouldDirty: true,
      });
    }
  };

  return (
    <div className={s.container}>
      {isLoading && <Loading />}

      <form className={s.formContainer} onSubmit={onSubmit} noValidate>
        <div className={s.uploaderContainer}>
          <label htmlFor="profile" className={s.uploaderLabel}>
            <UserItemPreview
              user={{
                nickname: nicknameValue || "nickname",
                color: selectedColor,
                photoURL: previewUrl || initialPhotoURL || "",
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

        {!props.isEdit && (
          <Input
            id="email"
            label="이메일"
            type="email"
            {...(form as UseFormReturn<UserFormData>).register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                message: "올바른 이메일 형식이 아닙니다.",
              },
            })}
            error={
              (form as UseFormReturn<UserFormData>).formState.errors.email
                ?.message as string | undefined
            }
          />
        )}

        {!props.isEdit && (
          <Input
            id="password"
            label="비밀번호"
            type="password"
            placeholder="6자 이상"
            {...(form as UseFormReturn<UserFormData>).register("password", {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 6,
                message: "비밀번호는 6자 이상이어야 합니다.",
              },
            })}
            error={
              (form as UseFormReturn<UserFormData>).formState.errors.password
                ?.message as string | undefined
            }
          />
        )}

        <Input
          id="nickname"
          label="닉네임"
          type="text"
          placeholder="2자 이상 8자 이하"
          {...(props.isEdit
            ? (editForm as UseFormReturn<UserEditFormData>).register(
                "nickname",
                {
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
                }
              )
            : (regForm as UseFormReturn<UserFormData>).register("nickname", {
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
              }))}
          error={
            (props.isEdit
              ? (editForm as UseFormReturn<UserEditFormData>).formState.errors
                  .nickname?.message
              : (regForm as UseFormReturn<UserFormData>).formState.errors
                  .nickname?.message) as string | undefined
          }
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
                onClick={() =>
                  (props.isEdit
                    ? (editForm as UseFormReturn<UserEditFormData>).setValue(
                        "color",
                        hex,
                        { shouldDirty: true }
                      )
                    : (regForm as UseFormReturn<UserFormData>).setValue(
                        "color",
                        hex,
                        { shouldDirty: true }
                      ))
                }
                title={hex}
              />
            ))}
          </div>
        </div>

        <div className={s.actions}>
          <Button type="submit">{submitLabel}</Button>
          <Button type="button" variant="tertiary" onClick={onBack}>
            뒤로가기
          </Button>
        </div>
      </form>
    </div>
  );
};
