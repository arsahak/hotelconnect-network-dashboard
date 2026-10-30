import { Suspense } from "react";
import PurchaseActionList from "@/components/admin/purchasing/PurchaseActionList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PurchaseActionList />
    </Suspense>
  );
};

export default page;
