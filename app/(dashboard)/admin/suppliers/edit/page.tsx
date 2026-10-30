import { Suspense } from "react";
import SupplierEdit from "@/components/admin/suppliers/SupplierEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <SupplierEdit />
    </Suspense>
  );
};

export default page;
