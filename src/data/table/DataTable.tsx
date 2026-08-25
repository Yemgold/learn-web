



"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  tableContainerVariants,
  tableVariants,
  tableWrapperVariants,
} from "./table.variants";


import type {
  DataTableProps,
} from "./types";



import {
  TableHeader,
} from "./TableHeader";


import {
  TableBody,
} from "./TableBody";


import {
  EmptyState,
} from "./EmptyState";


import {
  LoadingState,
} from "./LoadingState";





function DataTable<T>(
  {
    columns,

    data,

    loading = false,

    emptyMessage = "No data available",

    rowKey,

    selectable = false,

    selection,

    className,

  }: DataTableProps<T>

) {



  return (

    <div

      className={cn(

        tableWrapperVariants(),

        className

      )}

    >


      <div

        className={
          tableContainerVariants()
        }

      >


        <table

          className={
            tableVariants()
          }

        >



          <TableHeader

            columns={
              columns
            }

          />





          {
            loading ? (


              <LoadingState

                columnsCount={
                  columns.length
                }

              />


            ) : data.length === 0 ? (


              <EmptyState

                message={
                  emptyMessage
                }

                columnsCount={
                  columns.length
                }

              />


            ) : (


              <TableBody


                columns={
                  columns
                }


                data={
                  data
                }


                rowKey={
                  rowKey
                }


                selectable={
                  selectable
                }


                selection={
                  selection
                }


              />


            )

          }



        </table>


      </div>


    </div>

  );

}



export default DataTable;