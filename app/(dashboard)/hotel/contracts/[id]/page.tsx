import ContractDetails from "@/components/hotel/contracts/ContractDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContractDetails id={id} />;
}
