"use client";

import { useRouter } from "next/navigation";
import EduLudoGame from "@/games/edu-ludo/components/EduLudoGame";

export default function EducationalLudoPage() {
  const router = useRouter();
  return (
    <EduLudoGame
      onBack={() => router.back()}
      onFundWallet={() => router.push("/student/wallet")}
    />
  );
}


