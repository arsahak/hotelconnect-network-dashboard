import { Suspense } from "react";
import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";

// The emailed link carries ?email=…&token=… (read with useSearchParams).
const page = () => (
  <Suspense>
    <ForgotPasswordPage />
  </Suspense>
);

export default page;
