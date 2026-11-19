


import type { BaseEntity } from "./common";

/* =========================================================
   USER ROLE
========================================================= */

export type UserRole =
  | "USER"
  | "ADMIN"
  | "ORGANIZER"
  | "STUDENT";

/* =========================================================
   USER WALLET
========================================================= */

export interface UserWallet {
  _id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/* =========================================================
   SCHOOL MEMBERSHIP
========================================================= */

export type SchoolMembershipRole =
  | "OWNER"
  | "ADMIN"
  | "TEACHER"
  | "STUDENT";

export interface UserSchoolMembership {
  _id: string;
  schoolId: string;
  userId: string;
  role: SchoolMembershipRole;
  isActive: boolean;
}

/* =========================================================
   SCHOOL CONTEXT
========================================================= */

export interface UserSchoolContext {
  schoolName: string;
  subDomain: string;
  userSchoolMembership: UserSchoolMembership;
}

/* =========================================================
   USER
========================================================= */

export interface User extends BaseEntity {
  id: string;
  _id: string;

  firstName: string;
  lastName: string;
  email: string;

  phone?: string;
  phoneNumber?: string;

  avatar?: string;

  role: UserRole;

  verified: boolean;
  active: boolean;

  isVerified?: boolean;
  hasPaid?: boolean;

  referralCode?: string;
  referredBy?: string | null;
  referralChain?: string[];

  plans?: unknown[];

  userWallet?: UserWallet;

  device?: unknown | null;

  /**
   * School context returned by the backend
   * when a user logs into a school portal.
   */
  schoolContext?: UserSchoolContext;
}











// import type { BaseEntity } from "./common";

// export type UserRole =
//   | "USER"
//   | "ADMIN"
//   | "ORGANIZER"
//   | "STUDENT";

// export interface UserWallet {
//   _id: string;
//   userId: string;
//   balance: number;
//   createdAt: string;
//   updatedAt: string;
//   __v?: number;
// }

// export interface User extends BaseEntity {
//   id: string;
//   _id: string;

//   firstName: string;
//   lastName: string;
//   email: string;

//   phone?: string;
//   phoneNumber?: string;

//   avatar?: string;

//   role: UserRole;

//   verified: boolean;
//   active: boolean;

//   isVerified?: boolean;
//   hasPaid?: boolean;

//   referralCode?: string;
//   referredBy?: string | null;
//   referralChain?: string[];

//   plans?: unknown[];

//   userWallet?: UserWallet;

//   device?: unknown | null;
// }