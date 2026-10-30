"use client";

import { createHotelManagerAction, deleteHotelUserAction, listHotelUsersAction } from "@/app/actions/hotel";
import { LoginsCard } from "@/components/shared/LoginsCard";

/**
 * The hotel's logins (briefing §3.1: HotelConnect sets up the first hotels).
 * An admin creates the hotel manager here; the manager makes the staff login.
 */
export function HotelLogins({ hotelId }: { hotelId: string }) {
  return (
    <LoginsCard
      ownerId={hotelId}
      namespace="HotelLogins"
      list={listHotelUsersAction}
      create={createHotelManagerAction}
      remove={deleteHotelUserAction}
    />
  );
}
