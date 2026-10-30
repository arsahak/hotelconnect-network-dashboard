import { Suspense } from "react";
import SupplierTenderList from "@/components/supplier/tenders/SupplierTenderList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <SupplierTenderList />
    </Suspense>
  );
};

export default page;
