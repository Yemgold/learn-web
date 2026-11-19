



import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SchoolLayout({ children }: Props) {
  return <>{children}</>;
}