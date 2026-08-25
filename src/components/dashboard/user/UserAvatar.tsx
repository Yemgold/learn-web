



"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizes = {
  xs: {
    container: "h-8 w-8",
    text: "text-xs",
    status: "h-2.5 w-2.5",
  },
  sm: {
    container: "h-10 w-10",
    text: "text-sm",
    status: "h-3 w-3",
  },
  md: {
    container: "h-12 w-12",
    text: "text-base",
    status: "h-3.5 w-3.5",
  },
  lg: {
    container: "h-16 w-16",
    text: "text-lg",
    status: "h-4 w-4",
  },
  xl: {
    container: "h-20 w-20",
    text: "text-xl",
    status: "h-5 w-5",
  },
};

export default function UserAvatar({
  name,
  src,
  size = "md",
  online = false,
  className,
}: UserAvatarProps) {
  const config = sizes[size];

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-blue-600 text-white",
          "flex items-center justify-center font-semibold",
          config.container,
          config.text
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          initials
        )}
      </div>

      {online && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500",
            config.status
          )}
        />
      )}
    </div>
  );
}