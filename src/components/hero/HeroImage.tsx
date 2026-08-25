



"use client";

import Image from "next/image";

import {
  Trophy,
  Users,
  Medal,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







export default function HeroImage() {


  return (

    <div

      className={cn(

        "relative",

        "mx-auto",

        "w-full",

        "max-w-lg"

      )}

    >




      {/* Glow Background */}

      <div

        className={cn(

          "absolute",

          "inset-0",

          "rounded-full",

          "bg-blue-400/30",

          "blur-3xl"

        )}

      />








      {/* Main Image Container */}

      <div

        className={cn(

          "relative",

          "overflow-hidden",

          "rounded-3xl",

          "border",

          "border-white/20",

          "bg-white/10",

          "shadow-2xl",

          "backdrop-blur"

        )}

      >


        <Image

          src="/images/hero/students.webp"

          alt="Students participating in JAMB League competition"

          width={600}

          height={700}

          priority

          className={cn(

            "h-auto",

            "w-full",

            "object-cover"

          )}

        />


      </div>









      {/* Competition Card */}

      <div

        className={cn(

          "absolute",

          "-left-6",

          "top-10",

          "rounded-2xl",

          "bg-white",

          "p-4",

          "shadow-xl",

          "text-slate-900",

          "animate-[bounce_3s_infinite]"

        )}

      >


        <div

          className="flex items-center gap-3"

        >


          <div

            className={cn(

              "flex",

              "h-10",

              "w-10",

              "items-center",

              "justify-center",

              "rounded-xl",

              "bg-yellow-400"

            )}

          >

            <Trophy

              size={20}

            />


          </div>





          <div>


            <p

              className="text-xs text-slate-500"

            >

              Active Competition

            </p>


            <p

              className="font-bold"

            >

              JAMB League 2027

            </p>


          </div>


        </div>


      </div>









      {/* Leaderboard Card */}

      <div

        className={cn(

          "absolute",

          "-right-6",

          "bottom-10",

          "rounded-2xl",

          "bg-white",

          "p-4",

          "shadow-xl",

          "text-slate-900"

        )}

      >



        <div

          className="flex items-center gap-3"

        >


          <div

            className={cn(

              "flex",

              "h-10",

              "w-10",

              "items-center",

              "justify-center",

              "rounded-xl",

              "bg-blue-600",

              "text-white"

            )}

          >

            <Medal

              size={20}

            />


          </div>






          <div>


            <p

              className="text-xs text-slate-500"

            >

              Top Teams

            </p>



            <p

              className="font-bold"

            >

              500+ Schools

            </p>


          </div>


        </div>


      </div>









      {/* Students Badge */}

      <div

        className={cn(

          "absolute",

          "bottom-0",

          "left-1/2",

          "-translate-x-1/2",

          "rounded-full",

          "bg-slate-900",

          "px-5",

          "py-2",

          "text-sm",

          "font-medium",

          "text-white",

          "shadow-lg"

        )}

      >

        <span className="flex items-center gap-2">

          <Users size={16}/>

          10,000+ Students

        </span>


      </div>




    </div>

  );

}