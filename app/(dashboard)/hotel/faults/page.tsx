import { Suspense } from "react";
import FaultList from "@/components/hotel/faults/FaultList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <FaultList />
    </Suspense>
  );
};

export default page;
