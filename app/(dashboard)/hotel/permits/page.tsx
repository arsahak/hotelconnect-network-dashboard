import { Suspense } from "react";
import PermitList from "@/components/hotel/permits/PermitList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PermitList />
    </Suspense>
  );
};

export default page;
