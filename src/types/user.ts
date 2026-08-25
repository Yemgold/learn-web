// import type { BaseEntity } from "./common";

// /* ============================================================
//    USER ROLE
//    ============================================================ */

// export type UserRole =
//   | "USER"
//   | "ADMIN"
//   | "ORGANIZER"
//   | "STUDENT";

// /* ============================================================
//    USER WALLET
//    ============================================================ */

// export interface UserWallet {
//   _id: string;
//   userId: string;
//   balance: number;
//   createdAt: string;
//   updatedAt: string;
//   __v?: number;
// }

// /* ============================================================
//    USER
//    ============================================================ */

// export interface User extends BaseEntity {
//   /*
//    * MongoDB user ID
//    *
//    * IMPORTANT:
//    * Referral endpoints use this ID.
//    */
//   _id: string;

//   firstName: string;

//   lastName: string;

//   email: string;

//   phone?: string;

//   /*
//    * Backend returns phoneNumber.
//    * Keep phone as the frontend-friendly property if needed.
//    */
//   phoneNumber?: string;

//   avatar?: string;

//   role: UserRole;

//   /*
//    * Frontend auth flags
//    */
//   verified: boolean;

//   active: boolean;

//   /*
//    * Backend verification/payment state
//    */
//   isVerified?: boolean;

//   hasPaid?: boolean;

//   /*
//    * Referral information
//    */
//   referralCode?: string;

//   referredBy?: string | null;

//   referralChain?: string[];

//   /*
//    * User plans
//    */
//   plans?: unknown[];

//   /*
//    * Wallet
//    */
//   userWallet?: UserWallet;

//   /*
//    * Device/session information
//    */
//   device?: unknown | null;
// }




import type { BaseEntity } from "./common";

export type UserRole =
  | "USER"
  | "ADMIN"
  | "ORGANIZER"
  | "STUDENT";

export interface UserWallet {
  _id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

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
}