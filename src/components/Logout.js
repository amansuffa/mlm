import { doLogout } from '@/app/actions'
import React from 'react'

const Logout = () => {
  return (
    <form action={doLogout}>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium shadow hover:from-gray-800 hover:to-gray-950 transition"
      >
        Logout
      </button>
    </form>
  )
}

export default Logout
