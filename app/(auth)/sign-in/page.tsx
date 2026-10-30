import { Suspense } from "react";
import SigninPage from "@/components/auth/SigninPage";

const page = () => {
  return (
    <Suspense fallback={null}>
      <SigninPage />
    </Suspense>
  );
};

export default page;
