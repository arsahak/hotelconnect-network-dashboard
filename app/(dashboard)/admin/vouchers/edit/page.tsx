import { Suspense } from "react";
import VoucherEdit from "@/components/admin/vouchers/VoucherEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <VoucherEdit />
    </Suspense>
  );
};

export default page;
