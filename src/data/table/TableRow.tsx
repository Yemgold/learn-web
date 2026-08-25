




"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";


import {
  tableRowVariants,
} from "./table.variants";


import {
  TableCell,
} from "./TableCell";


import type {
  TableColumn,
} from "./types";




interface TableRowProps<T> {


  row: T;



  index: number;



  columns:
    TableColumn<T>[];



  selectable?: boolean;



  selected?: boolean;



  onSelect?: () => void;



}







export function TableRow<T>({
  row,

  index,

  columns,

  selectable = false,

  selected = false,

  onSelect,

}: TableRowProps<T>) {



  return (

    <tr


      className={cn(

        tableRowVariants({

          selected,

          clickable:
            selectable,

        })

      )}


      onClick={

        selectable

          ? onSelect

          : undefined

      }


    >



      {
        columns.map(

          (
            column
          ) => (


            <TableCell

              key={
                column.id
              }


              column={
                column
              }


              row={
                row
              }


              index={
                index
              }


            />


          )

        )
      }



    </tr>

  );

}