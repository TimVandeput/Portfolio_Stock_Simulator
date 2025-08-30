"use client";

import { useEffect, useState } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";

export default function SymbolsClient() {
  const [showModal, setShowModal] = useState(false);

  const { isLoading, hasAccess, accessError } = useAccessControl({
    requireAuth: true,
    allowedRoles: ["ROLE_ADMIN"],
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
        <div className="symbols-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
          <div className="symbols-card page-card p-8 rounded-2xl max-w-xl">
            <h1 className="symbols-title page-title text-3xl font-bold text-center mb-6">
              SYMBOLS
            </h1>
            <p className="symbols-text page-text leading-relaxed mb-4 text-justify">
              Symbol management and configuration tools will be displayed here.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
