import type { Metadata } from "next";
import UsersClient from "@/components/pageComponents/UsersClient";

export const metadata: Metadata = {
  title: "Users",
  description: "User management",
};

export default function UsersPage() {
  return <UsersClient />;
}
