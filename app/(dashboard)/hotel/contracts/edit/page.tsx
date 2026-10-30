import { Suspense } from "react";
import ContractEdit from "@/components/hotel/contracts/ContractEdit";

const page = () => {
  return (
    <Suspense fallback={null}>
      <ContractEdit />
    </Suspense>
  );
};

export default page;
