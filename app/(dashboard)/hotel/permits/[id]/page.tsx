import PermitDetails from "@/components/hotel/permits/PermitDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PermitDetails id={id} />;
}
