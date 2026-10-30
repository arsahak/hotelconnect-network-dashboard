"use client";

import { createSupplierLoginAction, deleteSupplierUserAction, listSupplierUsersAction } from "@/app/actions/supplier";
import { LoginsCard } from "@/components/shared/LoginsCard";

/**
 * The supplier's logins (briefing §4.1: HotelConnect sets up the first suppliers).
 * With it the supplier signs in and can book vouchers on the website (§2.4).
 */
export function SupplierLogins({ supplierId }: { supplierId: string }) {
  return (
    <LoginsCard
      ownerId={supplierId}
      namespace="SupplierLogins"
      list={listSupplierUsersAction}
      create={createSupplierLoginAction}
      remove={deleteSupplierUserAction}
    />
  );
}
