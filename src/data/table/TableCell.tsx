


"use client";

import * as React from "react";

import {
  tableCellVariants,
} from "./table.variants";


import type {
  TableColumn,
} from "./types";



interface TableCellProps<T> {


  column:
    TableColumn<T>;



  row:
    T;



  index:
    number;



}







export function TableCell<T>({
  column,

  row,

  index,

}: TableCellProps<T>) {



  let content:
    React.ReactNode = null;





  if (column.cell) {


    content =
      column.cell(
        row,
        index
      );


  } else if (
    column.accessorKey
  ) {


    content =
      String(
        row[column.accessorKey]
      );


  }





  return (

    <td

      className={
        tableCellVariants()
      }

    >

      {content}

    </td>

  );

}