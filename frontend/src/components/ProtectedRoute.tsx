import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isInitialized,
    checkInactivity,
    updateLastActivity,
  } = useAuthStore();

  useEffect(() => {
    // Check for inactivity on mount
    checkInactivity();

    // Set up inactivity check interval (every minute)
    const inactivityInterval = setInterval(() => {
      checkInactivity();
    }, 60000); // Check every minute

    // Track user activity
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    const handleActivity = () => {
      updateLastActivity();
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(inactivityInterval);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [checkInactivity, updateLastActivity]);

  // Wait for auth state to be initialized before checking
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
