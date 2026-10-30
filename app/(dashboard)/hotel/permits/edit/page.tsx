import { Suspense } from "react";
import PermitEdit from "@/components/hotel/permits/PermitEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PermitEdit />
    </Suspense>
  );
};

export default page;
