import TeamDetails from "@/components/admin/team/TeamDetails";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamDetails id={id} />;
}
