"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { RefProvider } from "../contexts/RefContext";

export default function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <Provider store={store}>
        <RefProvider>
          {children}
        </RefProvider>
      </Provider>
    </SessionProvider>
  );
}
