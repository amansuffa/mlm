import { getSession } from "next-auth/react";

export async function refreshSession() {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
}