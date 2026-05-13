import { useEffect, useState } from "react";
import { isSupabaseConfigured, isSupabaseNetworkError, supabase } from "../lib/supabase";

export type UserRole = "admin" | "editor" | null;

interface UseUserRoleResult {
  role: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  error: Error | null;
  userId: string | null;
  userEmail: string | null;
}

// Cache to avoid repeated queries
let roleCache: { userId: string; role: UserRole } | null = null;

export function useUserRole(): UseUserRoleResult {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      setRole(null);
      setUserId(null);
      setUserEmail(null);
      setError(null);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    async function fetchUserRole() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          if (isMounted) {
            setRole(null);
            setUserId(null);
            setUserEmail(null);
            setError(null);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setUserId(user.id);
          setUserEmail(user.email || null);
        }

        if (roleCache && roleCache.userId === user.id) {
          if (isMounted) {
            setRole(roleCache.role);
            setError(null);
            setIsLoading(false);
          }
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("cms_users")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            if (isMounted) {
              setRole(null);
              setError(null);
              setIsLoading(false);
            }
            return;
          }
          throw fetchError;
        }

        const userRole = data?.role as UserRole;
        roleCache = { userId: user.id, role: userRole };

        if (isMounted) {
          setRole(userRole);
          setError(null);
        }
      } catch (err) {
        if (!isSupabaseNetworkError(err)) {
          console.error("[useUserRole] Error:", err);
        }
        if (isMounted) {
          setError(err instanceof Error && !isSupabaseNetworkError(err) ? err : null);
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      roleCache = null;
      fetchUserRole();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    isEditor: role === "editor",
    isLoading,
    error,
    userId,
    userEmail,
  };
}

export function clearUserRoleCache() {
  roleCache = null;
}
