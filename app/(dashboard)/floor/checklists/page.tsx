import { Suspense } from "react";
import ChecklistsPage from "@/components/floor/ChecklistsPage";

// useSearchParams (?list=…) needs a Suspense boundary.
const page = () => (
  <Suspense fallback={<div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />}>
    <ChecklistsPage />
  </Suspense>
);
export default page;
