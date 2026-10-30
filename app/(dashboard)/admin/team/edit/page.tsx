import { Suspense } from "react";
import TeamEdit from "@/components/admin/team/TeamEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <TeamEdit />
    </Suspense>
  );
};

export default page;
