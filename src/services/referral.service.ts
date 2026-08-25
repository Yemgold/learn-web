// import { api } from "@/lib"; 

// /* ============================================================
//    REFERRAL NETWORK MEMBER
//    ============================================================ */

// export interface ReferralNetworkMember {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   referralCode: string;
// }

// /* ============================================================
//    REFERRAL STATS
//    ============================================================ */

// export interface ReferralStats {
//   totalReferred: number;

//   breakdown: {
//     level1: number;
//     level2: number;
//     level3: number;
//   };

//   paidCount: number;

//   unpaidCount: number;
// }

// /* ============================================================
//    REFERRAL USER
//    ============================================================ */

// export interface ReferralUser {
//   _id: string;

//   email: string;

//   role: string;

//   firstName: string;

//   lastName: string;

//   phoneNumber?: string;

//   referralCode?: string;

//   referredBy?: string | null;

//   referralChain?: Array<{
//     userId: string;
//     level: number;
//   }>;

//   isVerified: boolean;

//   hasPaid: boolean;

//   plans: string[];

//   createdAt: string;

//   updatedAt: string;

//   device?: unknown | null;

//   __v?: number;

//   lastForcedSwitchAt?: string;
// }

// /* ============================================================
//    NETWORK RESPONSE
//    ============================================================ */

// export interface ReferralNetworkResponse {
//   success: boolean;

//   message: string;

//   data: ReferralNetworkMember[];
// }

// /* ============================================================
//    STATS RESPONSE
//    ============================================================ */

// export interface ReferralStatsResponse {
//   success: boolean;

//   message: string;

//   data: ReferralStats;
// }

// /* ============================================================
//    PAID / UNPAID NETWORK RESPONSE
//    ============================================================ */

// export interface ReferralPaidNetworkData {
//   paid: ReferralUser[];

//   unpaid: ReferralUser[];

//   totalPaid: number;

//   totalUnpaid: number;
// }

// export interface ReferralPaidNetworkResponse {
//   success: boolean;

//   message: string;

//   data: ReferralPaidNetworkData;
// }

// /* ============================================================
//    GET REFERRAL NETWORK
//    ============================================================ */

// export async function getReferralNetwork(
//   userId: string,
// ): Promise<ReferralNetworkResponse> {
//   const response =
//     await api.get<ReferralNetworkResponse>(
//       `/referrals/network/${userId}`,
//     );

//   return response.data;
// }

// /* ============================================================
//    GET REFERRAL STATS
//    ============================================================ */

// export async function getReferralStats(
//   userId: string,
// ): Promise<ReferralStatsResponse> {
//   const response =
//     await api.get<ReferralStatsResponse>(
//       `/referrals/stats/${userId}`,
//     );

//   return response.data;
// }

// /* ============================================================
//    GET PAID / UNPAID REFERRALS
//    ============================================================ */

// export async function getPaidReferralNetwork(
//   userId: string,
// ): Promise<ReferralPaidNetworkResponse> {
//   const response =
//     await api.get<ReferralPaidNetworkResponse>(
//       `/referrals/network/paid/${userId}`,
//     );

//   return response.data;
// }










import { axiosInstance } from "@/lib/api";

/* ============================================================
   REFERRAL NETWORK MEMBER
   ============================================================ */

export interface ReferralNetworkMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
}

/* ============================================================
   REFERRAL STATS
   ============================================================ */

export interface ReferralStats {
  totalReferred: number;

  breakdown: {
    level1: number;
    level2: number;
    level3: number;
  };

  paidCount: number;

  unpaidCount: number;
}

/* ============================================================
   REFERRAL USER
   ============================================================ */

export interface ReferralUser {
  _id: string;

  email: string;

  role: string;

  firstName: string;

  lastName: string;

  phoneNumber?: string;

  referralCode?: string;

  referredBy?: string | null;

  referralChain?: Array<{
    userId: string;
    level: number;
  }>;

  isVerified: boolean;

  hasPaid: boolean;

  plans: string[];

  createdAt: string;

  updatedAt: string;

  device?: unknown | null;

  __v?: number;

  lastForcedSwitchAt?: string;
}

/* ============================================================
   NETWORK RESPONSE
   ============================================================ */

export interface ReferralNetworkResponse {
  success: boolean;

  message: string;

  data: ReferralNetworkMember[];
}

/* ============================================================
   STATS RESPONSE
   ============================================================ */

export interface ReferralStatsResponse {
  success: boolean;

  message: string;

  data: ReferralStats;
}

/* ============================================================
   PAID / UNPAID NETWORK RESPONSE
   ============================================================ */

export interface ReferralPaidNetworkData {
  paid: ReferralUser[];

  unpaid: ReferralUser[];

  totalPaid: number;

  totalUnpaid: number;
}

export interface ReferralPaidNetworkResponse {
  success: boolean;

  message: string;

  data: ReferralPaidNetworkData;
}

/* ============================================================
   GET REFERRAL NETWORK
   ============================================================ */

export async function getReferralNetwork(
  userId: string,
): Promise<ReferralNetworkResponse> {
  const response =
    await axiosInstance.get<ReferralNetworkResponse>(
      `/referrals/network/${userId}`,
    );

  return response.data;
}

/* ============================================================
   GET REFERRAL STATS
   ============================================================ */

export async function getReferralStats(
  userId: string,
): Promise<ReferralStatsResponse> {
  const response =
    await axiosInstance.get<ReferralStatsResponse>(
      `/referrals/stats/${userId}`,
    );

  return response.data;
}

/* ============================================================
   GET PAID / UNPAID REFERRALS
   ============================================================ */

export async function getPaidReferralNetwork(
  userId: string,
): Promise<ReferralPaidNetworkResponse> {
  const response =
    await axiosInstance.get<ReferralPaidNetworkResponse>(
      `/referrals/network/paid/${userId}`,
    );

  return response.data;
}