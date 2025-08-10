import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import s from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className={s.container}>
        {label && (
          <label className={s.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <input ref={ref} className={`${s.input} ${className}`} {...props} />
        {error && <p className={s.error}>{error}</p>}
      </div>
    );
  }
);
