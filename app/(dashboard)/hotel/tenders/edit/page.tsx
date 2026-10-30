import { Suspense } from "react";
import TenderEdit from "@/components/hotel/tenders/TenderEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <TenderEdit />
    </Suspense>
  );
};

export default page;
