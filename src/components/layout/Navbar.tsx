

"use client";

import * as React from "react";

import Link from "next/link";

import {
  Menu,
  X,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";


import Container from "./Container";



const navLinks = [

  {
    name: "Home",
    href: "/",
  },

  {
    name: "Competitions",
    href: "/competitions",
  },

  {
    name: "Leaderboard",
    href: "/student/competitions/leaderboard",
  },

  {
    name: "Schools",
    href: "/schools",
  },

];







export default function Navbar() {


  const [open, setOpen] =
    React.useState(false);



  return (

    <header

      className={cn(

        "sticky",

        "top-0",

        "z-50",

        "border-b",

        "bg-white/80",

        "backdrop-blur"

      )}

    >



      <Container>


        <nav

          className="flex h-16 items-center justify-between"

        >




          {/* Logo */}

          <Link

            href="/"

            className="flex items-center gap-2"

          >

            <div

              className={cn(

                "flex",

                "h-9",

                "w-9",

                "items-center",

                "justify-center",

                "rounded-lg",

                "bg-blue-600",

                "font-bold",

                "text-white"

              )}

            >

              JL

            </div>


            <span

              className="text-lg font-bold text-slate-900"

            >

              JAMB League

            </span>


          </Link>









          {/* Desktop Navigation */}

          <div

            className="hidden items-center gap-8 md:flex"

          >


            {
              navLinks.map(

                (link) => (


                  <Link

                    key={
                      link.href
                    }

                    href={
                      link.href
                    }

                    className={cn(

                      "text-sm",

                      "font-medium",

                      "text-slate-600",

                      "transition",

                      "hover:text-blue-600"

                    )}

                  >

                    {
                      link.name
                    }

                  </Link>


                )

              )
            }


          </div>









          {/* Desktop Actions */}

          <div

            className="hidden items-center gap-3 md:flex"

          >


            <Link

              href="/login"

              className={cn(

                "rounded-lg",

                "px-4",

                "py-2",

                "text-sm",

                "font-medium",

                "text-slate-700",

                "hover:bg-slate-100"

              )}

            >

              Login

            </Link>





            <Link

              href="/auth/register"

              className={cn(

                "rounded-lg",

                "bg-blue-600",

                "px-4",

                "py-2",

                "text-sm",

                "font-medium",

                "text-white",

                "hover:bg-blue-700"

              )}

            >

              Join Competition

            </Link>


          </div>








          {/* Mobile Button */}

          <button

            type="button"

            onClick={() =>
              setOpen(!open)
            }

            className="md:hidden"

          >

            {
              open ? (

                <X size={24}/>

              ) : (

                <Menu size={24}/>

              )
            }


          </button>



        </nav>









        {/* Mobile Menu */}

        {
          open && (

            <div

              className="border-t py-4 md:hidden"

            >



              <div

                className="flex flex-col gap-4"

              >


                {
                  navLinks.map(

                    (link) => (


                      <Link

                        key={
                          link.href
                        }

                        href={
                          link.href
                        }

                        onClick={() =>
                          setOpen(false)
                        }

                        className="text-sm font-medium text-slate-700"

                      >

                        {
                          link.name
                        }

                      </Link>


                    )

                  )
                }






                <Link

                  href="/login"

                  className="text-sm font-medium"

                >

                  Login

                </Link>






                <Link

                  href="/auth/register"

                  className={cn(

                    "rounded-lg",

                    "bg-blue-600",

                    "px-4",

                    "py-2",

                    "text-center",

                    "text-sm",

                    "font-medium",

                    "text-white"

                  )}

                >

                  Join Competition

                </Link>



              </div>


            </div>

          )
        }




      </Container>


    </header>

  );

}