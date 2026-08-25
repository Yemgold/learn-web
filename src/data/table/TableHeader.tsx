

"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";


import {
  tableHeaderVariants,
  tableHeaderCellVariants,
} from "./table.variants";


import type {
  TableColumn,
} from "./types";



interface TableHeaderProps<T> {


  columns:
    TableColumn<T>[];


}




export function TableHeader<T>({
  columns,
}: TableHeaderProps<T>) {


  return (

    <thead

      className={
        tableHeaderVariants()
      }

    >

      <tr>


        {
          columns.map(
            (
              column
            ) => (


              <th

                key={
                  column.id
                }


                className={cn(

                  tableHeaderCellVariants({

                    sortable:
                      Boolean(
                        column.sortable
                      ),

                  })

                )}


                style={{

                  width:
                    column.width,

                }}

              >


                {
                  column.header
                }


              </th>


            )
          )
        }


      </tr>


    </thead>

  );

}