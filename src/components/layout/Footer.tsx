


"use client";

import Link from "next/link";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import {
  Mail,
} from "lucide-react";


import Container from "./Container";


import {
  cn,
} from "@/lib/utils";




const footerLinks = [

  {
    title: "Platform",

    links: [

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

    ],

  },



  {
    title: "Support",

    links: [

      {
        name: "Help Center",
        href: "/help",
      },

      {
        name: "Contact",
        href: "/contact",
      },

      {
        name: "FAQ",
        href: "/faq",
      },

    ],

  },

];







export default function Footer() {


  return (

    <footer

      className={cn(

        "border-t",

        "bg-slate-950",

        "text-slate-300"

      )}

    >



      <Container>


        <div

          className={cn(

            "grid",

            "gap-10",

            "py-12",

            "md:grid-cols-4"

          )}

        >





          {/* Brand */}

          <div

            className="space-y-4"

          >


            <Link

              href="/"

              className="flex items-center gap-2"

            >

              <div

                className={cn(

                  "flex",

                  "h-10",

                  "w-10",

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

                className="text-lg font-bold text-white"

              >

                JAMB League

              </span>


            </Link>






            <p

              className="max-w-xs text-sm leading-6 text-slate-400"

            >

              A competitive learning platform helping
              students prepare for JAMB through
              teamwork, practice, and academic challenges.

            </p>






            <div

              className="flex gap-3"

            >

              <a

                href="#"

                className="hover:text-white"

              >

                <FaFacebook size={18}/>

              </a>



              <a

                href="#"

                className="hover:text-white"

              >

                <FaTwitter size={18}/>

              </a>



              <a

                href="#"

                className="hover:text-white"

              >

                <FaInstagram size={18}/>

              </a>



              <a

                href="#"

                className="hover:text-white"

              >

                <Mail size={18}/>

              </a>


            </div>



          </div>









          {/* Links */}

          {
            footerLinks.map(

              (section) => (

                <div

                  key={
                    section.title
                  }

                >


                  <h3

                    className="mb-4 font-semibold text-white"

                  >

                    {
                      section.title
                    }

                  </h3>




                  <ul

                    className="space-y-3"

                  >


                    {
                      section.links.map(

                        (link) => (

                          <li

                            key={
                              link.href
                            }

                          >

                            <Link

                              href={
                                link.href
                              }

                              className="text-sm text-slate-400 transition hover:text-white"

                            >

                              {
                                link.name
                              }

                            </Link>


                          </li>

                        )

                      )
                    }


                  </ul>


                </div>

              )

            )
          }








          {/* CTA */}

          <div>


            <h3

              className="mb-4 font-semibold text-white"

            >

              Join JAMB League

            </h3>




            <p

              className="mb-5 text-sm text-slate-400"

            >

              Register your team and compete with
              students across Nigeria.

            </p>




            <Link

              href="/auth/register"

              className={cn(

                "inline-flex",

                "rounded-lg",

                "bg-blue-600",

                "px-5",

                "py-2.5",

                "text-sm",

                "font-medium",

                "text-white",

                "hover:bg-blue-700"

              )}

            >

              Register Now

            </Link>


          </div>




        </div>







        {/* Bottom */}

        <div

          className="border-t border-slate-800 py-6 text-center text-sm text-slate-500"

        >

          © {new Date().getFullYear()} JAMB League.
          All rights reserved.

        </div>



      </Container>


    </footer>

  );

}