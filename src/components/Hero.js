import React from 'react'
import Link from "next/link";


const Hero = () => {
  return (
    <div>

<h1>I am home</h1>
<Link href="/login"><button className='px-3 py-2 bg-amber-100 rounded-md mr-2'>login here</button></Link>
<Link href="/signup"><button className='px-3 py-2 bg-amber-100 rounded-md mr-2'>Signup</button></Link>
    </div>
  )
}

export default Hero
