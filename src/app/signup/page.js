import { Suspense } from "react";
import Signup from "@/components/Signup";

export default function SignupPage() {
  return (
    <Suspense fallback={<p>Loading signup...</p>}>
      <Signup />
    </Suspense>
  );
}
