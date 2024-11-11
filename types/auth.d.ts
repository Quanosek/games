import { Role } from "@/lib/enums";

declare module "next-auth" {
  interface User {
    username: string?;
    password: string?;
    role: Role;
  }

  interface Game {
    id: string;
    userId: string;
    type: string;
    title: string;
    data: string;
    createdAt: EpochTimeStamp;
    updatedAt: EpochTimeStamp;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}
