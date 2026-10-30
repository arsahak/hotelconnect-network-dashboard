import { Suspense } from "react";
import ContractList from "@/components/hotel/contracts/ContractList";

const page = () => {
  return (
    <Suspense fallback={null}>
      <ContractList />
    </Suspense>
  );
};

export default page;
