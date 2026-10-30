import FaultDetails from "@/components/hotel/faults/FaultDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaultDetails id={id} />;
}
