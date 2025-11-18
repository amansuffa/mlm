"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function useFastSession() {
  const { data: session, status } = useSession();
  const [cachedSession, setCachedSession] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load cached session from localStorage on mount
    const cached = localStorage.getItem("session-cache");
    if (cached) {
      setCachedSession(JSON.parse(cached));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Update cache when session changes
    if (status === "authenticated" && session) {
      const sessionData = {
        user: {
          name: session.user.name,
          email: session.user.email,
          profilePicture: session.user.profilePicture
        }
      };
      localStorage.setItem("session-cache", JSON.stringify(sessionData));
      setCachedSession(sessionData);
    } else if (status === "unauthenticated") {
      localStorage.removeItem("session-cache");
      setCachedSession(null);
    }
  }, [session, status]);

  // Return actual session if loaded, otherwise cached session
  return {
    data: status === "loading" && isLoaded ? cachedSession : session,
    status: status === "loading" && cachedSession ? "authenticated" : status,
    isLoading: status === "loading" && !cachedSession
  };
}