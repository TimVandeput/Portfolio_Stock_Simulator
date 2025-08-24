import type { Metadata } from "next";
import MysteryAdminForm from "@/components/pageComponents/MysteryAdminForm";

export const metadata: Metadata = {
  title: "Mystery Admin",
  description: "Admin: manage user mystery pages",
};

export default function MysteryAdminPage() {
  return <MysteryAdminForm />;
}
