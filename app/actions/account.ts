"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";
import type { UserRole } from "@/config/access";

// The signed-in user's own account — used by the Profile and Settings pages
// and the topbar. Every role has one.

export interface Account {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getMyAccountAction(): Promise<ActionResponse<Account>> {
  return apiRequest<Account>("/users/me", { fallbackError: "Failed to load your account." });
}

export async function updateMyAccountAction(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<ActionResponse<Account>> {
  return apiRequest<Account>("/users/me", {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to update your account.",
  });
}

export async function changeMyPasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResponse<null>> {
  return apiRequest<null>("/users/me/password", {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to change your password.",
  });
}

export async function updateMyAvatarAction(formData: FormData): Promise<ActionResponse<Account>> {
  return apiRequest<Account>("/users/me/avatar", {
    method: "PATCH",
    body: formData,
    fallbackError: "Failed to update your photo.",
  });
}
