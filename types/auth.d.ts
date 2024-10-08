declare module "next-auth" {
  interface User {
    username: string?;
    password: string?;
    role: string["user" | "admin"];
  }

  interface Game {
    id: int;
    userId: string;
    type: string;
    data: string;
    createdAt: EpochTimeStamp;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}
