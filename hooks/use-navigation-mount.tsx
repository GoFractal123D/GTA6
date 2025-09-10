import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook pour gérer l'état de montage lors de la navigation
 * Résout les problèmes d'hydratation lors du changement de route
 */
export function useNavigationMount() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Réinitialiser l'état à chaque changement de route
    setIsMounted(false);

    // Petit délai pour éviter les conflits d'hydratation
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return isMounted;
}
