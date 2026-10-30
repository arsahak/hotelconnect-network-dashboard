import { Suspense } from "react";
import TenderList from "@/components/hotel/tenders/TenderList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <TenderList />
    </Suspense>
  );
};

export default page;
