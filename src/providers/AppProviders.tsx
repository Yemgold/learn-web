


"use client";

import { ReactNode } from "react";
import QueryProvider from "./QueryProvider";

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}




// "use client";

// import { ReactNode } from "react";

// import AuthProvider from "./AuthProvider";
// import ModalProvider from "./ModalProvider";
// import QueryProvider from "./QueryProvider";
// import ThemeProvider from "./ThemeProvider";
// import ToastProvider from "./ToastProvider";

// interface Props {
//   children: ReactNode;
// }

// export default function AppProviders({ children }: Props) {
//   return (
//     <QueryProvider>
//       <ThemeProvider>
//         <AuthProvider>
//           <ModalProvider>
//             {children}
//             <ToastProvider />
//           </ModalProvider>
//         </AuthProvider>
//       </ThemeProvider>
//     </QueryProvider>
//   );
// }