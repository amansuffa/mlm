"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

const RefContext = createContext({ refId: "", getUrlWithRef: (url) => url });

export function RefProvider({ children }) {
  const [refId, setRefId] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setRefId(ref);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("refId", ref);
      }
    } else if (typeof window !== "undefined") {
      const storedRef = sessionStorage.getItem("refId");
      if (storedRef) setRefId(storedRef);
    }
  }, [searchParams, pathname]);

  const getUrlWithRef = (url) => {
    if (!refId) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}ref=${refId}`;
  };

  return (
    <RefContext.Provider value={{ refId, getUrlWithRef }}>
      {children}
    </RefContext.Provider>
  );
}

export const useRef = () => useContext(RefContext);
