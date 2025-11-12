"use server";
import { signIn, signOut} from "@/auth";


export async function doLogin(formData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return response;
  } catch (error) {
    return { error: error.cause?.err?.message || error.cause?.message || error.message || "Login failed" };
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/login" });
}
