


"use client";

import * as React from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  toastActionVariants,
  toastCloseVariants,
  toastContentVariants,
  toastDescriptionVariants,
  toastTitleVariants,
  toastVariants,
} from "./toast.variants";


import type {
  ToastItem,
} from "./types";



interface ToastProps {


  toast: ToastItem;


  onDismiss: (
    id: string
  ) => void;

}



export function Toast({
  toast,
  onDismiss,
}: ToastProps) {



  const {

    id,

    title,

    description,

    variant = "default",

    duration = 5000,

    action,

    dismissible = true,

  } = toast;





  React.useEffect(() => {


    if (!duration) {
      return;
    }



    const timer =
      setTimeout(
        () => {

          onDismiss(id);

        },

        duration

      );



    return () => {

      clearTimeout(timer);

    };


  }, [

    id,

    duration,

    onDismiss,

  ]);






  return (

    <div

      role="status"


      aria-live="polite"


      className={cn(

        toastVariants({

          variant,

        })

      )}

    >





      <div

        className={
          toastContentVariants()
        }

      >



        {
          title && (

            <div

              className={
                toastTitleVariants()
              }

            >

              {title}

            </div>

          )
        }





        {
          description && (

            <div

              className={
                toastDescriptionVariants()
              }

            >

              {description}

            </div>

          )
        }






        {
          action && (

            <div

              className={
                toastActionVariants()
              }

            >

              {action}

            </div>

          )
        }



      </div>






      {
        dismissible && (

          <button


            type="button"


            aria-label="Dismiss notification"


            className={
              toastCloseVariants()
            }


            onClick={() =>
              onDismiss(id)
            }


          >

            <X
              size={16}
            />


          </button>

        )
      }





    </div>

  );

}