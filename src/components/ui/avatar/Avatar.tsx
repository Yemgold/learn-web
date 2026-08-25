




"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  avatarStatusVariants,
  avatarVariants,
} from "./avatar.variants";

import type { AvatarProps } from "./types";


const Avatar = React.forwardRef<
  HTMLDivElement,
  AvatarProps
>(
  (
    {
      className,

      containerClassName,
      imageClassName,
      fallbackClassName,

      src,
      alt,

      name,
      fallback,

      size = "md",
      rounded = "full",

      status,
      showStatus = false,

      loading = false,
      loadingMode = "lazy",

      ...props
    },
    ref
  ) => {

    const [imageError, setImageError] =
      React.useState(false);


    const initials = React.useMemo(() => {
      if (!name) return "";

      return name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    }, [name]);


    const shouldShowImage =
      src && !imageError && !loading;


    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({
            size,
            rounded,
            loading,
          }),
          containerClassName,
          className
        )}
        {...props}
      >

        {shouldShowImage ? (
          <img
            src={src}
            alt={alt ?? name ?? "Avatar"}
            loading={loadingMode}
            onError={() =>
              setImageError(true)
            }
            className={cn(
              "h-full w-full object-cover",
              imageClassName
            )}
          />
        ) : (
          <span
            className={cn(
              "flex h-full w-full items-center justify-center",
              fallbackClassName
            )}
          >
            {fallback ?? initials}
          </span>
        )}


        {showStatus && status && (
          <span
            className={cn(
              avatarStatusVariants({
                status,
                size,
              })
            )}
          />
        )}

      </div>
    );
  }
);


Avatar.displayName = "Avatar";


export { Avatar };