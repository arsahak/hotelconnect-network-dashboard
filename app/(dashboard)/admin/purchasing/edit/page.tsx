import { Suspense } from "react";
import PurchaseActionEdit from "@/components/admin/purchasing/PurchaseActionEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PurchaseActionEdit />
    </Suspense>
  );
};

export default page;
