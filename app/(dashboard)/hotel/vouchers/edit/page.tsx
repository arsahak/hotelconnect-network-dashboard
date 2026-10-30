import { Suspense } from "react";
import HotelVoucherEdit from "@/components/hotel/vouchers/HotelVoucherEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelVoucherEdit />
    </Suspense>
  );
};

export default page;
