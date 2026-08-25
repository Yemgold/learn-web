



"use client";

import * as React from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  FocusTrap,
  Overlay,
  Portal,
  useControllableState,
  useEscapeKey,
  useScrollLock,
} from "@/components/ui/shared";


import {
  modalBodyVariants,
  modalCloseButtonVariants,
  modalContentVariants,
  modalDescriptionVariants,
  modalFooterVariants,
  modalHeaderVariants,
  modalIconVariants,
  modalOverlayVariants,
  modalTitleVariants,
  modalWrapperVariants,
} from "./modal.variants";


import type {
  ModalProps,
} from "./types";



const Modal = React.forwardRef<
  HTMLDivElement,
  ModalProps
>((props, ref) => {


  const {

    className,

    open,
    defaultOpen,
    onOpenChange,


    title,
    description,
    icon,

    children,


    primaryAction,
    secondaryAction,
    footer,


    hideFooter = false,

    showCloseButton = true,


    closeOnEscape = true,

    closeOnOverlayClick = true,


    preventClose = false,


    trapFocus = true,


    lockScroll = true,


    portal = true,


    size = "md",


    initialFocusRef,


    overlayClassName,

    contentClassName,

    headerClassName,

    bodyClassName,

    footerClassName,


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




  const contentRef =
    React.useRef<HTMLDivElement | null>(null);



  useScrollLock({

    locked:
      lockScroll &&
      isOpen,

  });




  const handleClose =
    React.useCallback(() => {


      if (preventClose) {
        return;
      }


      setIsOpen(false);


    }, [
      preventClose,
      setIsOpen,
    ]);




  useEscapeKey({

    enabled:
      closeOnEscape &&
      isOpen,


    onEscape:
      handleClose,

  });





  if (!isOpen) {
    return null;
  }



  const titleId =
    React.useId();


  const descriptionId =
    React.useId();




  const modal = (

    <>


      <Overlay

        open={isOpen}

        className={cn(

          modalOverlayVariants(),

          overlayClassName

        )}

        onOverlayClick={() => {

          if (
            closeOnOverlayClick
          ) {

            handleClose();

          }

        }}

      />



      <div

        className={
          modalWrapperVariants()
        }

      >



        <FocusTrap

          enabled={trapFocus}

          initialFocusRef={
            initialFocusRef
          }

          onEscape={
            handleClose
          }

        >



          <div

            ref={(node) => {


              contentRef.current =
                node;



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


            role="dialog"

            aria-modal="true"


            aria-labelledby={
              titleId
            }


            aria-describedby={
              descriptionId
            }



            className={cn(

              modalContentVariants({
                size,
              }),

              contentClassName,

              className

            )}



            {...rest}

          >



            <div

              className={cn(

                modalHeaderVariants(),

                headerClassName

              )}

            >



              <div>


                {
                  icon && (

                    <div
                      className={
                        modalIconVariants()
                      }
                    >

                      {icon}

                    </div>

                  )
                }



                {
                  title && (

                    <h2

                      id={titleId}

                      className={
                        modalTitleVariants()
                      }

                    >

                      {title}

                    </h2>

                  )
                }



                {
                  description && (

                    <p

                      id={descriptionId}

                      className={
                        modalDescriptionVariants()
                      }

                    >

                      {description}

                    </p>

                  )
                }



              </div>





              {
                showCloseButton && (

                  <button

                    type="button"

                    className={
                      modalCloseButtonVariants()
                    }


                    onClick={
                      handleClose
                    }

                  >

                    <X
                      size={18}
                    />

                  </button>

                )
              }



            </div>





            <div

              className={cn(

                modalBodyVariants(),

                bodyClassName

              )}

            >

              {children}

            </div>






            {
              !hideFooter && (

                footer ||

                primaryAction ||

                secondaryAction

              ) && (

                <div

                  className={cn(

                    modalFooterVariants(),

                    footerClassName

                  )}

                >


                  {
                    secondaryAction && (

                      <Button

                        variant={
                          secondaryAction.variant
                        }

                        disabled={
                          secondaryAction.disabled
                        }


                        onClick={
                          secondaryAction.onClick
                        }

                      >

                        {
                          secondaryAction.label
                        }

                      </Button>

                    )
                  }





                  {
                    primaryAction && (

                      <Button

                        variant={
                          primaryAction.variant
                        }


                        disabled={
                          primaryAction.disabled
                        }


                        loading={
                          primaryAction.loading
                        }


                        onClick={
                          primaryAction.onClick
                        }

                      >

                        {
                          primaryAction.label
                        }

                      </Button>

                    )
                  }




                  {
                    footer
                  }



                </div>

              )
            }




          </div>



        </FocusTrap>



      </div>


    </>

  );




  return portal ? (

    <Portal>

      {modal}

    </Portal>


  ) : (

    modal

  );



});




Modal.displayName =
  "Modal";



export default Modal;