


import * as React from "react";

import type {
  ToastContextValue,
} from "./types";


const ToastContext =
  React.createContext<
    ToastContextValue | undefined
  >(undefined);



export function useToast() {

  const context =
    React.useContext(
      ToastContext
    );


  if (!context) {

    throw new Error(
      "useToast must be used inside ToastProvider"
    );

  }


  return context;

}



export {
  ToastContext,
};