"use client";

import { useState, useEffect } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";

export default function MysteryClient() {
  const [showModal, setShowModal] = useState(false);

  const { isLoading, hasAccess, accessError, role } = useAccessControl({
    requireAuth: true,
  });

  useEffect(() => {
    if (!isLoading && !hasAccess && accessError) {
      setShowModal(true);
    }
  }, [isLoading, hasAccess, accessError]);

  return (
    <>
      {showModal ? (
        <NoAccessModal
          isOpen={showModal}
          accessType={accessError?.reason}
          message={accessError?.message || "Access denied"}
          onClose={() => setShowModal(false)}
        />
      ) : (
        <div className="about-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
          <div className="about-card page-card p-8 rounded-2xl max-w-xl text-center">
            <h1 className="about-title page-title text-3xl font-bold mb-6">
              MYSTERY
            </h1>
            {role === "ROLE_ADMIN" ? (
              <p className="page-text text-lg font-medium">Hello Admin</p>
            ) : (
              <p className="page-text text-lg font-medium">Hello User</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
