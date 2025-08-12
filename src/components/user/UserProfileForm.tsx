import { Button } from "@components/atoms/Buttons";
import { Input } from "@components/atoms/Input";
import { UserItemPreview } from "@components/decisionByAdmin/vote/UserItem";
import { Loading } from "@components/Loading";
import s from "@pages/Register.module.scss";
import type { BaseSyntheticEvent, ChangeEvent } from "react";
import type { Path, UseFormReturn } from "react-hook-form";

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

type CommonFormShape = {
  email?: string;
  password?: string;
  nickname: string;
  color: string;
};

type Props<T extends CommonFormShape> = {
  form: UseFormReturn<T>;
  onSubmit: (e?: BaseSyntheticEvent) => void;
  selectedColor: string;
  onSelectColor: (hex: string) => void;
  previewUrl: string | null;
  onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  submitLabel: string;
  onBack: () => void;
  showEmail?: boolean;
  showPassword?: boolean;
};

export const UserProfileForm = <T extends CommonFormShape>(props: Props<T>) => {
  const {
    form,
    onSubmit,
    selectedColor,
    onSelectColor,
    previewUrl,
    onChangeFile,
    isLoading,
    submitLabel,
    onBack,
    showEmail = false,
    showPassword = false,
  } = props;

  const { register, formState: { errors }, watch } = form;
  const nicknameValue = (watch("nickname" as Path<T>) as unknown as string) ?? "";

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

        {showEmail && (
          <Input
            id="email"
            label="이메일"
            type="email"
            {...register("email" as Path<T>, {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                message: "올바른 이메일 형식이 아닙니다.",
              },
            })}
            error={errors.email?.message as string | undefined}
          />
        )}

        {showPassword && (
          <Input
            id="password"
            label="비밀번호"
            type="password"
            placeholder="6자 이상"
            {...register("password" as Path<T>, {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 6,
                message: "비밀번호는 6자 이상이어야 합니다.",
              },
            })}
            error={errors.password?.message as string | undefined}
          />
        )}

        <Input
          id="nickname"
          label="닉네임"
          type="text"
          placeholder="2자 이상 8자 이하"
          {...register("nickname" as Path<T>, {
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
          error={errors.nickname?.message as string | undefined}
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
                onClick={() => onSelectColor(hex)}
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
