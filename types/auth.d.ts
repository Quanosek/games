declare module "next-auth" {
  interface User {
    username: string?;
    password: string?;
    role: string["user" | "admin"];
  }

  interface Account {
    //
  }

  interface Session {
    //
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}
