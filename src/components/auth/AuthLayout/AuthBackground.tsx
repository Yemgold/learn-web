






"use client";

export default function AuthBackground() {
  return (
    <>
      

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/70 to-transparent" />

      {/* Decorative Glow */}

      <div className="absolute left-20 top-32 h-72 w-72 rounded-full bg-blue-500/20 blur-[140px]" />

      <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-[150px]" />
    </>
  );
}