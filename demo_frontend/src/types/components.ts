import { ReactNode } from "react";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  "aria-label"?: string;
}

export interface InputProps extends BaseComponentProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export type ClickHandler = () => void;
export type ChangeHandler = (value: string) => void;
export type SubmitHandler = (e: React.FormEvent) => void;
