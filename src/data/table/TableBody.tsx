


"use client";

import * as React from "react";

import {
  TableRow,
} from "./TableRow";


import type {
  TableColumn,
  TableSelection,
} from "./types";



interface TableBodyProps<T> {


  columns:
    TableColumn<T>[];



  data:
    T[];



  rowKey:
    keyof T;



  selectable?: boolean;



  selection?:
    TableSelection<T>;



}






export function TableBody<T>({
  columns,

  data,

  rowKey,

  selectable = false,

  selection,

}: TableBodyProps<T>) {



  return (

    <tbody>


      {
        data.map(

          (
            row,

            index

          ) => (


            <TableRow

              key={
                String(
                  row[rowKey]
                )
              }


              row={
                row
              }


              index={
                index
              }


              columns={
                columns
              }


              selectable={
                selectable
              }


              selected={
                selection?.selectedRows.includes(
                  row
                ) ?? false
              }


              onSelect={

                selection?.onSelectionChange

                  ? () => {


                      const selected =
                        selection.selectedRows.includes(
                          row
                        );



                      selection.onSelectionChange?.(

                        selected

                          ? selection.selectedRows.filter(
                              item =>
                                item !== row
                            )

                          : [

                              ...selection.selectedRows,

                              row,

                            ]

                      );


                    }

                  : undefined

              }


            />


          )

        )
      }


    </tbody>

  );

}