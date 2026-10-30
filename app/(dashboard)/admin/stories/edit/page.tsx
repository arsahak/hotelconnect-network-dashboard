import { Suspense } from "react";
import StoryEdit from "@/components/admin/stories/StoryEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <StoryEdit />
    </Suspense>
  );
};

export default page;
