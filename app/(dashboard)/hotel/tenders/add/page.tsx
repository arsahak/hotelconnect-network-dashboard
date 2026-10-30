import { Suspense } from "react";
import TenderAdd from "@/components/hotel/tenders/TenderAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <TenderAdd />
    </Suspense>
  );
};

export default page;
