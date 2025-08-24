"use client";

import { useState, useEffect } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";

export default function AboutClient() {
  const [showModal, setShowModal] = useState(false);

  const { isLoading, hasAccess, accessError } = useAccessControl({
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
          <div className="about-card page-card p-8 rounded-2xl max-w-xl">
            <h1 className="about-title page-title text-3xl font-bold text-center mb-6">
              ABOUT
            </h1>
            <p className="about-text page-text leading-relaxed mb-4 text-justify">
              This is the About page of our application. Here we share
              information about the purpose of this project, our goals, and the
              team behind it.
            </p>
            <p className="about-text page-text leading-relaxed text-justify">
              Built with Next.js and styled with a soft, neumorphic theme, this
              app is designed to be clean, responsive, and easy to use across
              devices.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
