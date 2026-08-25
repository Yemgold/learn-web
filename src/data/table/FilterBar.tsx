

"use client";

import * as React from "react";

import {
  X,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";


import {
  SearchInput,
} from "./SearchInput";



interface FilterBarProps {


  searchValue?: string;



  onSearchChange?: (
    value: string
  ) => void;



  filters?: React.ReactNode;



  onClear?: () => void;



  showClearButton?: boolean;



  className?: string;


}







export function FilterBar({

  searchValue = "",

  onSearchChange,

  filters,

  onClear,

  showClearButton = true,

  className,

}: FilterBarProps) {



  const hasSearch =
    Boolean(searchValue);



  return (

    <div

      className={cn(

        "flex",

        "flex-col",

        "gap-3",

        "rounded-lg",

        "border",

        "bg-white",

        "p-4",

        "md:flex-row",

        "md:items-center",

        className

      )}

    >






      {
        onSearchChange && (

          <div

            className="w-full md:max-w-sm"

          >

            <SearchInput


              value={
                searchValue
              }


              onChange={
                onSearchChange
              }


              placeholder="Search..."

            />


          </div>

        )
      }







      {
        filters && (

          <div

            className="flex flex-1 flex-wrap gap-3"

          >

            {filters}

          </div>

        )
      }







      {
        showClearButton &&
        onClear &&
        (hasSearch || filters) && (


          <button


            type="button"


            onClick={onClear}


            className={cn(

              "inline-flex",

              "items-center",

              "gap-2",

              "rounded-md",

              "border",

              "px-3",

              "py-2",

              "text-sm",

              "text-slate-600",

              "hover:bg-slate-50"

            )}


          >

            <X

              size={16}

            />


            Clear


          </button>


        )
      }




    </div>

  );

}