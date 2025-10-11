import type { Metadata } from "next";
import OrdersClient from "./Client";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your trading orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
