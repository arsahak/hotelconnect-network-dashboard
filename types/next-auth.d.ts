import "next-auth";
import "next-auth/jwt";
import type { UserRole } from "@/config/access";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    role?: UserRole;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      accessToken?: string;
      role?: UserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    role?: UserRole;
  }
}
