import { Suspense } from "react";
import FaultAdd from "@/components/hotel/faults/FaultAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <FaultAdd />
    </Suspense>
  );
};

export default page;
