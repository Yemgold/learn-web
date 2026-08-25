


"use client";

import {
  useState,
} from "react";


import {
  Users,
  UserPlus,
  Trophy,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";

import {
  Button,
} from "@/components/ui/button";







interface TeamMemberInput {


  name:
    string;


  email:
    string;

}








interface CompetitionRegistrationProps {


  competitionName:
    string;


  onSubmit?:
    (
      data: {
        teamName: string;
        members: TeamMemberInput[];
      }
    ) => void;


  className?:
    string;

}









const emptyMember = {

  name: "",

  email: "",

};








export default function CompetitionRegistration({

  competitionName,

  onSubmit,

  className,

}: CompetitionRegistrationProps) {


  const [teamName, setTeamName] =

    useState("");





  const [members, setMembers] =

    useState<TeamMemberInput[]>(

      [

        {
          name:"",
          email:"",
        },

        {
          name:"",
          email:"",
        },

        {
          name:"",
          email:"",
        },

      ]

    );









  function updateMember(

    index:number,

    field:keyof TeamMemberInput,

    value:string

  ) {


    setMembers((previous)=>


      previous.map(

        (member,i)=>


          i === index

            ? {

              ...member,

              [field]:value,

            }

            : member

      )

    );


  }









  function handleSubmit(

    event:React.FormEvent

  ) {


    event.preventDefault();


    onSubmit?.({

      teamName,

      members,

    });


  }








  return (

    <section

      className={cn(

        "rounded-3xl",

        "border",

        "bg-white",

        "p-6",

        className

      )}

    >




      {/* Header */}

      <div

        className="mb-6 flex items-center gap-3"

      >

        <div

          className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"

        >

          <Trophy size={24}/>

        </div>



        <div>


          <h2

            className="text-xl font-bold text-slate-900"

          >

            Register Team

          </h2>



          <p

            className="text-sm text-slate-500"

          >

            {competitionName}

          </p>


        </div>


      </div>








      <form

        onSubmit={handleSubmit}

        className="space-y-6"

      >





        {/* Team name */}

        <div>


          <label

            className="mb-2 block text-sm font-medium text-slate-700"

          >

            Team Name

          </label>



          <input

            value={teamName}

            onChange={(e)=>

              setTeamName(

                e.target.value

              )

            }

            placeholder="Enter team name"

            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"

          />


        </div>









        {/* Members */}

        <div>


          <div

            className="mb-3 flex items-center gap-2"

          >

            <Users size={18}/>


            <h3

              className="font-semibold"

            >

              Team Members (3)

            </h3>


          </div>






          <div

            className="space-y-4"

          >


            {
              members.map(

                (member,index)=>(


                  <div

                    key={index}

                    className="rounded-xl border p-4"

                  >


                    <p

                      className="mb-3 text-sm font-semibold text-slate-600"

                    >

                      Member {index + 1}

                    </p>






                    <input

                      value={member.name}

                      onChange={(e)=>

                        updateMember(

                          index,

                          "name",

                          e.target.value

                        )

                      }

                      placeholder="Full name"

                      className="mb-3 w-full rounded-xl border px-4 py-3"

                    />





                    <input

                      value={member.email}

                      onChange={(e)=>

                        updateMember(

                          index,

                          "email",

                          e.target.value

                        )

                      }

                      placeholder="Email address"

                      type="email"

                      className="w-full rounded-xl border px-4 py-3"

                    />



                  </div>


                )

              )
            }


          </div>


        </div>








        <Button

          type="submit"

          className="w-full"

        >

          <UserPlus size={18}/>

          Register Team

        </Button>




      </form>




    </section>

  );

}