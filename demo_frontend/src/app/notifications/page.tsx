import type { Metadata } from "next";
import NotificationsClient from "@/components/pageComponents/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your notifications and alerts",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
