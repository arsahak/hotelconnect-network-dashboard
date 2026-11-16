import { Suspense } from "react";
import HotelJobAdd from "@/components/hotel/jobs/HotelJobAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelJobAdd />
    </Suspense>
  );
};

export default page;
