import type { Metadata } from "next";
import WalletClient from "@/components/pageComponents/WalletClient";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Your wallet and account balance",
};

export default function WalletPage() {
  return <WalletClient />;
}
