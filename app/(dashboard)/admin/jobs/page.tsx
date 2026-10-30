import { Suspense } from "react";
import JobList from "@/components/admin/jobs/JobList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <JobList />
    </Suspense>
  );
};

export default page;
