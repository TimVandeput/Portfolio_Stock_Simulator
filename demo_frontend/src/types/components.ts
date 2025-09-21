import { ReactNode } from "react";
import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import type { Universe } from "@/types/symbol";
import type { Role } from "@/types";
import type { Price } from "@/types/prices";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { Transaction } from "@/types/trading";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export type Mode = "admin" | "market";

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

export interface NoAccessModalProps extends BaseComponentProps {
  isOpen: boolean;
  title?: string;
  message: string;
  closeText?: string;
  onClose: () => void;
  accessType?: "login" | "role" | "general";
}

export interface ConfirmationModalProps extends BaseComponentProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

export interface StatusMessageProps extends BaseComponentProps {
  message: string;
  type?: "error" | "success";
}

export interface SortDropdownProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
}

export interface TransactionExporterProps extends BaseComponentProps {
  transactions: Transaction[];
  filename?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface LoaderProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

export interface ThemeToggleProps extends BaseComponentProps {}

export interface DynamicIconProps extends BaseComponentProps {
  name: string;
  size?: number;
  color?: string;
}

export interface SymbolsTableProps extends BaseComponentProps {
  page: Page<SymbolDTO> | null;
  mode: Mode;
  onToggle?: (row: SymbolDTO, next: boolean) => void;
  prices?: Record<string, Price>;
  pulsatingSymbols?: Set<string>;
  onBuy?: (row: SymbolDTO) => void;
}

export interface SymbolsPaginationProps extends BaseComponentProps {
  pageIdx: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (idx: number) => void;
}

export interface UniverseImportBarProps extends BaseComponentProps {
  universe: Universe;
  setUniverse: (u: Universe) => void;
  onImport: () => void;
  importBusy: boolean;
  importRunning: boolean;
}

export interface RegisterStatus {
  message: string;
  type: "error" | "success";
}

export interface RegisterFormProps extends BaseComponentProps {
  rUser: string;
  setRUser: (v: string) => void;
  rPass: string;
  setRPass: (v: string) => void;
  rPass2: string;
  setRPass2: (v: string) => void;
  rCode: string;
  setRCode: (v: string) => void;
  rStatus: RegisterStatus | null;
  isRegistering: boolean;
  onSubmit: () => void | Promise<void>;
  onFlipToLogin: () => void;
}

export interface SymbolsListMobileProps extends BaseComponentProps {
  page: Page<SymbolDTO> | null;
  mode: Mode;
  onToggle?: (row: SymbolDTO, next: boolean) => void;
  prices?: Record<string, Price>;
  pulsatingSymbols?: Set<string>;
  onBuy?: (row: SymbolDTO) => void;
}

export interface SymbolsTableDesktopProps extends BaseComponentProps {
  page: Page<SymbolDTO> | null;
  mode: Mode;
  onToggle?: (row: SymbolDTO, next: boolean) => void;
  prices?: Record<string, Price>;
  pulsatingSymbols?: Set<string>;
  onBuy?: (row: SymbolDTO) => void;
}

export interface LoginFormProps extends BaseComponentProps {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string;
  success: string;
  selectedRole: Role;
  setSelectedRole: (r: Role) => void;
  isLoggingIn: boolean;
  onSubmit: () => void | Promise<void>;
  onFlipToRegister: () => void;
}

export interface RoleSelectorProps extends BaseComponentProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

export interface PasswordInputProps extends InputProps {
  showToggle?: boolean;
}

export interface TableColumn {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  alignment?: "left" | "center" | "right";
  width?: string;
}

export interface TableHeaderProps extends BaseComponentProps {
  columns: TableColumn[];
}

export interface OrderSummaryProps extends BaseComponentProps {
  quantityNum: number;
  lastPrice: number;
  totalCost: number;
}

export interface ValidationMessagesProps extends BaseComponentProps {
  canAfford: boolean;
  totalCost: number;
  walletLoading: boolean;
  lastPrice: number;
  success?: string;
  loading?: boolean;
}

export interface QuantityInputProps extends BaseComponentProps {
  quantity: string;
  onQuantityChange: (value: string) => void;
  onSetMaxAffordable: () => void;
  walletLoading: boolean;
  walletBalance: WalletBalanceResponse | null;
  lastPrice: number;
  mode?: "buy" | "sell";
}

export interface WalletBalanceCardProps extends BaseComponentProps {
  walletBalance: WalletBalanceResponse | null;
  walletLoading: boolean;
}

export interface PriceCardProps extends BaseComponentProps {
  symbol: string;
  currentPrice?: Price;
}

export interface PortfolioStatsCardProps extends BaseComponentProps {
  title: string;
  value: string;
  subValue?: string;
  iconName: string;
  valueColor?: string;
  ariaLabel?: string;
  tooltip?: string;
}

export interface EmptyPortfolioProps extends BaseComponentProps {
  onViewMarkets: () => void;
}

export type ClickHandler = () => void;
export type ChangeHandler = (value: string) => void;
export type SubmitHandler = (e: React.FormEvent) => void;
