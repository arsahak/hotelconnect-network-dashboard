import { Suspense } from "react";
import SupplierList from "@/components/admin/suppliers/SupplierList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <SupplierList />
    </Suspense>
  );
};

export default page;
