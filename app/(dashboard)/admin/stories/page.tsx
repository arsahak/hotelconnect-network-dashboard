import { Suspense } from "react";
import StoryList from "@/components/admin/stories/StoryList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <StoryList />
    </Suspense>
  );
};

export default page;
