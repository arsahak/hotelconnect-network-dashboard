import { Suspense } from "react";
import VoucherList from "@/components/admin/vouchers/VoucherList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <VoucherList />
    </Suspense>
  );
};

export default page;
