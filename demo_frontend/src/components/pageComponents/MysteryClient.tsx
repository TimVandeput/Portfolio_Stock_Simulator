"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import MysteryAdminForm from "../form/MysteryAdminForm";
import MysteryUserForm from "../form/MysteryUserForm";
import Loader from "@/components/ui/Loader";

export default function MysteryClient() {
  const { isLoading, role } = useAuth();

  const active = useMemo(() => {
    if (isLoading) return "loading";
    if (role === "ROLE_ADMIN") return "admin";
    if (role === "ROLE_USER") return "user";
    return "restricted";
  }, [isLoading, role]);

  return (
    <div className="about-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="about-card page-card p-8 rounded-2xl max-w-xl text-center">
        <h1 className="about-title page-title text-3xl font-bold mb-6">
          MYSTERY
        </h1>

        {active === "loading" ? (
          <Loader />
        ) : active === "admin" ? (
          <MysteryAdminForm />
        ) : active === "user" ? (
          <MysteryUserForm />
        ) : (
          <p className="page-text text-lg font-medium">Access restricted</p>
        )}
      </div>
    </div>
  );
}
