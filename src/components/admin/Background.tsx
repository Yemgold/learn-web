"use client";

import { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};

export default function Background({
  children,
}: BackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.06),transparent_35%)]" />
      </div>

      {/* Page */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}