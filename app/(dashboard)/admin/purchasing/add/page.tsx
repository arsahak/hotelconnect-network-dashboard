import { Suspense } from "react";
import PurchaseActionAdd from "@/components/admin/purchasing/PurchaseActionAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PurchaseActionAdd />
    </Suspense>
  );
};

export default page;
