import { Suspense } from "react";
import PermitAdd from "@/components/hotel/permits/PermitAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PermitAdd />
    </Suspense>
  );
};

export default page;
