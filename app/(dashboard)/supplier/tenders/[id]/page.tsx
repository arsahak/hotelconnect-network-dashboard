import SupplierTenderDetails from "@/components/supplier/tenders/SupplierTenderDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupplierTenderDetails id={id} />;
}
