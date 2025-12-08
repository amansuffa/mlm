"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { Suspense } from "react";
import { store } from "../store/store";
import { RefProvider } from "../contexts/RefContext";

export default function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <Provider store={store}>
        <Suspense fallback={null}>
          <RefProvider>
            {children}
          </RefProvider>
        </Suspense>
      </Provider>
    </SessionProvider>
  );
}
