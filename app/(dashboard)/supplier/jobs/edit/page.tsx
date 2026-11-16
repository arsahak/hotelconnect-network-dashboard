import { Suspense } from "react";
import HotelJobEdit from "@/components/hotel/jobs/HotelJobEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelJobEdit />
    </Suspense>
  );
};

export default page;
