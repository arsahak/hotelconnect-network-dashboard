import { Suspense } from "react";
import JobEdit from "@/components/admin/jobs/JobEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <JobEdit />
    </Suspense>
  );
};

export default page;
