


"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  Portal,
  useClickOutside,
  useControllableState,
  useEscapeKey,
} from "@/components/ui/shared";


import {
  tooltipArrowVariants,
  tooltipContentVariants,
  tooltipTriggerVariants,
  tooltipWrapperVariants,
} from "./tooltip.variants";


import type {
  TooltipProps,
} from "./types";



const Tooltip = React.forwardRef<
  HTMLDivElement,
  TooltipProps
>((props, ref) => {


  const {

    className,

    children,

    content,


    open,

    defaultOpen,

    onOpenChange,


    placement = "top",

    align = "center",

    size = "md",


    delayDuration = 300,

    closeDelayDuration = 100,


    disabled = false,


    portal = true,


    closeOnEscape = true,

    closeOnOutsideClick = true,


    triggerRef,

    contentRef,


    contentClassName,

    triggerClassName,


    ...rest

  } = props;




  const [
    isOpen,
    setIsOpen,
  ] =
    useControllableState({

      value: open,

      defaultValue: defaultOpen,

      onChange: onOpenChange,

    });





  const internalTriggerRef =
    React.useRef<HTMLDivElement | null>(null);


  const internalContentRef =
    React.useRef<HTMLDivElement | null>(null);




  const triggerElementRef =
    triggerRef ??
    internalTriggerRef;



  const contentElementRef =
    contentRef ??
    internalContentRef;





  const openTimer =
    React.useRef<NodeJS.Timeout | null>(null);


  const closeTimer =
    React.useRef<NodeJS.Timeout | null>(null);





  const clearTimers =
    React.useCallback(() => {


      if (openTimer.current) {

        clearTimeout(
          openTimer.current
        );

      }


      if (closeTimer.current) {

        clearTimeout(
          closeTimer.current
        );

      }


    }, []);







  const handleOpen =
    React.useCallback(() => {


      if (disabled) {
        return;
      }


      clearTimers();



      openTimer.current =
        setTimeout(() => {

          setIsOpen(true);

        }, delayDuration);



    }, [
      disabled,
      delayDuration,
      clearTimers,
      setIsOpen,
    ]);








  const handleClose =
    React.useCallback(() => {


      clearTimers();



      closeTimer.current =
        setTimeout(() => {

          setIsOpen(false);

        }, closeDelayDuration);



    }, [
      closeDelayDuration,
      clearTimers,
      setIsOpen,
    ]);







  useEscapeKey({

    enabled:
      closeOnEscape &&
      isOpen,


    onEscape:
      handleClose,

  });






  useClickOutside({

    refs: [

      contentElementRef,

      triggerElementRef,

    ],


    enabled:
      closeOnOutsideClick &&
      isOpen,


    onClickOutside:
      () => {

        setIsOpen(false);

      },

  });







  React.useEffect(() => {

    return () => {

      clearTimers();

    };

  }, [
    clearTimers,
  ]);







  const tooltipContent = (


    <div

      ref={(node) => {


        if (
          contentElementRef &&
          "current" in contentElementRef
        ) {

          contentElementRef.current =
            node;

        }



        if (
          typeof ref === "function"
        ) {

          ref(node);

        }

        else if (ref) {

          ref.current =
            node;

        }


      }}



      role="tooltip"



      className={cn(

        tooltipContentVariants({

          placement,

          align,

          size,

        }),


        contentClassName,

        className

      )}



      {...rest}

    >


      {content}



      <span

        className={cn(

          tooltipArrowVariants({

            placement,

          })

        )}

      />



    </div>

  );







  return (

    <div

      className={
        tooltipWrapperVariants()
      }

    >



      <div

        ref={
          triggerElementRef
        }


        className={cn(

          tooltipTriggerVariants(),

          triggerClassName

        )}



        onMouseEnter={
          handleOpen
        }


        onMouseLeave={
          handleClose
        }


        onFocus={
          handleOpen
        }


        onBlur={
          handleClose
        }

      >

        {children}


      </div>





      {
        isOpen && (

          portal ? (

            <Portal>

              {tooltipContent}

            </Portal>


          ) : (

            tooltipContent

          )

        )
      }



    </div>

  );



});




Tooltip.displayName =
  "Tooltip";



export default Tooltip;