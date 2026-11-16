import { Suspense } from "react";
import HotelJobList from "@/components/hotel/jobs/HotelJobList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <HotelJobList />
    </Suspense>
  );
};

export default page;
