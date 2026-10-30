import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyHotelAction } from "@/app/actions/myHotel";
import { isUserRole } from "@/config/access";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

// Every page here is signed-in only and loads its data per request, so none of
// it is prerendered at build time.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const role = session?.user?.role;
  // The proxy already sends signed-out visitors away; this is a second guard.
  if (!session?.user || !isUserRole(role)) redirect("/sign-in");

  // Hotel accounts: show the hotel's name, and send a manager who hasn't
  // finished the onboarding there first (briefing §3.2).
  let organisation: string | undefined;
  if (role === "hotel_manager" || role === "hotel_staff") {
    const hotel = (await getMyHotelAction()).data;
    if (role === "hotel_manager" && hotel && !hotel.onboarding.completedAt) redirect("/hotel/onboarding");
    organisation = hotel?.name;
  }

  return (
    <LayoutWrapper user={{ name: session.user.name ?? "", email: session.user.email ?? "", role, organisation }}>
      {children}
    </LayoutWrapper>
  );
}
