import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Ścieżki dostępne tylko dla partnera (isPartner / isOwner) */
export const PARTNER_ONLY_PATHS = [
  "/account",
  "/add-brand",
  "/add-pizza",
  "/manage-restaurants",
  "/add-restaurant",
  "/restaurant-menu",
  "/edit-pizza",
  "/pizza-preview",
];

export function isPartnerPath(pathname: string): boolean {
  return PARTNER_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** true = tylko zalogowany partner / owner */
  requirePartner?: boolean;
}

const ProtectedRoute = ({
  children,
  requirePartner = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isPartner, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <div className="text-gray-500 animate-pulse">Ładowanie sesji...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requirePartner && !isPartner) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
