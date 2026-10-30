import SupplierDetails from "@/components/admin/suppliers/SupplierDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupplierDetails id={id} />;
}
