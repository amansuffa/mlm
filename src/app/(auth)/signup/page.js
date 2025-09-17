import React from 'react'
import { Suspense } from "react";
import Signup from "@/components/Signup";


const SignUpPage = () => {
  return (
   <>
       <Suspense fallback={<p>Loading signup...</p>}>
         <Signup />
       </Suspense>
   </>
  )
}

export default SignUpPage