import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAccessControl } from "@/hooks/useAuth";
import { getPageAccessConfig } from "@/lib/config/pageAccessControl";

export function useLayoutAccessControl() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const pageConfig = getPageAccessConfig(pathname);

  const shouldCheckAccess = pageConfig && !pageConfig.excludeFromAccessControl;

  const { isLoading, hasAccess, accessError } = useAccessControl(
    shouldCheckAccess
      ? {
          requireAuth: pageConfig.requireAuth,
          allowedRoles: pageConfig.allowedRoles,
        }
      : {
          requireAuth: false,
        }
  );

  useEffect(() => {
    console.log("🔐 Access control check:", {
      pathname,
      shouldCheckAccess,
      isLoading,
      hasAccess,
      accessError,
    });

    if (shouldCheckAccess && !isLoading && !hasAccess && !!accessError) {
      console.log("🚫 Access denied, showing modal");
      setShowModal(true);
    } else {
      if (showModal) {
        console.log("✅ Access granted or loading, hiding modal");
      }
      setShowModal(false);
    }
  }, [shouldCheckAccess, isLoading, hasAccess, accessError, showModal]);

  return {
    showModal,
    setShowModal,
    accessError,
    shouldCheckAccess,
  };
}
