import { Suspense } from "react";
import HotelEdit from "@/components/admin/hotels/HotelEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelEdit />
    </Suspense>
  );
};

export default page;
