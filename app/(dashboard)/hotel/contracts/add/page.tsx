import { Suspense } from "react";
import ContractAdd from "@/components/hotel/contracts/ContractAdd";

const page = () => {
  return (
    <Suspense fallback={null}>
      <ContractAdd />
    </Suspense>
  );
};

export default page;
