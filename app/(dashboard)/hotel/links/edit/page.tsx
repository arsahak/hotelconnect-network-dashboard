import { Suspense } from "react";
import PortalLinkEdit from "@/components/hotel/links/PortalLinkEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PortalLinkEdit />
    </Suspense>
  );
};

export default page;
