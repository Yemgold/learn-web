


"use client";

import * as React from "react";

import {
  Search,
  X,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";



interface SearchInputProps {


  value?: string;



  placeholder?: string;



  onChange: (
    value: string
  ) => void;



  className?: string;

}







export function SearchInput({

  value = "",

  placeholder = "Search...",

  onChange,

  className,

}: SearchInputProps) {



  return (

    <div

      className={cn(

        "relative",

        "flex",

        "items-center",

        className

      )}

    >



      <Search

        size={18}

        className="absolute left-3 text-slate-400"

      />





      <input


        type="text"


        value={value}


        placeholder={placeholder}


        onChange={(event) =>
          onChange(
            event.target.value
          )
        }


        className={cn(

          "h-10",

          "w-full",

          "rounded-lg",

          "border",

          "border-slate-200",

          "bg-white",

          "pl-10",

          "pr-10",

          "text-sm",

          "outline-none",

          "focus:border-blue-500"

        )}


      />







      {
        value && (

          <button


            type="button"


            onClick={() =>
              onChange("")
            }


            className={cn(

              "absolute",

              "right-3",

              "text-slate-400",

              "hover:text-slate-700"

            )}

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