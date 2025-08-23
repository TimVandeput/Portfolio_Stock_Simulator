"use client";

import { useState, useEffect } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";

export default function GameClient() {
  const [showModal, setShowModal] = useState(false);

  const { isLoading, hasAccess, accessError } = useAccessControl({
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
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
        <div
          className="game-container w-full flex items-center justify-center font-sans px-6 py-6"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="game-card p-8 rounded-2xl max-w-xl"
            style={{
              backgroundColor: "var(--bg-surface)",
              boxShadow: "var(--shadow-large)",
            }}
          >
            <h1
              className="game-title text-3xl font-bold text-center mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              GAME
            </h1>
            <p
              className="game-text leading-relaxed mb-4 text-center"
              style={{ color: "var(--text-primary)" }}
            >
              Game content coming soon...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
