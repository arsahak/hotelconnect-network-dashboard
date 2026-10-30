import { Suspense } from "react";
import HotelVoucherAdd from "@/components/hotel/vouchers/HotelVoucherAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelVoucherAdd />
    </Suspense>
  );
};

export default page;
