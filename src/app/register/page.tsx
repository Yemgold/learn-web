




"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
const router = useRouter();
const searchParams = useSearchParams();

useEffect(() => {
const referralCode = searchParams.get("ref");


if (referralCode) {
  router.replace(
    `/auth/register?ref=${encodeURIComponent(referralCode)}`
  );
} else {
  router.replace("/auth/register");
}


}, [router, searchParams]);

return ( <div className="flex min-h-screen items-center justify-center"> <p className="text-sm text-muted-foreground">
Redirecting to registration... </p> </div>
);
}
