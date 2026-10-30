import { Suspense } from "react";
import PortalLinkList from "@/components/hotel/links/PortalLinkList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PortalLinkList />
    </Suspense>
  );
};

export default page;
