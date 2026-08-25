



"use client";

import * as React from "react";

import { Portal } from "@/components/ui/shared";

import {
  Toast,
} from "./Toast";

import {
  ToastContext,
} from "./useToast";


import type {
  ToastContextValue,
  ToastItem,
  ToastOptions,
} from "./types";



interface ToastProviderProps {

  children: React.ReactNode;

}



export function ToastProvider({
  children,
}: ToastProviderProps) {



  const [
    toasts,
    setToasts,
  ] = React.useState<
    ToastItem[]
  >([]);



  const dismiss =
    React.useCallback(
      (
        id: string
      ) => {

        setToasts(
          (current) =>
            current.filter(
              (toast) =>
                toast.id !== id
            )
        );

      },
      []
    );





  const dismissAll =
    React.useCallback(
      () => {

        setToasts([]);

      },
      []
    );






  const toast =
    React.useCallback(
      (
        options: ToastOptions
      ) => {


        const id =
          crypto.randomUUID();



        const newToast: ToastItem = {

          id,

          duration:
            5000,

          dismissible:
            true,

          variant:
            "default",

          ...options,

        };



        setToasts(
          (current) => [

            ...current,

            newToast,

          ]
        );



        return id;


      },
      []
    );






  const contextValue:
    ToastContextValue =
    React.useMemo(
      () => ({

        toasts,

        toast,

        dismiss,

        dismissAll,

      }),

      [
        toasts,

        toast,

        dismiss,

        dismissAll,

      ]
    );






  return (

    <ToastContext.Provider
      value={
        contextValue
      }
    >


      {children}



      <Portal>


        <div
          className="
            fixed
            right-4
            top-4
            z-[100]
            flex
            w-full
            max-w-sm
            flex-col
            gap-3
          "
        >


          {
            toasts.map(
              (
                item
              ) => (

                <Toast

                  key={
                    item.id
                  }

                  toast={
                    item
                  }

                  onDismiss={
                    dismiss
                  }

                />

              )
            )
          }


        </div>


      </Portal>



    </ToastContext.Provider>

  );

}