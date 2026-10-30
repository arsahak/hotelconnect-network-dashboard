"use client";

import { useEffect, useState } from "react";
import { hotelOptionsAction, type HotelOption } from "@/app/actions/hotel";

/** Every hotel for dropdowns (jobs, vouchers). Empty while loading. */
export function useHotelOptions(): HotelOption[] {
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  useEffect(() => {
    let current = true;
    hotelOptionsAction().then((res) => {
      if (current && res.data) setHotels(res.data);
    });
    return () => {
      current = false;
    };
  }, []);
  return hotels;
}
