import { auth } from "@/auth";
import DashboardHome from "@/components/dashboard/DashboardHome";
import HotelHome from "@/components/hotel/HotelHome";
import FaultList from "@/components/hotel/faults/FaultList";
import SupplierHome from "@/components/supplier/SupplierHome";

/** Start page per role: hotel managers get the year calendar, hotel staff the storingslijst, suppliers their requests. */
export default async function page() {
  const role = (await auth())?.user?.role;
  if (role === "hotel_manager") return <HotelHome />;
  if (role === "hotel_staff") return <FaultList />;
  if (role === "supplier") return <SupplierHome />;
  return <DashboardHome />;
}
