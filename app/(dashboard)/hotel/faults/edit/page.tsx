import { Suspense } from "react";
import FaultEdit from "@/components/hotel/faults/FaultEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <FaultEdit />
    </Suspense>
  );
};

export default page;
