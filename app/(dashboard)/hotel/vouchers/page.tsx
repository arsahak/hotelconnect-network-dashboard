import { Suspense } from "react";
import HotelVoucherList from "@/components/hotel/vouchers/HotelVoucherList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelVoucherList />
    </Suspense>
  );
};

export default page;
