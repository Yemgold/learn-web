




import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant =
  | "default"
  | "outlined"
  | "elevated"
  | "flat";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

export interface CardHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export interface CardContentProps
  extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement> {}

const variantStyles: Record<CardVariant, string> = {
  default: "border border-slate-200 bg-white shadow-sm",
  outlined: "border border-slate-200 bg-white",
  elevated: "border border-slate-100 bg-white shadow-md",
  flat: "border border-transparent bg-slate-50",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
};

export default function Card({
  children,
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-xl",
        "transition-all duration-200",
        variantStyles[variant],
        paddingStyles[padding],
        hoverable
          ? "hover:-translate-y-0.5 hover:shadow-md"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  icon,
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={[
        "mb-4 flex items-start justify-between gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          {title && (
            <h3 className="text-base font-semibold text-slate-900">
              {title}
            </h3>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: CardContentProps) {
  return (
    <div
      className={["min-w-0", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: CardFooterProps) {
  return (
    <div
      className={[
        "mt-4 flex items-center justify-between gap-3",
        "border-t border-slate-100 pt-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
