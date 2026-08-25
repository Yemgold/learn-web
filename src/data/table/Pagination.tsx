



"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";

import type {
  TablePagination as TablePaginationType,
} from "./types";



interface PaginationProps {


  pagination:
    TablePaginationType;


  className?: string;

}







export function Pagination({
  pagination,

  className,

}: PaginationProps) {


  const {


    page,

    pageSize,

    total,

    onPageChange,

    onPageSizeChange,


  } = pagination;





  const totalPages = Math.ceil(
    total / pageSize
  );





  const pages = Array.from(

    {
      length: totalPages,
    },

    (_, index) =>
      index + 1

  );






  return (

    <div

      className={cn(

        "flex",

        "items-center",

        "justify-between",

        "border-t",

        "px-4",

        "py-3",

        "text-sm",

        className

      )}

    >





      <div

        className="text-slate-600"

      >

        Page {page} of {totalPages}

      </div>







      <div

        className="flex items-center gap-2"

      >



        <button

          type="button"

          disabled={
            page === 1
          }

          onClick={() =>
            onPageChange?.(
              page - 1
            )
          }

          className={cn(

            "rounded-md",

            "border",

            "px-3",

            "py-1.5",

            "disabled:opacity-50"

          )}

        >

          Previous

        </button>







        {
          pages.map(

            (item) => (

              <button


                key={
                  item
                }


                type="button"


                onClick={() =>
                  onPageChange?.(
                    item
                  )
                }


                className={cn(

                  "rounded-md",

                  "px-3",

                  "py-1.5",

                  item === page

                    ? "bg-blue-600 text-white"

                    : "border"


                )}


              >

                {item}

              </button>


            )

          )
        }







        <button

          type="button"


          disabled={
            page === totalPages
          }


          onClick={() =>
            onPageChange?.(
              page + 1
            )
          }


          className={cn(

            "rounded-md",

            "border",

            "px-3",

            "py-1.5",

            "disabled:opacity-50"

          )}

        >

          Next

        </button>



      </div>







      {
        onPageSizeChange && (

          <select


            value={
              pageSize
            }


            onChange={(event) =>
              onPageSizeChange?.(
                Number(
                  event.target.value
                )
              )
            }


            className="rounded-md border px-2 py-1"

          >

            <option value={10}>
              10
            </option>


            <option value={25}>
              25
            </option>


            <option value={50}>
              50
            </option>


            <option value={100}>
              100
            </option>


          </select>

        )
      }




    </div>

  );

}