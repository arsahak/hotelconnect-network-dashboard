import { Suspense } from "react";
import HotelList from "@/components/admin/hotels/HotelList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelList />
    </Suspense>
  );
};

export default page;
