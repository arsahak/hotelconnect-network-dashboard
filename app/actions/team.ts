"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// The platform team: the admins who run HotelConnect. Admins can view the
// team; only a superadmin can add, edit or remove members (checked by the API).

export type TeamRole = "superadmin" | "admin";

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: TeamRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: TeamRole;
  isActive?: boolean;
  /** Only when adding a member. */
  password?: string;
}

export async function listTeamAction(): Promise<ActionResponse<TeamMember[]>> {
  return apiRequest<TeamMember[]>("/users/team", { fallbackError: "Failed to load the team." });
}

export async function getTeamMemberAction(id: string): Promise<ActionResponse<TeamMember>> {
  return apiRequest<TeamMember>(`/users/team/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to load this team member.",
  });
}

export async function createTeamMemberAction(
  data: TeamMemberInput,
): Promise<ActionResponse<TeamMember>> {
  return apiRequest<TeamMember>("/users/team", {
    method: "POST",
    body: data,
    fallbackError: "Failed to add the team member.",
  });
}

export async function updateTeamMemberAction(
  id: string,
  data: Partial<Omit<TeamMemberInput, "password">>,
): Promise<ActionResponse<TeamMember>> {
  return apiRequest<TeamMember>(`/users/team/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to update the team member.",
  });
}

export async function deleteTeamMemberAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/users/team/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Failed to remove the team member.",
  });
}
