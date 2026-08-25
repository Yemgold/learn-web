



"use client";

import { useEffect } from "react";


export default function AuthError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}) {


  useEffect(() => {

    console.error(error);

  }, [error]);



  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">


        <h2 className="text-2xl font-semibold text-gray-900">

          Something went wrong

        </h2>



        <p className="mt-3 text-gray-600">

          We could not complete your request. Please try again.

        </p>



        <button

          onClick={() => reset()}

          className="mt-6 w-full rounded-xl bg-black px-5 py-3 text-white hover:opacity-90 transition"

        >

          Try Again

        </button>


      </div>

    </main>

  );

}