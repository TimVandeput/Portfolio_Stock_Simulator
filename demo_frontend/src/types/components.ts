import { ReactNode } from "react";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
}

export type Mode = "admin" | "market";

export type ClickHandler = () => void;
export type ChangeHandler = (value: string) => void;
export type SubmitHandler = (e: React.FormEvent) => void;
