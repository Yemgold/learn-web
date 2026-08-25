



import type {
  ReactNode,
} from "react";


export type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info";


export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";



export interface ToastItem {

  id: string;

  title?: ReactNode;

  description?: ReactNode;


  variant?: ToastVariant;


  duration?: number;


  action?: ReactNode;


  dismissible?: boolean;

}



export interface ToastOptions {

  title?: ReactNode;

  description?: ReactNode;


  variant?: ToastVariant;


  duration?: number;


  action?: ReactNode;


  dismissible?: boolean;

}



export interface ToastContextValue {


  toasts: ToastItem[];



  toast: (
    options: ToastOptions
  ) => string;



  dismiss: (
    id: string
  ) => void;



  dismissAll: () => void;

}