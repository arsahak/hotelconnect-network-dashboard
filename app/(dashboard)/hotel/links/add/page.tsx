import { Suspense } from "react";
import PortalLinkAdd from "@/components/hotel/links/PortalLinkAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PortalLinkAdd />
    </Suspense>
  );
};

export default page;
