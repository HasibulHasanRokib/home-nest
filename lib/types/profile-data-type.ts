import { Address, Declaration, Profile } from "../generated/prisma/client";

export type ProfileDataType = {
  profile: Profile | null;
  address: Address | null;
  declaration: Declaration | null;
};
