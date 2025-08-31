import type { Metadata } from "next";
import OrdersClient from "@/components/pageComponents/OrdersClient";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your trading orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
